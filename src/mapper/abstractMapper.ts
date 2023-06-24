import { Context, Flatten, PropType, TranslatorMapper } from '@/utility';
import { Translator } from '@/mapper/translator';
import { ClassConstructor, plainToClass } from 'class-transformer';
import { ValidatorOptions, validateSync } from 'class-validator';
import { TransformationError } from '@/error/transformation.error';

export abstract class AbstractMapper<TModel, TDto> {
  private readonly _translator: Translator<TModel, TDto>;
  private _context: Context;
  private _clazz: ClassConstructor<TDto>;

  constructor(type: ClassConstructor<TDto>) {
    this._translator = {} as Translator<TModel, TDto>;
    this._context = {};
    this._clazz = type;
  }

  public get context(): Context {
    return this._context;
  }

  public set context(ctx: Context) {
    this._context = ctx;
  }

  public addMapper<Key extends string & keyof TModel, KeyDto extends string & keyof TDto>(
    key: KeyDto,
    keyModel: Key,
    mapper: AbstractMapper<
      Flatten<PropType<TModel, Key>>,
      Flatten<PropType<TDto, KeyDto>>
    >,
  ) {
    this._translator[key] = {
      key: keyModel,
      mapper,
    };
  }

  public addMapping<Key extends string & keyof TDto>(
    key: Key,
    transform: (data: Partial<TModel>, ctx?: Context) => PropType<TDto, Key>,
  ) {
    this._translator[key] = {
      mapper: transform,
    };
  }

  public removeMapping<Key extends keyof TDto>(key: Key) {
    this._translator[key] = undefined;
  }

  public transform(data: TModel): TDto;
  public transform(data: TModel[]): TDto[];
  public transform(data: TModel | TModel[]): TDto | TDto[];
  public transform(data: TModel | TModel[]): TDto | TDto[] {
    if (Array.isArray(data)) {
      return data.map((x) => plainToClass(this._clazz, this.transformItem(x)));
    } else {
      return plainToClass(this._clazz, this.transformItem(data));
    }
  }

  public transformAndValidate(
    data: TModel,
    validatorOptions?: ValidatorOptions | undefined,
  ): TDto;
  public transformAndValidate(
    data: TModel[],
    validatorOptions?: ValidatorOptions | undefined,
  ): TDto[];
  public transformAndValidate(
    data: TModel | TModel[],
    validatorOptions?: ValidatorOptions | undefined,
  ): TDto | TDto[];
  public transformAndValidate(
    data: TModel | TModel[],
    validatorOptions?: ValidatorOptions | undefined,
  ): TDto | TDto[] {
    const dataTransformed = this.transform(data);
    const dataToValidate = dataTransformed as object | object[];
    if (Array.isArray(dataToValidate)) {
      dataToValidate.forEach((x, i) => {
        const result = validateSync(x, validatorOptions);
        if (result.length > 0)
          throw new TransformationError(
            `The validation fail in the position ${i}`,
            result,
          );
      });
    } else {
      const result = validateSync(dataToValidate, validatorOptions);
      if (result.length > 0) throw new TransformationError(`The validation fail`, result);
    }
    return dataTransformed;
  }

  private transformItem(data: TModel): TDto {
    const result = {} as TDto;
    (Object.keys(this._translator) as (keyof TDto)[]).forEach((key) => {
      if (!this._translator[key]) return;
      if (typeof this._translator[key]?.mapper === 'function') {
        result[key] = (this._translator[key]?.mapper as Function)(
          {
            ...data,
          },
          this.context,
        ) as PropType<TDto, keyof TDto>;
      } else {
        const translatorMapper = this._translator[key] as TranslatorMapper<TModel>;
        const keyModel = translatorMapper.key as keyof TModel;
        const mapper = translatorMapper.mapper as AbstractMapper<
          PropType<TModel, keyof TModel>,
          PropType<TDto, keyof TDto>
        >;
        const originalContext = { ...mapper.context };
        mapper.context = {
          ...this.context,
          ...mapper.context,
        };
        if (data[keyModel] !== undefined) result[key] = mapper.transform(data[keyModel]);
        mapper.context = originalContext;
      }
    });
    return result;
  }
}

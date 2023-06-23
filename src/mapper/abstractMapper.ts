import { Context, Flatten, PropType, TranslatorMapper } from '@/utility';
import { Translator } from '@/mapper/translator';
import { ClassConstructor, plainToClass } from 'class-transformer';
import { ValidatorOptions, validateSync } from 'class-validator';
import { TransformationError } from '@/error/transformation.error';

export abstract class AbstractMapper<TModel, TDto> {
  private readonly _translator: Translator<TModel, TDto>;
  private _context: Context;

  constructor() {
    this._translator = {} as Translator<TModel, TDto>;
    this._context = {};
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
    clazz: ClassConstructor<Flatten<PropType<TDto, KeyDto>>>,
    mapper: AbstractMapper<
      Flatten<PropType<TModel, Key>>,
      Flatten<PropType<TDto, KeyDto>>
    >,
  ) {
    this._translator[key] = {
      key: keyModel,
      clazz,
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

  public transform(data: TModel, clazz: ClassConstructor<TDto>): TDto;
  public transform(data: TModel[], clazz: ClassConstructor<TDto>): TDto[];
  public transform(data: TModel | TModel[], clazz: ClassConstructor<TDto>): TDto | TDto[];
  public transform(
    data: TModel | TModel[],
    clazz: ClassConstructor<TDto>,
  ): TDto | TDto[] {
    if (Array.isArray(data)) {
      return data.map((x) => plainToClass(clazz, this.transformItem(x)));
    } else {
      return plainToClass(clazz, this.transformItem(data));
    }
  }

  public transformAndValidate(
    data: TModel,
    clazz: ClassConstructor<TDto>,
    validatorOptions?: ValidatorOptions | undefined,
  ): TDto;
  public transformAndValidate(
    data: TModel[],
    clazz: ClassConstructor<TDto>,
    validatorOptions?: ValidatorOptions | undefined,
  ): TDto[];
  public transformAndValidate(
    data: TModel | TModel[],
    clazz: ClassConstructor<TDto>,
    validatorOptions?: ValidatorOptions | undefined,
  ): TDto | TDto[];
  public transformAndValidate(
    data: TModel | TModel[],
    clazz: ClassConstructor<TDto>,
    validatorOptions?: ValidatorOptions | undefined,
  ): TDto | TDto[] {
    const dataTransformed = this.transform(data, clazz);
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
        const clazz = translatorMapper.clazz as ClassConstructor<
          PropType<TDto, keyof TDto>
        >;
        if (data[keyModel] !== undefined)
          result[key] = mapper.transform(data[keyModel], clazz);
        mapper.context = originalContext;
      }
    });
    return result;
  }
}

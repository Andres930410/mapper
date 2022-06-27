import { Translator } from '@/mapper/translator';
import { Flatten, PropType, TranslatorMapper, TranslatorFunction } from '@/utility';

export abstract class AbstractMapper<TModel, TDto> {
  private readonly _translator: Translator<TModel, TDto>;

  constructor() {
    this._translator = {} as Translator<TModel, TDto>;
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
    transform: (data: Partial<TModel>) => PropType<TDto, Key>,
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
      return data.map((x) => this.transformItem(x)) as TDto[];
    } else {
      return this.transformItem(data) as TDto;
    }
  }

  private transformItem(data: TModel): TDto {
    const result = {} as TDto;
    (Object.keys(this._translator) as (keyof TDto)[]).forEach((key) => {
      if (!this._translator[key]) return;
      if (typeof this._translator[key]?.mapper === 'function') {
        result[key] = (this._translator[key]?.mapper as Function)({
          ...data,
        }) as PropType<TDto, keyof TDto>;
      } else {
        const translatorMapper = this._translator[key] as TranslatorMapper<TModel>;
        const keyModel = translatorMapper.key as keyof TModel;
        const mapper = translatorMapper.mapper as AbstractMapper<
          PropType<TModel, keyof TModel>,
          PropType<TDto, keyof TDto>
        >;
        result[key] = mapper.transform(data[keyModel]) as PropType<TDto, keyof TDto>;
      }
    });
    return result;
  }
}

import { Translator } from '@/mapper/translator';
import { Flatten, PropType } from '@/utility';

export abstract class AbstractMapper<TModel, TDto> {
  private readonly _translator: Translator<TModel, TDto>;

  protected constructor() {
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
      key: '',
      mapper: transform,
    };
  }

  public transform<T extends TModel | TModel[]>(data: T): T extends TModel[] ? TDto[] : TDto {
    if (Array.isArray(data)) {
      return data.map(it => this.transformItem(it)) as T extends TModel[] ? TDto[] : TDto;
    }
    return this.transformItem(data as TModel) as T extends TModel[] ? TDto[] : TDto;
  }

  private transformItem<T extends TModel>(data: T): TDto {
    const result = {} as TDto;
    (Object.keys(this._translator) as (keyof TDto)[]).forEach((key) => {
      if (typeof this._translator[key].mapper === 'function') {
        result[key] = (this._translator[key].mapper as Function)({
          ...data,
        }) as PropType<TDto, keyof TDto>;
      } else if (this._translator[key]) {
        const keyModel = this._translator[key].key as keyof TModel;
        const mapper = this._translator[key].mapper as AbstractMapper<
          PropType<TModel, keyof TModel>,
          PropType<TDto, keyof TDto>
        >;
        result[key] = mapper.transform(data[keyModel]) as PropType<TDto, keyof TDto>;
      }
    });
    return result;
  }
}

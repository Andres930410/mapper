import { Translator } from '@/mapper/translator';
import { Flatten, PropType } from '@/utility';

export abstract class AbstractMapper<TModel, TDto> {
  private readonly _translator: Translator<TModel, TDto>;
  private _data: TModel | TModel[];

  constructor(data: TModel | TModel[]) {
    this._translator = {} as Translator<TModel, TDto>;
    this._data = data;
  }

  addMapper<Key extends string & keyof TModel, KeyDto extends string & keyof TDto>(
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

  addMapping<Key extends string & keyof TDto>(
    key: Key,
    transform: (data: Partial<TModel>) => PropType<TDto, Key>,
  ) {
    this._translator[key] = {
      key: '',
      mapper: transform,
    };
  }

  transform(): TDto | TDto[] {
    if (Array.isArray(this._data)) {
      return this._data.map((x) => {
        return this.transformItem(x);
      });
    } else {
      return this.transformItem(this._data);
    }
  }

  private transformItem(data: TModel): TDto {
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
        mapper._data = data[keyModel];
        result[key] = mapper.transform() as PropType<TDto, keyof TDto>;
      }
    });
    return result;
  }
}

import { PropType, Translator } from '@/mapper/translator';

export abstract class AbstractMapper<TModel, TDto> {
  private readonly _translator: Translator<TModel, TDto>;
  private _data: TModel | TModel[];

  constructor(data: TModel | TModel[]) {
    this._translator = {} as Translator<TModel, TDto>;
    this._data = data;
  }

  addMapper<TOtherModel, TOtherDto>(
    key: keyof TDto,
    keyModel: keyof TModel,
    mapper: AbstractMapper<TOtherModel, TOtherDto>,
  ) {
    this._translator[key] = {
      key: keyModel,
      mapper,
    };
  }

  addMapping(
    key: keyof TDto,
    transform: (data: Partial<TModel>) => PropType<TDto, keyof TDto>,
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
      if (!this._translator[key]) return;
      if (typeof this._translator[key].mapper === 'function') {
        result[key] = (this._translator[key].mapper as Function)({
          ...data,
        }) as NonNullable<PropType<TDto, keyof TDto>>;
      } else if (this._translator[key]) {
        const mapper = this._translator[key].mapper as AbstractMapper<unknown, unknown>;
        mapper._data = data[this._translator[key].key as keyof TModel];
        result[key] = mapper.transform() as NonNullable<PropType<TDto, keyof TDto>>;
      }
    });
    return result;
  }
}

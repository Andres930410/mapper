import { AbstractMapper } from '@/mapper/abstractMapper';

export class Mapper<TModel, TDto> extends AbstractMapper<TModel, TDto> {
  constructor(data?: TModel | TModel[] | undefined) {
    super(data ?? ({} as TModel));
  }
}

import { AbstractMapper } from '@/mapper/abstractMapper';

export class Mapper<TModel, TDto> extends AbstractMapper<TModel, TDto> {
  constructor() {
    super();
  }
}

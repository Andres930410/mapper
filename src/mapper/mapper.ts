import { AbstractMapper } from '@/mapper/abstractMapper';
import { ClassConstructor } from 'class-transformer';

export class Mapper<TModel, TDto> extends AbstractMapper<TModel, TDto> {
  constructor(typeModel: ClassConstructor<TModel>, type: ClassConstructor<TDto>) {
    super(typeModel, type);
  }
}

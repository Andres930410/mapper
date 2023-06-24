import { AbstractMapper } from '@/mapper/abstractMapper';
import { ClassConstructor } from 'class-transformer';

export class Mapper<TModel, TDto> extends AbstractMapper<TModel, TDto> {
  constructor(type: ClassConstructor<TDto>) {
    super(type);
  }
}

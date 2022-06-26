import { AbstractMapper } from '@/mapper/abstractMapper';
import { PropType } from '@/utility';

export type Translator<TModel, TDto> = {
  [Property in keyof TDto]:
    | {
        key: string & keyof TModel;
        mapper: AbstractMapper<unknown, unknown>;
      }
    | {
        key: '';
        mapper: (
          data: Partial<TModel>,
        ) => PropType<TDto, Property> | PropType<TDto, Property>[];
      };
};

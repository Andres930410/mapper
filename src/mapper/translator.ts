import { AbstractMapper } from '@/mapper/abstractMapper';

export type PropType<TObj, TKey extends keyof TObj> = TObj[TKey];

export type Translator<TModel, TDto> = {
  [Property in keyof TDto]:
    | {
        key: keyof TModel;
        mapper: AbstractMapper<unknown, unknown>;
      }
    | {
        key: '';
        mapper: (
          data: Partial<TModel>,
        ) => PropType<TDto, Property> | PropType<TDto, Property>[];
      };
};

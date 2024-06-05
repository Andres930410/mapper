import { AbstractMapper } from '@/mapper/abstractMapper';

export type PropType<TObj, TKey extends keyof TObj> = TObj[TKey];

export type Flatten<Type> = Type extends Array<infer Item> ? Item : Type;

export type TranslatorMapper<TModel> = {
  key: string & keyof TModel;
  mapper: AbstractMapper<unknown, unknown>;
};

export type TranslatorFunction<TModel, TDto, TKey extends string & keyof TDto> = {
  mapper: (data: TModel) => PropType<TDto, TKey> | PropType<TDto, TKey>[];
};

export type Context = {
  [key: string]: any;
};

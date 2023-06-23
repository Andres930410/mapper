import { AbstractMapper } from '@/mapper/abstractMapper';
import { ClassConstructor } from 'class-transformer';

export type PropType<TObj, TKey extends keyof TObj> = TObj[TKey];

export type Flatten<Type> = Type extends Array<infer Item> ? Item : Type;

export type TranslatorMapper<TModel> = {
  key: string & keyof TModel;
  clazz: ClassConstructor<unknown>;
  mapper: AbstractMapper<unknown, unknown>;
};

export type TranslatorFunction<TModel, TDto, TKey extends string & keyof TDto> = {
  mapper: (data: Partial<TModel>) => PropType<TDto, TKey> | PropType<TDto, TKey>[];
};

export type Context = {
  [key: string]: any;
};

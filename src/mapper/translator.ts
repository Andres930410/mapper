import { TranslatorFunction, TranslatorMapper } from '@/utility';

export type Translator<TModel, TDto> = {
  [Property in keyof TDto]:
  | undefined
    | TranslatorMapper<TModel>
    | TranslatorFunction<TModel, TDto, string & Property>;
};

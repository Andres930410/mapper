export type PropType<TObj, TKey extends keyof TObj> = TObj[TKey];

export type Flatten<Type> = Type extends Array<infer Item> ? Item : Type;

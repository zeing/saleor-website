export function translate<
  Obj extends {
    translation?:
      | { [TranslationKey in K]?: Obj[TranslationKey] | undefined | null }
      | undefined
      | null;
  },
  K extends keyof Obj
>(obj: Obj, key: K): Obj[K] {
  const result = obj.translation?.[key] || obj[key];
  return result as Obj[K];
}

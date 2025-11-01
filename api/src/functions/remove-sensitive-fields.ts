/**
 * Remove campos com 'hash' no nome
 */
export type RemoveSensitiveFields<T> = {
  [K in keyof T as K extends `${string}blind${string}` ? never : K]: T[K];
};

/**
 * Remove todos os campos com "blind" no nome da chave.
 *
 * @param model - Objeto original contendo diversos campos
 * @returns Um novo objeto sem os campos que contêm "blind"
 */
export const remove_sensitive_fields = <T extends Record<string, any>>(
  model: T,
): RemoveSensitiveFields<T> => {
  const result = {} as RemoveSensitiveFields<T>;

  for (const key in model) {
    if (!key.toLowerCase().includes("blind")) {
      result[key] = model[key];
    }
  }

  return result;
};

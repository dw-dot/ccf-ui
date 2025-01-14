
export const BUILTIN_PARSERS = {
  boolean: (value: unknown): boolean => `${value}` !== 'false',
  json: (value: unknown): unknown => typeof value === 'string' ? JSON.parse(value) : value,
  // eslint-disable-next-line @typescript-eslint/ban-types
  function: (value: unknown): Function => {
    if (typeof value !== 'function') {
      throw new Error('Expected a javascript function');
    }

    return value;
  }
};

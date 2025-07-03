export default function sanitizeInput<T extends Record<string, unknown>>(
  input: Record<string, unknown>,
  target: T,
  whitelist: string[] = []
): T {
  const sanitized: Record<string, unknown> = {};

  Object.keys(input).forEach(key => {
    if (whitelist.includes(key)) {
      sanitized[key] = input[key];
      return;
    }

    if (key in target) {
      if (typeof input[key] === typeof target[key]) {
        sanitized[key] = input[key];
        return;
      }
    }

    sanitized[key] = undefined;
  });
  return sanitized as T;
}

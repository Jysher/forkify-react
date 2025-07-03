export default function filterObject(
  obj: Record<string, unknown>,
  allowedFields: string[]
): Record<string, unknown> {
  const newObj: Record<string, unknown> = {};
  Object.keys(obj).forEach(key => {
    if (allowedFields.includes(key)) {
      newObj[key] = obj[key];
    }
  });
  return newObj;
}

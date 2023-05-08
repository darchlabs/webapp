export const ToMap = <T extends { id: string }>(values: T[]) => {
  return values.reduce((m, value) => {
    m[value.id] = value;
    return m;
  }, {} as { [key: string]: T });
};

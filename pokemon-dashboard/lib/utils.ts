export const toISODate = (d: Date | string) =>
  new Date(d).toISOString().slice(0, 10);

export const safeJSON = (x: unknown) => JSON.stringify(x, null, 2);

export const getOrThrow = (varName) => {
  const value = process.env[varName];
  if (!value) throw new Error(`There is no env var with name: ${varName}`);
  return value;
}

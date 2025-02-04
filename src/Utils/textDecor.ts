export const capitalizeString = (str: string) => {
  if (!str) return "";
  const firstChar = str[0].toUpperCase();
  const rest = str.slice(1).replace(/([A-Z])/g, " $1");
  return firstChar + rest;
};

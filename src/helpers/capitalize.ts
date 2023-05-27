export const capitalizeFirstLetter = (string: string) => {
  const lowercaseString = string.toLowerCase();
  return lowercaseString.charAt(0).toUpperCase() + lowercaseString.slice(1);
};

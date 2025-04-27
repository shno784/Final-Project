// Capitalise the first letter of each word in a string
export const capitaliseWords = (str: string) =>
    str
      .toLowerCase()
      .split(" ")
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
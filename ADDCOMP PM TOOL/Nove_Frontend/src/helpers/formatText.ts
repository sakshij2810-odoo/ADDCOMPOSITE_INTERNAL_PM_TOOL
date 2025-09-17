export function formatText(text: string) {
  if (!text) {
    return '';
  }
  return text
    .split('_') // Split the text by underscores
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
    .join(' '); // Join the words back with spaces
}

export function formatedText(text: string) {
  if (!text) {
    return '';
  }
  const words = text.split('_');
  return words
    .map(
      (word, index) =>
        index === 0
          ? word.charAt(0).toUpperCase() + word.slice(1) // Capitalize only the first word
          : word.toLowerCase() // Ensure the remaining words are in lowercase (or leave as is if desired)
    )
    .join(' '); // Join the words back with spaces
}

export const formatWithCommas = (value: string) => {
  if (!value || value.length === 0) {
    return '';
  }
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

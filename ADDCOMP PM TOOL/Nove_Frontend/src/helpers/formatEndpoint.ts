export function formatEndpoint(endpoint: string) {
  // Extract the last part of the endpoint
  const lastSegment = endpoint.substring(endpoint.lastIndexOf('/') + 1);

  // Replace hyphens with spaces
  let formatted = lastSegment.replace(/-/g, ' ');

  // Capitalize the first letter of each word
  formatted = formatted.replace(/\b\w/g, (char) => char.toUpperCase());

  return formatted;
}

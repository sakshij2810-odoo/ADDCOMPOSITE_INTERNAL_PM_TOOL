export function datatableV2FormatText(text: string) {
    if(!text){
      return "";
    }
      return text
        .split("_") // Split the text by underscores
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
        .join(" "); // Join the words back with spaces
    }
    
export interface CSVParseResult {
  valid: string[];
  invalid: { email: string; reason: string }[];
  duplicates: string[];
}

export function parseStudentEmailCSV(csvContent: string): CSVParseResult {
  const result: CSVParseResult = {
    valid: [],
    invalid: [],
    duplicates: [],
  };

  const lines = csvContent
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length === 0) {
    return result;
  }

  const hasHeader =
    lines[0].toLowerCase().includes("email") ||
    lines[0].toLowerCase().includes("name");
  const dataLines = hasHeader ? lines.slice(1) : lines;

  const seen = new Set<string>();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  for (const line of dataLines) {
    // Split by comma
    const parts = line.split(",").map((p) => p.trim());
    const email = parts[0].toLowerCase();

    // Validate email format
    if (!emailRegex.test(email)) {
      result.invalid.push({
        email,
        reason: "Invalid email format",
      });
      continue;
    }

    // Check for duplicates
    if (seen.has(email)) {
      if (!result.duplicates.includes(email)) {
        result.duplicates.push(email);
      }
      continue;
    }

    seen.add(email);
    result.valid.push(email);
  }

  return result;
}

/**
 * Validate email format
 * @param email - Email to validate
 * @returns True if valid
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Generate sample CSV template
 * @returns CSV template string
 */
export function generateCSVTemplate(): string {
  return `email,name
john.doe@example.com,John Doe
jane.smith@example.com,Jane Smith
student@university.edu,Sample Student`;
}

/**
 * Convert emails array to CSV format
 * @param emails - Array of email addresses
 * @returns CSV formatted string
 */
export function emailsToCSV(emails: string[]): string {
  const header = "email\n";
  const rows = emails.join("\n");
  return header + rows;
}

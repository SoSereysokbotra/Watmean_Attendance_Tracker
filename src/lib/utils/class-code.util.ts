/**
 * Class Code Utility
 * Generates unique codes for class enrollment
 */

/**
 * Generate a random class code
 * Format: ABC-1234 (3 uppercase letters, hyphen, 4 digits)
 * @returns Random class code string
 */
export function generateRandomClassCode(): string {
  // Generate 3 random uppercase letters
  const letters = Array.from({ length: 3 }, () =>
    String.fromCharCode(65 + Math.floor(Math.random() * 26)),
  ).join("");

  // Generate 4 random digits
  const numbers = Math.floor(1000 + Math.random() * 9000).toString();

  return `${letters}-${numbers}`;
}

/**
 * Generate a class code based on class info
 * Format: PREFIX-1234 (class code prefix, hyphen, 4 random digits)
 * @param classCode - The class code (e.g., "PHY-101")
 * @returns Formatted join code (e.g., "PHY-4523")
 */
export function generateClassCodeFromPrefix(classCode: string): string {
  // Extract first 3-4 characters from class code
  const prefix = classCode.replace(/[^A-Z0-9]/g, "").substring(0, 3);

  // Generate 4 random digits
  const numbers = Math.floor(1000 + Math.random() * 9000).toString();

  return `${prefix}-${numbers}`;
}

/**
 * Validate class code format
 * @param code - Code to validate
 * @returns True if valid format
 */
export function isValidClassCode(code: string): boolean {
  // Match format: XXX-XXXX where X can be letter or number
  const pattern = /^[A-Z0-9]{3}-[0-9]{4}$/;
  return pattern.test(code.toUpperCase());
}

/**
 * Normalize class code to uppercase and remove spaces
 * @param code - Code to normalize
 * @returns Normalized code
 */
export function normalizeClassCode(code: string): string {
  return code.toUpperCase().trim().replace(/\s/g, "");
}

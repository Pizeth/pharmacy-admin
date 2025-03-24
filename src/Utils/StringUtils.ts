export class StringUtils {
  /**
   * Capitalizes the first letter and adds spaces before capital letters
   * @param str - Input string to transform
   * @returns Formatted string (e.g. "helloWorld" becomes "Hello World")
   */
  static capitalize(str: string): string {
    if (!str) return "";
    const firstChar = str[0].toUpperCase();
    const rest = str.slice(1).replace(/([A-Z])/g, " $1");
    return firstChar + rest;
  }

  // const getLastSegment = (path: string): string => {
  //   // Split the string by '/' and filter out empty segments
  //   const segments = path.split("/").filter((segment) => segment.length > 0);
  //   // Return the last segment
  //   return segments[segments.length - 1] || "";
  // };

  /**
   * Extracts the last segment from a URL path
   * @param path - URL path string
   * @returns Last segment of the path (e.g. "api/user/profile" returns "profile")
   */
  static getLastSegment(path: string): string {
    const lastSlashIndex = path.lastIndexOf("/");
    return lastSlashIndex === -1 ? path : path.slice(lastSlashIndex + 1);
  }

  /**
   * Truncates a string to a specified maximum length, adding an ellipsis (...) if truncated.
   * @param text - The input string to be truncated
   * @param maxLength - The maximum length of the resulting string before truncation
   * @returns The truncated string with ellipsis if longer than maxLength, or the original string if shorter
   * @example
   * ```typescript
   * StringUtils.truncate("Hello World", 5) // returns "Hello..."
   * StringUtils.truncate("Hi", 5) // returns "Hi"
   * ```
   */
  static truncate(text: string, maxLength: number): string {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  }

  /**
   * Sanitizes a string by removing all non-alphanumeric characters.
   * @param input - The string to be sanitized
   * @returns The sanitized string containing only alphanumeric characters
   * @example
   * StringUtils.sanitize("Hello, World!") // Returns "HelloWorld"
   * StringUtils.sanitize("user@email.com") // Returns "useremailcom"
   */
  static sanitize(input: string): string {
    return input.replace(/[^a-zA-Z0-9]/g, "");
  }

  /**
   * Checks if a value is empty based on its type.
   *
   * @param value - The value to check for emptiness
   * @returns `true` if the value is considered empty, `false` otherwise
   *
   * @remarks
   * This method considers a value empty if:
   * - It is null or undefined
   * - It is a string or array with length 0
   * - It is an empty Map or Set
   * - It is a plain object ({} or new Object()) with no own properties
   * - It is an array-like object with length 0
   *
   * Non-empty cases include:
   * - Non-plain objects (Date, RegExp, custom classes)
   * - Primitive values (numbers, booleans, symbols)
   * - Functions
   *
   * @example
   * ```typescript
   * isEmpty(null);       // returns true
   * isEmpty("");         // returns true
   * isEmpty([]);         // returns true
   * isEmpty({});         // returns true
   * isEmpty(new Map());  // returns true
   * isEmpty(0);          // returns false
   * isEmpty(false);      // returns false
   * isEmpty(new Date()); // returns false
   * ```
   */
  static isEmpty = (value: any): boolean => {
    if (value == null) return true; // null/undefined

    // Handle strings and arrays first
    if (typeof value === "string" || Array.isArray(value))
      return value.length === 0;

    if (typeof value === "object") {
      // 1. Check special collection types first
      if (value instanceof Map || value instanceof Set) return value.size === 0;

      // 2. Check plain Plain objects ({} or new Object()) before length checks
      if (Object.getPrototypeOf(value) === Object.prototype) {
        return Object.keys(value).length === 0; // Plain objects use keys
      }

      // 3. Handle array-like objects (arguments, NodeList, etc) AFTER plain object check
      if (typeof value.length === "number") return value.length === 0; // Non-plain objects with length

      // 4. Other object types (Date, RegExp, custom classes, etc.)
      return false; // Other non-plain objects
    }

    // All Non-object primitives (numbers, booleans, symbols, functions, etx)
    return false;
  };

  /**
   * Compares two strings for equality.
   * Empty strings are considered equal to each other.
   *
   * @param a - The first string to compare
   * @param b - The second string to compare
   * @returns True if both strings are equal or both are empty, false otherwise
   *
   * @example
   * ```typescript
   * StringUtils.isEqual("hello", "hello") // returns true
   * StringUtils.isEqual("", "") // returns true
   * StringUtils.isEqual("hello", "world") // returns false
   * ```
   */
  static isEqual(a: any, b: any): boolean {
    console.log("isEqual", a, b);
    if (this.isEmpty(a) && this.isEmpty(b)) return true;
    return a === b;
  }
}

export default StringUtils;

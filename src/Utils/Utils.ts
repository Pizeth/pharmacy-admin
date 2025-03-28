import { isEmpty } from "react-admin";

export class Utils {
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
   * Checks if a value is a string, null, or undefined.
   * @param value - The value to check.
   * @returns A type predicate indicating whether the value is a string, null, or undefined.
   * @example
   * ```typescript
   * isPlainText("hello") // true
   * isPlainText(null) // true
   * isPlainText(undefined) // true
   * isPlainText(123) // false
   * ```
   */
  private static isPlainText(
    value: unknown,
  ): value is string | null | undefined {
    return typeof value === "string" || value === null || value === undefined;
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
   * - It is a string (primitive or String object) with length 0
   * - It is an array with length 0
   * - It is an empty Map or Set
   * - It is an empty ArrayBuffer or typed array (e.g., Int8Array)
   * - It is a plain object ({} or new Object()) with no own properties
   * - It is an array-like object with length 0 (ignoring symbol properties)
   *
   * Non-empty cases include:
   * - WeakMap and WeakSet (since their size cannot be determined)
   * - Non-plain objects (Date, RegExp, custom classes)
   * - Primitive values (numbers, booleans, symbols)
   * - Functions
   *
   * @example
   * ```typescript
   * isEmpty(null);               // returns true
   * isEmpty("");                 // returns true
   * isEmpty([]);                 // returns true
   * isEmpty(new Int8Array(0));   // returns true
   * isEmpty(new ArrayBuffer(0)); // returns true
   * isEmpty({});                 // returns true
   * isEmpty(new Map());          // returns true
   * isEmpty(0);                  // returns false
   * isEmpty(false);              // returns false
   * isEmpty(new Date());         // returns false
   * isEmpty(new WeakMap());      // returns false
   * ```
   */
  static isEmpty = (value: unknown): boolean => {
    // Handle null and undefined as empty
    if (value === null || value === undefined) return true;

    // Handle strings (both primitive and object)
    if (typeof value === "string" || value instanceof String) {
      return String(value).length === 0;
    }

    // Handle strings (both primitive and object)
    if (typeof value === "string") {
      return value.length === 0;
    }
    if (value instanceof String) {
      return String(value).length === 0;
    }

    // Handle arrays
    if (Array.isArray(value)) {
      return value.length === 0;
    }

    // Skip non-objects (e.g., numbers, strings, booleans) are not empty
    if (typeof value !== "object") return false;

    // Helper to identify plain objects, including those with no prototype (e.g., Object.create(null))
    const isPlainObject = (val: object) =>
      Object.prototype.toString.call(val) === "[object Object]" ||
      Object.getPrototypeOf(val) === null;

    // 1. Check special collection types first (Maps and Sets use size)
    if (value instanceof Map || value instanceof Set) return value.size === 0;

    if (value instanceof ArrayBuffer) {
      return value.byteLength === 0;
    }
    if (ArrayBuffer.isView(value)) {
      return (value as any).length === 0;
    }

    // 2. Check plain objects ({} or new Object()) for no keys or symbol properties before length checks
    const plainObject = isPlainObject(value);
    if (plainObject) {
      return (
        Object.keys(value).length === 0 &&
        Object.getOwnPropertySymbols(value).length === 0
      );
    }

    // 3. Handle array-like objects (arguments, NodeList, etc) AFTER plain object check
    if (typeof (value as any).length === "number" && !plainObject) {
      return (value as any).length === 0; // Non-plain objects with length
    }

    // 4. Other object types (Date, RegExp, custom classes, etc.) and non-object primitives (numbers, booleans, symbols, functions, etx)
    return false;
  };

  /**
   * Performs a deep comparison between two values to determine if they are equivalent.
   * Uses WeakMap to handle circular references during comparison.
   * Supports comparing arrays, maps, sets, dates, regexes, errors, and plain objects.
   * Functions, DOM nodes, WeakMap, WeakSet, and Promise are not supported.
   * If an object has an `equals` method, it will be used to determine equality.
   * Note: If only one object has an `equals` method, the result may depend on the order of arguments.
   *
   * @param value - The first value to compare
   * @param other - The second value to compare
   * @param options - Optional configuration object
   * @param options.isPassword - If `true`, treats both values as equal if they are plain text (string, null, or undefined) and empty
   * @returns boolean - `true` if the values are deeply equal, `false` otherwise.
   *
   * @example
   * ```typescript
   * const obj1 = { a: 1, b: { c: 2 } };
   * const obj2 = { a: 1, b: { c: 2 } };
   * Utils.isEqual(obj1, obj2); // returns true
   * ```
   */
  static isEqual(
    value: any,
    other: any,
    options: { isPassword?: boolean } = {},
  ): boolean {
    if (
      options.isPassword &&
      this.isPlainText(value) &&
      this.isPlainText(other)
    ) {
      return this.isEmpty(value) && this.isEmpty(other);
    }

    return this.deepEqual(value, other, new WeakMap<object, object>());
  }

  /**
   * Asynchronously compares two values for deep equality.
   * This method handles complex objects and circular references using WeakMap.
   *
   * @param value - The first value to compare
   * @param other - The second value to compare
   * @returns A Promise that resolves to `true` if the values are deeply equal, `false` otherwise.
   *
   * @example
   * ```typescript
   * const obj1 = { a: 1, b: { c: 2 } };
   * const obj2 = { a: 1, b: { c: 2 } };
   * const isEqual = await Utils.asyncIsEqual(obj1, obj2); // Returns true
   * ```
   */
  static async asyncIsEqual(value: any, other: any): Promise<boolean> {
    return this.asyncDeepEqual(value, other, new WeakMap<object, object>());
  }

  /**
   * Performs a deep equality, recursively compares between two values of any type.
   * This method handles various JavaScript built-in types and complex objects.
   *
   * @param a - First value to compare
   * @param b - Second value to compare
   * @param seen - WeakMap to track visited objects and handle circular references during comparison
   * @returns boolean - `true` if the values are deeply equal, `false` otherwise.
   *
   * @remarks
   * Handles the following cases:
   * - Primitive values (including special cases like -0 vs +0)
   * - NaN equality
   * - Functions (by reference)
   * - DOM nodes (by reference)
   * - Date objects (by timestamp)
   * - RegExp objects (by source and flags)
   * - Error objects (by name and message)
   * - Map objects (by entries)
   * - Set objects (by values with deep equality)
   * - TypedArrays (by byte-level comparison)
   * - Arrays (by elements with deep equality)
   * - Plain objects (by enumerable properties)
   * - Circular references
   *
   * @private
   * @static
   */
  private static deepEqual(
    a: any,
    b: any,
    seen: WeakMap<object, object>,
  ): boolean {
    // Handle strict equality, including special cases like -0 vs +0
    if (a === b) return a !== 0 || 1 / a === 1 / b;

    // Handle NaN equality
    if (Number.isNaN(a) && Number.isNaN(b)) return true;

    // Check for type mismatch
    if (typeof a !== typeof b) return false;

    // Symbols can be compared by their description (optional)
    if (typeof a === "symbol" && typeof b === "symbol") {
      return a === b || a.toString() === b.toString();
    }

    // Functions and DOM nodes are not deeply compared
    if (typeof a === "function" || a instanceof Node || b instanceof Node)
      return false;

    // WeakMap, WeakSet, and Promise are not deeply compared
    if (
      a instanceof WeakMap ||
      a instanceof WeakSet ||
      a instanceof Promise ||
      b instanceof WeakMap ||
      b instanceof WeakSet ||
      b instanceof Promise
    ) {
      return false;
    }

    // Handle objects (including arrays, maps, sets, etc.)
    if (typeof a === "object" && a !== null && b !== null) {
      // Check for circular references
      if (seen.has(a)) return seen.get(a) === b;
      seen.set(a, b);

      // Use type tags instead of constructors
      const aTag = Object.prototype.toString.call(a);
      const bTag = Object.prototype.toString.call(b);
      if (aTag !== bTag) return false;

      // Support custom equals methods
      // if (typeof a.equals === "function" && typeof b.equals === "function") {
      //   return a.equals(b);
      // }

      // Support custom equals methods (asymmetric)
      // if (typeof a.equals === "function") {
      //   return a.equals(b);
      // }
      // if (typeof b.equals === "function") {
      //   return b.equals(a);
      // }

      // Support custom equals methods
      if (typeof a.equals === "function" && typeof b.equals === "function") {
        // Both have equals: enforce symmetry
        return a.equals(b) && b.equals(a);
      } else if (typeof a.equals === "function") {
        // Only a has equals: delegate to a
        return a.equals(b);
      } else if (typeof b.equals === "function") {
        // Only b has equals: delegate to b
        return b.equals(a);
      }

      // Handle Date objects
      if (a instanceof Date && b instanceof Date)
        return a.getTime() === b.getTime();

      // Handle RegExp objects
      if (a instanceof RegExp && b instanceof RegExp)
        return a.source === b.source && a.flags === b.flags;

      // Handle Error objects
      if (a instanceof Error && b instanceof Error)
        return a.name === b.name && a.message === b.message;

      // Handle Map objects
      if (a instanceof Map && b instanceof Map) {
        return this.deepEqual(
          Array.from(a.entries()),
          Array.from(b.entries()),
          seen,
        );
      }

      // Handle Set objects
      // if (a instanceof Set && b instanceof Set) {
      //   if (a.size !== b.size) return false;
      //   return Array.from(a).every((val) => b.has(val));
      // }

      // Handle Set objects with deep equality
      // if (a instanceof Set && b instanceof Set) {
      //   if (a.size !== b.size) return false;
      //   for (const valA of a) {
      //     let found = false;
      //     for (const valB of b) {
      //       if (this.deepEqual(valA, valB, seen)) {
      //         found = true;
      //         break;
      //       }
      //     }
      //     if (!found) return false;
      //   }
      //   return true;
      // }

      // Handle Set objects with deep equality
      if (a instanceof Set && b instanceof Set) {
        if (a.size !== b.size) return false;

        const aArray = Array.from(a);
        // Optimization: Check if sets are equal using reference equality first
        const allMatchByReference = aArray.every((val) => b.has(val));
        if (allMatchByReference) return true;

        // Convert b to an array to allow tracking of used elements
        const bArray = Array.from(b);

        const isSerializable = (val: any) => {
          try {
            JSON.stringify(val);
            return true;
          } catch {
            return false;
          }
        };

        if (aArray.every(isSerializable) && bArray.every(isSerializable)) {
          const hashCount = new Map<string, number>();
          for (const val of aArray) {
            const hash = JSON.stringify(val);
            hashCount.set(hash, (hashCount.get(hash) || 0) + 1);
          }
          for (const val of bArray) {
            const hash = JSON.stringify(val);
            const count = hashCount.get(hash);
            if (count === undefined || count === 0) return false;
            hashCount.set(hash, count - 1);
          }
          return true;
        }

        // Fallback to deep equality with tracking
        const usedIndices = new Set<number>(); // Tracks which elements in b have been matched

        for (const valA of aArray) {
          let found = false;
          for (let i = 0; i < bArray.length; i++) {
            if (usedIndices.has(i)) continue; // Skip already matched elements
            if (this.deepEqual(valA, bArray[i], seen)) {
              usedIndices.add(i);
              found = true;
              break;
            }
          }
          if (!found) return false;
        }
        return true;
      }

      // Handle typed arrays
      if (ArrayBuffer.isView(a) && ArrayBuffer.isView(b)) {
        if (a.constructor !== b.constructor || a.byteLength !== b.byteLength)
          return false;
        const viewA = new Uint8Array(a.buffer, a.byteOffset, a.byteLength);
        const viewB = new Uint8Array(b.buffer, b.byteOffset, b.byteLength);
        return viewA.every((val, i) => val === viewB[i]);
      }

      // Handle arrays
      if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) return false;
        return a.every((val, i) => this.deepEqual(val, b[i], seen));
      }

      // Handle ALL objects (plain and non-plain) with enumerable properties
      const keysA = this.getEnumerableOwnKeys(a);
      const keysB = this.getEnumerableOwnKeys(b);
      if (keysA.length !== keysB.length) return false;
      return keysA.every((key) => this.deepEqual(a[key], b[key], seen));
    }

    return false;
  }

  /**
   * Asynchronously performs a deep equality, recursively compares between two values of any type, handling Promises.
   *
   * @param a - The first value to compare
   * @param b - The second value to compare
   * @param seen - WeakMap to track visited objects and handle circular references during comparison
   * @returns A Promise that resolves to a boolean indicating whether the values are deeply equal
   * @throws {Error} If Promise resolution fails
   *
   * @remarks
   * This method handles Promise objects by awaiting their resolution before comparison.
   * For non-Promise values, it delegates to the synchronous deepEqual method.
   *
   * @private
   * @static
   */
  private static async asyncDeepEqual(
    a: any,
    b: any,
    seen: WeakMap<object, object>,
  ): Promise<boolean> {
    if (a instanceof Promise && b instanceof Promise) {
      try {
        const [resolvedA, resolvedB] = await Promise.all([a, b]);
        return this.asyncDeepEqual(resolvedA, resolvedB, seen);
      } catch {
        return false;
      }
    }

    return this.deepEqual(a, b, seen);
  }

  /**
   * Returns an array of all enumerable own property keys (both string and symbol) of an object.
   * @param obj - The object to get enumerable keys from.
   * @returns An array containing all enumerable string keys and symbol properties.
   * @private
   * @static
   */
  private static getEnumerableOwnKeys(obj: object): Array<string | symbol> {
    return [
      ...Object.keys(obj),
      ...Object.getOwnPropertySymbols(obj).filter((sym) =>
        obj.propertyIsEnumerable(sym),
      ),
    ];
  }
}

export default Utils;

// Ensure constructors match
// if (a.constructor !== b.constructor) return false;

// // Handle Map objects
// if (a instanceof Map && b instanceof Map) {
//   if (a.size !== b.size) return false;
//   for (const [key, val] of a) {
//     if (!b.has(key) || !this.deepEqual(val, b.get(key), seen)) return false;
//   }
//   return true;
// }

// Handle Set objects with deep equality
// if (a instanceof Set && b instanceof Set) {
//   if (a.size !== b.size) return false;

//   // Optimization: Check if sets are equal using reference equality first
//   const allMatchByReference = Array.from(a).every((val) => b.has(val));
//   if (allMatchByReference) return true;

//   // Fallback to deep equality with tracking
//   const bArray = Array.from(b);
//   const usedIndices = new Set<number>();

//   for (const valA of a) {
//     let found = false;
//     for (let i = 0; i < bArray.length; i++) {
//       if (usedIndices.has(i)) continue;
//       if (this.deepEqual(valA, bArray[i], seen)) {
//         usedIndices.add(i);
//         found = true;
//         break;
//       }
//     }
//     if (!found) return false;
//   }
//   return true;
// }

// Handle plain objects (only enumerable properties)
// if (
//   Object.getPrototypeOf(a) === Object.prototype &&
//   Object.getPrototypeOf(b) === Object.prototype
// ) {
//   const keysA = [
//     ...Object.keys(a),
//     ...Object.getOwnPropertySymbols(a).filter((sym) =>
//       a.propertyIsEnumerable(sym),
//     ),
//   ];
//   const keysB = [
//     ...Object.keys(b),
//     ...Object.getOwnPropertySymbols(b).filter((sym) =>
//       b.propertyIsEnumerable(sym),
//     ),
//   ];
//   if (keysA.length !== keysB.length) return false;
//   return keysA.every((key) => this.deepEqual(a[key], b[key], seen));
// }

// Handle general objects
// const keysA = Reflect.ownKeys(a);
// const keysB = Reflect.ownKeys(b);

// 2. Check plain Plain objects ({} or new Object()) before length checks
// if (Object.getPrototypeOf(value) === Object.prototype) {
//   return Object.keys(value).length === 0; // Plain objects use keys
// }

// // 3. Handle array-like objects (e.g., arrays, argumentss, NodeList, etc) AFTER plain object check
// if (typeof value.length === "number") return value.length === 0; // Non-plain objects with length

// // Handle strings and arrays first
// if (typeof value === "string" || Array.isArray(value))
//   return value.length === 0;

// if (typeof value === "object") {
//   // 2. Check plain objects ({} or new Object()) before length checks
//   if (Object.getPrototypeOf(value) === Object.prototype) {
//     const keys = this.getEnumerableOwnKeys(value);
//     return keys.length === 0; // Plain objects use keys
//   }
//   // Handle all plain objects (including Object.create(null))
//   if (Object.prototype.toString.call(value) === "[object Object]") {
//     return (
//       Object.keys(value).length === 0 &&
//       Object.getOwnPropertySymbols(value).length === 0
//     );
//   }

//   // 4. Other object types (Date, RegExp, custom classes, etc.)
//   return false; // Other non-plain objects
// }

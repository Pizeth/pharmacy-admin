import { ArrayLike, IsEmptyOptions, WithIsEmpty } from "../Types/types";

// Cache frequently used references for performance
const objectProto = Object.prototype;
const objectToString = objectProto.toString;
const getProto = Object.getPrototypeOf;
const hasOwnProperty = objectProto.hasOwnProperty;
const objectKeys = Object.keys;
const getOwnPropertyNames = Object.getOwnPropertyNames;
const getOwnPropertySymbols = Object.getOwnPropertySymbols;
export class Utils {
  // cache proxy check once
  static proxyTag: string | null = "[object Object]";

  static {
    // Initialize proxy tag once
    try {
      const { proxy, revoke } = Proxy.revocable({}, {});
      this.proxyTag = objectToString.call(proxy);
      revoke();
    } catch {
      this.proxyTag = null;
    }
  }

  // Modify the static initialization block
  static {
    // Initialize proxy tag once
    try {
      const { proxy, revoke } = Proxy.revocable({}, {});
      this.proxyTag = objectToString.call(proxy);
      revoke();
    } catch (e) {
      // Fallback for environments where Proxy creation fails
      this.proxyTag = null;
      if (typeof Proxy !== "undefined") {
        // If Proxy exists but instantiation failed, check constructor name fallback
        try {
          const proxy = new Proxy({}, {});
          this.proxyTag = objectToString.call(proxy);
          delete (proxy as any).constructor; // Try to break potential infinite loops
        } catch (subError) {
          // Final fallback to constructor name check
          this.proxyTag = "[object Proxy]";
        }
      }
    }
  }

  static {
    try {
      // Create and immediately revoke proxy for safety
      const { proxy, revoke } = Proxy.revocable({}, {});
      this.proxyTag = objectToString.call(proxy);
      revoke();
    } catch {
      this.proxyTag = null; // Proxy not supported
    }
  }

  private static isDevelopment(): boolean {
    return (
      (typeof process !== "undefined" &&
        process.env.NODE_ENV !== "production") ||
      (typeof import.meta !== "undefined" &&
        import.meta.env?.MODE !== "production") ||
      (typeof window !== "undefined" && (window as any).__DEV__ === true)
    );
  }

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
  static isPlainText(value: unknown): value is string | null | undefined {
    return typeof value === "string" || value === null || value === undefined;
  }

  /**
   * Helper to determines whether a value is a plain object, including those with no prototype
   * (i.e. created by {} or new Object(), or with a null prototype Object.create(null)).
   *
   * @param value - The object to check.
   * @returns `true` if the value is a plain object, `false` otherwise .
   */
  static isPlainObject = (val: object): boolean => {
    // Filter non-objects, null, and non-[object Object] types by checking its prototype chain
    if (
      typeof val !== "object" ||
      val === null ||
      objectToString.call(val) !== "[object Object]"
    ) {
      return false;
    }

    // Check if the object has a prototype chain that leads to null
    // This is a more reliable way to check for plain objects
    const proto = getProto(val);
    return proto === null || proto === objectProto;
  };

  /**
   * Helper to determines if a plain object is effectively empty by checking various conditions.
   *
   * @param obj - The object to check for emptiness
   * @returns {boolean} True if the object is considered empty, false otherwise
   *
   * An object is considered empty if:
   * - It has no enumerable or non-enumerable properties and no symbols
   * - It only has a "length" property (enumerable or not) with value 0 and no symbols
   * - It has no properties other than potentially a "length" property equal to 0
   *
   * @example
   * // Returns true
   * isEmptyPlainObject({})
   * isEmptyPlainObject({ length: 0 })
   *
   * // Returns false
   * isEmptyPlainObject({ a: 1 })
   * isEmptyPlainObject({ length: 1 })
   */
  static isEmptyPlainObject = (obj: object): boolean => {
    // Fast check for enumerable keys first
    const keys = Object.keys(obj);
    if (keys.length === 0) {
      // Get all own properties (enumerable AND non-enumerable string keys, and all symbols)
      const allProps = Object.getOwnPropertyNames(obj);
      const allSymbols = Object.getOwnPropertySymbols(obj);

      // Case 1: Truly empty object (no own properties at all)
      if (allProps.length === 0 && allSymbols.length === 0) {
        return true;
      }

      // Case 2: Only has "length" property (enumerable or not) and no symbols
      if (
        allProps.length === 1 &&
        allProps[0] === "length" &&
        allSymbols.length === 0
      ) {
        const len = (obj as ArrayLike).length;
        // Ensure length is a number before comparing
        return typeof len === "number" && len === 0;
      }
    } else if (keys.length === 1 && keys[0] === "length") {
      // Quick check for just length property (enumerable)
      const len = (obj as ArrayLike).length;
      return typeof len === "number" && len === 0;
    }

    // Case 3: Any other properties, not empty
    return false;
  };

  static isEmptyPlainObject = (obj: object): boolean => {
    // Check for enumerable keys first (fastest)
    const keys = objectKeys(obj);

    // Quick path: no enumerable keys
    if (keys.length === 0) {
      // Get all property names (including non-enumerable)
      const allProps = getOwnPropertyNames(obj);
      const allSymbols = getOwnPropertySymbols(obj);

      // Truly empty: no properties at all
      if (allProps.length === 0 && allSymbols.length === 0) {
        return true;
      }

      // Check for only "length" property with value 0
      if (
        allProps.length === 1 &&
        allProps[0] === "length" &&
        allSymbols.length === 0
      ) {
        const len = (obj as ArrayLike).length;
        return typeof len === "number" && len === 0;
      }

      return false;
    }

    // Check single enumerable "length" property case
    if (keys.length === 1 && keys[0] === "length") {
      const len = (obj as ArrayLike).length;
      return typeof len === "number" && len === 0;
    }

    return false;
  };
  /**
   * Type guard for array-like objects
   * Checks if a value is array-like by verifying if it's an object with a numeric length property.
   * Array-like objects include arrays, strings, and objects with a length property.
   *
   * @param value - The value to check
   * @returns {boolean} `true` if the value is array-like, `false` otherwise
   *
   * @example
   * ```typescript
   * isArrayLike([1, 2, 3]); // true
   * isArrayLike("string"); // true
   * isArrayLike({ length: 3 }); // true
   * isArrayLike(null); // false
   * isArrayLike(undefined); // false
   * ```
   */
  static isArrayLike = (value: unknown): value is ArrayLike => {
    return (
      typeof value === "object" &&
      value !== null &&
      "length" in value &&
      typeof (value as ArrayLike).length === "number"
    );
  };

  /**
   * Type guard for collections (Map and Set)
   * Checks if a value is a collection by verifying if it's an instance of Map or Set.
   *
   * @param value - The value to check
   * @returns {boolean} `true` if the value is a collection, `false` otherwise
   *
   * @example
   * ```typescript
   * isCollection(new Map()); // true
   * isCollection(new Set()); // true
   * isCollection({}); // false
   * ```
   */
  static isCollection = (value: unknown): value is Map<any, any> | Set<any> => {
    return value instanceof Map || value instanceof Set;
  };

  /**
   * Type guard for ArrayBufferView
   * Checks if a value is an instance of ArrayBufferView (TypedArray or DataView).
   *
   * @param value - The value to check
   * @returns {boolean} `true` if the value is an ArrayBufferView, `false` otherwise
   *
   * @example
   * ```typescript
   * isBufferView(new Int8Array(10)); // true
   * isBufferView(new DataView(new ArrayBuffer(10))); // true
   * isBufferView([]); // false
   * ```
   */
  static isBufferView = (value: unknown): value is ArrayBufferView => {
    return ArrayBuffer.isView(value) && !(value instanceof DataView);
  };

  /**
   * Determines if the given value is an ArrayBuffer or ArrayBufferView type.
   * This method provides cross-realm safety checks for buffer types.
   *
   * @param value - The value to check
   * @returns `true` if the value is an ArrayBuffer or ArrayBufferView, `false` otherwise
   *
   * @example
   * ```ts
   * const buffer = new ArrayBuffer(8);
   * Utils.isBufferType(buffer); // returns true
   *
   * const view = new Int8Array(buffer);
   * Utils.isBufferType(view); // returns true
   *
   * Utils.isBufferType({}); // returns false
   * ```
   */
  static isBufferType(value: unknown): value is ArrayBuffer | ArrayBufferView {
    if (this.isBufferView(value) || value instanceof ArrayBuffer) return true;
    //fallback to Object.prototype.toString for cross-realm safety
    const tag = Object.prototype.toString.call(value);
    return (
      tag === "[object ArrayBuffer]" ||
      (tag.includes("Array") && tag.includes("Buffer")) ||
      tag === "[object DataView]"
    );
  }

  // Enhanced buffer type check
  static isBufferType = (
    value: unknown,
  ): value is ArrayBuffer | ArrayBufferView => {
    // Direct instanceof checks first (fastest path)
    if (value instanceof ArrayBuffer || ArrayBuffer.isView(value)) return true;

    // Fall back to toString for cross-realm safety
    const tag = objectToString.call(value);
    return (
      tag === "[object ArrayBuffer]" ||
      (tag.startsWith("[object ") &&
        ((tag.includes("Array") && tag.includes("Buffer")) ||
          tag === "[object DataView]"))
    );
  };

  /**
   * Checks if a value is empty based on its type.
   *
   * @param value - The value to check for emptiness
   * @param options - Optional configuration for custom emptiness checks.
   * @param _seen - Internal WeakSet used for circular reference tracking.
   * @returns `true` if the value is considered empty, `false` otherwise
   *
   * @complexity
   * - Time: O(1) for primitives, arrays, collections
   * - Time: O(n) for objects with n properties
   * - Space: O(d) where d is the maximum depth of nested objects due to circular reference tracking
   *
   * @remarks
   * Circular Reference Protection:
   * - Automatically detects circular references and returns false
   * - Uses WeakSet for efficient tracking without memory leaks
   * Checks for null/undefined, primitives, strings, and arrays.
   * Iterable Handling:
   * - Objects implementing Symbol.iterator will be converted to arrays for checking
   * - Examples: Generators, custom iterables, etc.
   * Then checks for custom logic (`options.customIsEmpty` or `.isEmpty()` method).
   * Uses `Object.prototype.toString` for reliable checks on built-ins (Map, Set, TypedArrays, Arguments, etc.).
   * Handles plain objects using `Object.getOwnPropertyNames/Symbols`:
   * - If it has 0 own properties, it's empty.
   * - If the *only* own property is `length` (enumerable or not), emptiness is determined by `length === 0`.
   * - Otherwise (more properties, or a single non-length property), it's not empty.
   * Non-Enumerable Properties:
   * - Plain objects with non-enumerable length properties are considered empty if length === 0
   * - Example: Object.defineProperty({}, 'length', { value: 0 }) → true
   * Handles other array-like objects (non-plain, not caught by `toString`) based on `length === 0`, excluding custom class instances.
   *
   * Order of checks:
   * 1. Global objects (window, globalThis) -> false
   * 2. null, undefined -> true
   * 3. Primitives (number, boolean based on options; function, symbol, bigint -> false)
   * 4. Strings -> length === 0
   * 5. Arrays -> length === 0
   * 6. Non-object -> false (includes functions, symbols, bigints)
   * 7. Circular Reference Check -> false if seen
   * 8. Custom emptiness logic (`customIsEmpty` option or `.isEmpty()` method)
   * 8. Proxy -> checks constructor (if supported)
   * 9. WeakRef -> checks dereferenced value recursively (if WeakRef exists)
   * 10. Fast path for collections and buffers using instanceof via instanceOf (Map, Set, ArrayBuffer, TypedArrays, Arguments, etc.)
   * 11. Special object types (Date, RegExp, Error) -> false (unless specialObjectsAsEmpty option is true)
   * 12. Built-ins via `Object.prototype.toString` for cross-realm safety (Map, Set, ArrayBuffer, TypedArrays, Arguments, etc.)
   * 13. Plain Objects ({} or new Object()) -> checks own properties (special handling for `{ length: 0 }`)
   * 14. Other Iterables (non-Array/String/Map/Set) -> checks if iteration yields items
   * 15. Other Array-Likes (non-plain, prototype check) -> checks length property
   * 15. Default -> false (includes Proxies by default, WeakMap, WeakSet, other objects)
   *
   * Performance characteristics:
   * - Primitive checks are O(1)
   * - Array/String checks are O(1)
   * - Plain object checks are O(n) where n is the number of properties
   * - Custom isEmpty methods may have varying performance
   *
   * Edge cases:
   * - Proxy objects will generally be treated as non-empty by default due to inspection difficulty.
   * - WeakMap and WeakSet are always treated as non-empty
   * - Custom objects with non-enumerable properties have explicit checks
   * - Objects with Symbol properties have explicit checks
   * - Global objects are always treated as non-empty
   * - Cross-realm objects (iframes, workers) are handled correctly for built-ins via `toString`.
   *
   * This method considers a value empty if:
   * - It is null or undefined
   * - It is a string (primitive or String object) with length 0
   * - It is an array with length 0
   * - It has a custom `isEmpty` method that returns true
   * - It matches custom emptiness logic provided via options
   * - It is an empty Map or Set
   * - It is an empty ArrayBuffer or typed array (e.g., Int8Array)
   * - It is a plain object ({} or new Object()) with no own properties
   * - It is an array-like object with length 0 (ignoring symbol properties)
   *
   * Non-empty cases include:
   * - WeakMap and WeakSet (since their size cannot be determined)
   * - Non-plain objects (Date, RegExp, custom classes) unless they have a custom `isEmpty` method or match custom logic
   * - Custom objects with a length property (unless they are plain objects)
   * - Primitive values (numbers, booleans, BigInt, symbols)
   * - Functions
   * - Proxy objects may not behave as expected (their emptiness depends on the Proxy's implementation)
   * - Unhandled object types (e.g., WeakMap, WeakSet, custom class instances without custom logic) default to non-empty for safety.
   * @example
   * ```typescript
   * isEmpty(null);                                                                 // => true
   * isEmpty("");                                                                   // => true
   * isEmpty([]);                                                                   // => true
   * isEmpty({});                                                                   // => true
   * isEmpty({ length: 0 });                                                        // => true
   * isEmpty(Object.defineProperty({}, 'length', { value: 0 }));                    // => true (Handles non-enumerable length)
   * isEmpty(new Map());                                                            // => true
   * isEmpty(new Int8Array(0));                                                     // => true
   * isEmpty(new ArrayBuffer(0));                                                   // => true
   * isEmpty(new DataView(new ArrayBuffer(0)));                                     // => true
   * isEmpty(Object.create(null));                                                  // => true
   * isEmpty(Object.create(null, { length: { value: 0 } }));                        // => true
   *
   * isEmpty(0);                                                                    // => false
   * isEmpty({ a: 1 });                                                             // => false
   * isEmpty({ length: 1 });                                                        // => false
   * isEmpty({ length: 0, other: 'prop' });                                         // => false
   * isEmpty(false);                                                                // => false
   * isEmpty(new Date());                                                           // => false
   * isEmpty(new Date());                                                           // => false
   * isEmpty(new WeakMap());                                                        // => false
   * isEmpty(new WeakSet());                                                        // => false
   * isEmpty(new Proxy({}, {}));                                                    // => false (generally)
   * isEmpty(globalThis);                                                           // => false
   * isEmpty(Object.defineProperty({}, 'x', { enumerable: false, value: 1 }));      // => false
   * class X { length = 0 }; isEmpty(new X());                                      // => false
   *
   * class CustomCollection {
   *  private items: any[] = [];
   *  isEmpty() { return this.items.length === 0; }
   * }
   * isEmpty(new CustomCollection());                                               // => true
   *
   * // Using options
   * class MyType { value: number | null = null }
   * isEmpty(new MyType(), { customIsEmpty: (v) => (v as MyType).value === null }); // => true
   * isEmpty(false, { falseAsEmpty: true });                                        // => true
   * isEmpty(0, { zeroAsEmpty: true });                                             // => true
   * isEmpty(new Date(), { specialObjectsAsEmpty: true });                          // => true
   *  ```
   */
  static isEmpty = (
    value: unknown,
    options: IsEmptyOptions = {},
    // Use WeakSet for circular reference tracking, initialized internally if not passed
    _seen: WeakSet<object> = new WeakSet<object>(),
  ): boolean => {
    // --- Pre-checks for early returns ---

    // 1. Check for global objects (usually not considered empty)
    if (
      value === globalThis ||
      (typeof window !== "undefined" && value === window) ||
      (typeof global !== "undefined" && value === global) // For Node.js environments
    ) {
      return false;
    }

    // 2. Null or undefined are empty.
    if (value === null || value === undefined) return true;

    // 3. Handle primitive types quickly with options
    const type = typeof value;
    if (type === "number") {
      return !!options.zeroAsEmpty ? value === 0 : false; // Use !! to ensure boolean
    }
    if (type === "boolean") {
      return !!options.falseAsEmpty ? value === false : false; // Use !! to ensure boolean
    }
    // Functions, symbols, bigints are never empty by default
    if (type === "function" || type === "symbol" || type === "bigint") {
      return false;
    }

    // 4. Handle strings (both primitive and object).
    // Note: `value instanceof String` is not cross-realm safe, but String() handles both.
    if (
      typeof value === "string" ||
      objectToString.call(value) === "[object String]"
    ) {
      return String(value).length === 0;
    }

    // 5. Arrays are empty when they have no elements. (Cross-realm safe)
    if (Array.isArray(value)) {
      return value.length === 0;
    }

    // --- Object Checks ---
    // 6. Skip out remaining non-object, they are considered non-empty unless handled above (like empty strings).
    if (typeof value !== "object") return false;

    // At this point, value is guaranteed to be an object and not null
    // Note: typeof null === 'object', but it was handled in step 1.
    const obj = value as object;

    // 7. Circular Reference Check
    if (_seen.has(obj)) return false; // Circular reference detected
    _seen.add(obj); // Mark as seen for this path

    // Prepare options for potential recursive calls, ensuring _seen is passed (used by WeakRef check)
    // Create only if not already seen to avoid unnecessary object creation
    // const internalOptions = options._seen
    //   ? options
    //   : { ...options, _seen: seen, _internalCall: true }; // _internalCall prevents re-checking .isEmpty()

    const internalOptions = { ...options, _seen, _internalCall: true }; // _internalCall prevents re-checking .isEmpty()

    // Custom Emptiness Overrides

    // 8. Check for custom emptiness logic first (options or method)
    // IMPORTANT: This runs first for ALL objects now.
    if (options.customIsEmpty) {
      try {
        // Allow custom logic to override everything else for objects
        return !!options.customIsEmpty(obj);
      } catch (e) {
        if (options.haltOnCustomError) {
          throw e; // Halt and let the user handle the error
        }
        if (process.env.NODE_ENV !== "production") {
          console.warn(
            "Utils.isEmpty: Custom isEmpty function threw an error:",
            e,
          );
        }
        // Continue with standard checks
      }
    }

    // Only use isEmpty() method if not an internal call (prevents recursion)
    if (
      !options._internalCall &&
      typeof (obj as WithIsEmpty).isEmpty === "function"
    ) {
      try {
        return !!(obj as WithIsEmpty).isEmpty();
      } catch (e) {
        if (process.env.NODE_ENV !== "production") {
          console.warn(
            "Utils.isEmpty: Custom isEmpty function threw an error:",
            e,
          );
        }
        // Continue with standard object checks
      }
    }

    // Proxy and WeakRef Checks
    // 9. Handle Proxy objects
    if (typeof Proxy === "function" && obj instanceof Proxy) {
      try {
        // Try basic checks, fallback to treating as non-empty
        const handler = Object.getOwnPropertyDescriptor(
          obj,
          "constructor",
        )?.value;
        if (handler && typeof handler === "object") {
          return false;
        }
      } catch (e) {
        console.warn(
          "Utils.isEmpty: Proxy isEmpty property access threw an error:",
          e,
        );
        return false; // Proxies might throw on property access
      }
    }

    //Updated Approach
    // 9. Handle Proxy objects
    if (this.proxyTag !== null && objectToString.call(obj) === this.proxyTag) {
      try {
        // Try basic checks, fallback to treating as non-empty
        const constructor = objectProto.hasOwnProperty.call(obj, "constructor")
          ? (obj as any).constructor
          : null;

        if (constructor && /Proxy/.test(constructor.name)) {
          return false;
        }
      } catch (e) {
        console.warn(
          "Utils.isEmpty: Proxy isEmpty property access threw an error:",
          e,
        );
        return false; // Proxies might throw on property access
      }
    }

    // Modified Proxy check section
    if (this.proxyTag !== null && objectToString.call(obj) === this.proxyTag) {
      try {
        // Try basic checks, fallback to treating as non-empty
        const constructor = objectProto.hasOwnProperty.call(obj, "constructor")
          ? (obj as any).constructor
          : null;

        // Fallback check for Proxy constructor name
        if (
          constructor &&
          (/Proxy/.test(constructor.name) ||
            constructor.name === "Proxy" ||
            (constructor.toString().includes("[native code]") &&
              constructor.toString().includes("Proxy")))
        ) {
          return false;
        }
      } catch (e) {
        if (Utils.isDevelopment()) {
          console.warn("Utils.isEmpty: Proxy check error:", e);
        }
        return false; // Proxies might throw on property access
      }
    }

    if (
      this.proxyTag !== null &&
      Object.prototype.toString.call(obj) === this.proxyTag
    ) {
      try {
        Object.keys(obj); // Test property access
        return false;
      } catch (e) {
        console.warn("Utils.isEmpty: Proxy property access threw an error:", e);
        return false;
      }
    }

    // 9. Proxy Handling: Combine both proxy checks.
    if (typeof Proxy === "function") {
      // Check if the object has the same tag as a proxy.
      if (
        this.proxyTag !== null &&
        objectToString.call(obj) === this.proxyTag
      ) {
        try {
          const ctor = Object.prototype.hasOwnProperty.call(obj, "constructor")
            ? (obj as any).constructor
            : null;
          if (ctor && /Proxy/.test(ctor.name)) {
            return false;
          }
        } catch (e) {
          if (process.env.NODE_ENV !== "production") {
            console.warn("Utils.isEmpty: Proxy check error:", e);
          }
          return false;
        }
      }
    }

    // 9. Check WeakRef objects (cross-environment safe) - Requires recursion protection
    // Enhanced WeakRef check
    const WeakRefExists =
      typeof WeakRef !== "undefined" ||
      (typeof window !== "undefined" && "WeakRef" in window) ||
      (typeof global !== "undefined" && "WeakRef" in global);

    if (WeakRefExists && typeof (obj as any).deref === "function") {
      try {
        const referent = (obj as any).deref();
        // An empty WeakRef (pointing to undefined) is considered empty.
        // Otherwise, check the emptiness of the referenced object recursively.
        return referent === undefined
          ? true
          : this.isEmpty(referent, internalOptions, _seen); // Pass _seen
      } catch (e) {
        if (process.env.NODE_ENV !== "production") {
          console.warn(
            "Utils.isEmpty: Failed to dereference potential WeakRef:",
            e,
          );
        }
        return false;
      }
    }

    if (WeakRefExists && typeof (obj as any).deref === "function") {
      try {
        const referent = (obj as any).deref();
        return referent === undefined
          ? true
          : this.isEmpty(referent, internalOptions, _seen);
      } catch (e) {
        if (Utils.isDevelopment()) {
          console.warn("Utils.isEmpty: WeakRef deref error:", e);
        }
        return false;
      }
    }

    // More performant WeakRef check
    if (typeof WeakRef !== "undefined" && obj instanceof WeakRef) {
      const referent = obj.deref();
      return referent === undefined
        ? true
        : this.isEmpty(referent, internalOptions, _seen);
    }

    // Built-in Collections

    // 10. Fast path for collections and buffers using instanceof (not cross-realm safe)
    // The toString check later provides cross-realm safety as a fallback.
    if (this.isCollection(obj)) {
      return (obj as Map<any, any> | Set<any>).size === 0;
    }

    if (this.isBufferType(obj)) {
      return (obj as ArrayBufferView | ArrayBuffer).byteLength === 0;
    }

    // 11. Handle specific object types potentially treated as empty with specialObjectsAsEmpty option
    if (options.specialObjectsAsEmpty) {
      if (
        obj instanceof Date ||
        obj instanceof RegExp ||
        obj instanceof Error
      ) {
        return true;
      }
    }

    // 12. Check special collection types first (Maps, Sets, ArrayBuffers, typed arrays, etc)
    // Use Object.prototype.toString for reliable cross-realm type checking
    const tag = objectToString.call(obj);
    switch (tag) {
      // These cases are handled by instanceof checks above but kept for cross-realm safety
      case "[object Map]":
      case "[object Set]":
        return (obj as Map<any, any> | Set<any>).size === 0;
      // Check for ArrayBuffer and TypedArray types
      // ArrayBuffer is a special case, as it doesn't have a length property
      case "[object ArrayBuffer]":
        return (obj as ArrayBuffer).byteLength === 0;
      // Catches TypedArrays (Int8Array, Float32Array, etc.) and DataView
      case "[object Int8Array]":
      case "[object Uint8Array]":
      case "[object Uint8ClampedArray]":
      case "[object Int16Array]":
      case "[object Uint16Array]":
      case "[object Int32Array]":
      case "[object Uint32Array]":
      case "[object Float32Array]":
      case "[object Float64Array]":
      case "[object BigInt64Array]":
      case "[object BigUint64Array]":
      case "[object DataView]":
        return (obj as ArrayBufferView).byteLength === 0;
      // DOM collections and array-like objects
      case "[object HTMLCollection]":
      case "[object NodeList]":
      case "[object Arguments]":
        return (obj as ArrayLike).length === 0;
      // Known non-empty object types (unless specialObjectsAsEmpty=true)
      case "[object Date]":
      case "[object RegExp]":
      case "[object Error]": // Errors are generally not considered empty
        return false;
      // WeakMap/WeakSet will likely be '[object Object]' or specific tag; fall through
      // Proxies will likely be '[object Object]' or target's tag; fall through
    }

    // Plain Object Handling

    // 13. Handle Plain Objects (({} or new Object())) specifically - optimized for performance
    if (this.isPlainObject(value)) {
      // Check if the object has no own properties (including symbols)
      return this.isEmptyPlainObject(obj); // Check for empty object
    }

    // 14. Handle *other* Iterables (non-Array/String/Map/Set/etc.)
    // Check this *after* specific types and plain objects
    if (typeof (obj as any)[Symbol.iterator] === "function") {
      try {
        // Check if the iterator yields any value
        for (const _ of obj as Iterable<unknown>) {
          return false; // Found an item, therefore not empty
        }
        return true; // No items yielded
      } catch (e) {
        if (process.env.NODE_ENV !== "production") {
          console.warn("Utils.isEmpty: Error iterating object:", e);
        }
        return false; // Treat as non-empty if iteration fails
      }
    }

    // Another approach using manual iteration for performance

    // 14. Handle *other* Iterables (non-Array/String/Map/Set/etc.)
    // Check this *after* specific types and plain objects
    if (Symbol.iterator in obj) {
      // Verify iterator is actually a function
      const iterator = (obj as any)[Symbol.iterator];
      if (typeof iterator !== "function") return false;

      try {
        // Manual iteration for performance
        const it = iterator.call(obj);
        let result = it.next();
        while (!result.done) {
          // Found at least one item → not empty
          return false;
        }
        // No items yielded → empty
        return true;
      } catch (e) {
        if (process.env.NODE_ENV !== "production") {
          console.warn("Utils.isEmpty: Error iterating object:", e);
        }
        return false; // Treat as non-empty on failure
      }
    }

    // More efficient iterables check
    if (Symbol.iterator in obj && typeof obj[Symbol.iterator] === "function") {
      try {
        // Fast check: get first item and return immediately if found
        const iterator = obj[Symbol.iterator]();
        const first = iterator.next();

        // If done is true, no items (empty)
        return first.done === true;
      } catch {
        return false; // Error during iteration, consider non-empty
      }
    }

    // Fallback Array-Like Check

    // 15. Handle remaining Array-Like objects (non-plain, not caught by toString or isPlainObject)
    // This catches generic array-likes or custom classes missed earlier.
    if (this.isArrayLike(obj)) {
      // For other array-like objects, only consider them empty if they're not custom class instances
      // Otherwise (custom class instance with length), treat as non-empty by default
      const proto = getProto(obj);
      return proto === objectProto || proto === null
        ? (obj as ArrayLike).length === 0
        : false;
    }

    // 16. Other object types (Date, RegExp, custom classes, etc.) and non-object primitives (numbers, booleans, symbols, functions, etx)
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
  // static isEqual(
  //   value: any,
  //   other: any,
  //   options: { isPassword?: boolean } = {},
  // ): boolean {
  //   if (
  //     options.isPassword &&
  //     this.isPlainText(value) &&
  //     this.isPlainText(other)
  //   ) {
  //     return this.isEmpty(value) && this.isEmpty(other);
  //   }

  //   return this.deepEqual(value, other, new WeakMap<object, object>());
  // }

  static isEqual(
    value: any,
    other: any,
    options: {
      isPassword?: boolean;
      customIsEmpty?: (value: object) => boolean;
    } = {},
  ): boolean {
    if (
      options.isPassword &&
      this.isPlainText(value) &&
      this.isPlainText(other)
    ) {
      return this.isEmpty(value, options) && this.isEmpty(other, options);
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

// // Handle strings (both primitive and object)
// if (typeof value === "string" || value instanceof String) {
//   return String(value).length === 0;
// }

// // 7. Check special collection types first (Maps, Sets, ArrayBuffers, typed arrays)
// if (value instanceof Map || value instanceof Set) return value.size === 0;
// if (value instanceof ArrayBuffer) return value.byteLength === 0;
// // Catches TypedArrays (Int8Array, Float32Array, etc.) and DataView
// if (ArrayBuffer.isView(value)) return value.byteLength === 0;

// 8. Check plain objects ({} or new Object()) for no keys or symbol properties before length checks
// const plainObject = this.isPlainObject(value);
// if (plainObject) {
//   return (
//     Object.keys(value).length === 0 &&
//     Object.getOwnPropertySymbols(value).length === 0
//   );
// }

// // 9. Handle array-like objects (arguments, NodeList, and HTMLCollection) after plain object check
// if ("length" in obj && typeof ArrayLike.length === "number") {
//   // Check for standard DOM collections
//   // Use both constructor name and toString for broader compatibility
//   const typeTag = Object.prototype.toString.call(obj);
//   const ctrName = obj.constructor?.name;
//   if (
//     typeTag === "[object HTMLCollection]" ||
//     typeTag === "[object NodeList]" ||
//     typeTag === "[object Arguments]" ||
//     ctrName === "NodeList" ||
//     ctrName === "HTMLCollection" ||
//     ctrName === "Arguments"
//   ) {
//     return ArrayLike.length === 0;
//   }

//   // For other array-like objects, only consider them empty if they're not custom class instances
//   // Otherwise (custom class instance with length), treat as non-empty by default
//   const proto = Object.getPrototypeOf(obj);
//   return proto === Object.prototype || proto === null
//     ? ArrayLike.length === 0
//     : false;
// }

// if (plainObject) {
//   // Get all own properties (enumerable AND non-enumerable string keys, and all symbols)
//   const allKeys = Object.getOwnPropertyNames(obj);
//   const allSymbols = Object.getOwnPropertySymbols(obj);
//   const totalProps = allKeys.length + allSymbols.length;

//   // Case 1: Truly empty object (no own properties at all)
//   if (totalProps === 0) return true;

//   // Case 2: Only has "length" property (enumerable or not) and no symbols
//   if (totalProps === 1 && allKeys.includes("length")) {
//     const len = arrayLikeObj.length;
//     // Ensure length is a number before comparing
//     return typeof len === "number" && len === 0;
//   }

//   // Case 3: Any other properties
//   return false;
// }

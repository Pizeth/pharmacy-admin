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
    logger.warn(
      "Utils.isEmpty: WeakRef deref error, treating as non-empty:",
      e,
    );
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

// Cross-realm WeakRef check
const isWeakRef = (obj: any): obj is WeakRef<object> =>
  typeof WeakRef !== "undefined" &&
  (obj instanceof WeakRef ||
    (typeof obj.deref === "function" && obj.constructor?.name === "WeakRef"));

if (isWeakRef(obj)) {
  const referent = obj.deref();
  return referent === undefined
    ? true
    : this.isEmpty(referent, internalOptions, _seen);
}

if (
  typeof WeakRef !== "undefined" &&
  typeof (obj as any).deref === "function" &&
  Object.prototype.toString.call(obj) === "[object WeakRef]"
) {
  try {
    const referent = (obj as any).deref();
    return referent === undefined
      ? true
      : this.isEmpty(referent, internalOptions, _seen);
  } catch (e) {
    console.warn("Utils.isEmpty: Failed to dereference potential WeakRef:", e);
    return false;
  }
}

// Combine direct checks with cross-realm safety
if (typeof WeakRef !== "undefined") {
  // Fast path for same-realm WeakRefs
  if (obj instanceof WeakRef) {
    const referent = obj.deref();
    return referent === undefined
      ? true
      : this.isEmpty(referent, internalOptions, _seen);
  }
  // Cross-realm fallback
  if (
    typeof (obj as any).deref === "function" &&
    obj.constructor?.name === "WeakRef" // Safer but not foolproof
  ) {
    const referent = (obj as any).deref();
    return referent === undefined
      ? true
      : this.isEmpty(referent, internalOptions, _seen);
  }
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

if (typeof Proxy === "function" && obj instanceof Proxy) {
  try {
    // Try basic checks, fallback to treating as non-empty
    const handler = Object.getOwnPropertyDescriptor(obj, "constructor")?.value;
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
    const constructor = hasOwnProperty.call(obj, "constructor")
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
    const constructor = hasOwnProperty.call(obj, "constructor")
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
    logger.warn("Utils.isEmpty: Proxy check error:", e);
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
  if (this.proxyTag !== null && objectToString.call(obj) === this.proxyTag) {
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

// static isWeakRef = (obj: any): obj is WeakRef<object> =>
//   typeof WeakRef !== "undefined"
//     ? obj instanceof WeakRef ||
//       (typeof obj.deref === "function" &&
//         obj.constructor?.name === "WeakRef" &&
//         objectToString.call(obj) === "[object WeakRef]")
//     : false;

// const getLastSegment = (path: string): string => {
//   // Split the string by '/' and filter out empty segments
//   const segments = path.split("/").filter((segment) => segment.length > 0);
//   // Return the last segment
//   return segments[segments.length - 1] || "";
// };





I've made some change to the is empty function, please have a look


-Custom type and interface

export interface ArrayLike {
  length: number;
}

export interface IsEmptyOptions {
  /**
   * A custom function to determine if an object is empty.
   * IMPORTANT: This function is called FIRST for any object type,
   * allowing override of all subsequent standard checks.
   * @param value - The object value to check.
   * @returns `true` if the custom logic considers the value empty, `false` otherwise.
   */
  customIsEmpty?: (value: object) => boolean;
  /** Treat the number 0 as empty. Defaults to false. */
  zeroAsEmpty?: boolean;
  /** Treat the boolean false as empty. Defaults to false. */
  falseAsEmpty?: boolean;
  /** Treat Date, RegExp, Error instances as empty. Defaults to false. */
  specialObjectsAsEmpty?: boolean;
  /** Internal flag for recursion protection (e.g., with WeakRef). */
  _internalCall?: boolean;
  /** Halt on Custom Error flag for rethrows customIsEmpty errors. */
  haltOnCustomError?: boolean;
  /** Override with `unwrapProxy` option if you need to inspect the target. */
  unwrapProxy?: UnwrapProxy;
}

export interface WithIsEmpty {
  isEmpty(): boolean;
}

export type UnwrapProxy = (proxy: object) => unknown;

export type LogLevel = "debug" | "info" | "warn" | "error";

- Custom Logger class

import { LogLevel } from "../Types/types";

/**
 * Logger class for structured logging.
 *
 * @remarks
 * - Automatically detects development mode based on environment variables (`NODE_ENV`, `import.meta.env.MODE`, `__DEV__`).
 * - Use `Logger.setDevelopmentMode(isDev)` to manually override the development mode in edge cases or custom environments.
 */
class Logger {
  // Static property to override development mode
  private static forceDevelopment: boolean | null = null;

  /**
   * Manually set the development mode.
   * @param isDev - True to force development mode, false to force production mode.
   */
  static setDevelopmentMode(isDev: boolean): void {
    Logger.forceDevelopment = isDev;
  }

  // Only log messages at or above the current level.
  private levelPriority: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  };

  private static isDevelopment(): boolean {
    // Use the forced value if set
    if (Logger.forceDevelopment !== null) {
      return Logger.forceDevelopment;
    }
    // Otherwise, fall back to automatic detection
    return (
      (typeof process !== "undefined" &&
        process.env.NODE_ENV !== "production") ||
      (typeof import.meta !== "undefined" &&
        import.meta.env?.MODE !== "production") ||
      (typeof window !== "undefined" && (window as any).__DEV__ === true)
    );
  }

  constructor(private currentLevel: LogLevel = "debug") {}

  private shouldLog(level: LogLevel): boolean {
    // For production, you might force the level to be 'warn' or higher.
    if (!Logger.isDevelopment()) {
      return this.levelPriority[level] >= this.levelPriority["warn"];
    }
    return this.levelPriority[level] >= this.levelPriority[this.currentLevel];
  }

  debug(message: string, ...optionalParams: any[]) {
    if (this.shouldLog("debug")) {
      console.debug(message, ...optionalParams);
    }
  }

  info(message: string, ...optionalParams: any[]) {
    if (this.shouldLog("info")) {
      console.info(message, ...optionalParams);
    }
  }

  warn(message: string, ...optionalParams: any[]) {
    if (this.shouldLog("warn")) {
      console.warn(message, ...optionalParams);
    }
  }

  error(message: string, ...optionalParams: any[]) {
    if (this.shouldLog("error")) {
      console.error(message, ...optionalParams);
    }
  }
}

export default new Logger("debug"); // Adjust default level as necessary

- and my update Utils class

import {
  ArrayLike,
  IsEmptyOptions,
  UnwrapProxy,
  WithIsEmpty,
} from "../Types/types";
import logger from "./Logger";

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

  // Modify the static initialization block
  static {
    // Initialize proxy tag once
    try {
      // Create and immediately revoke proxy for safety
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

  // Define this at the class level or module scope
  private static unwrapProxySymbol = Symbol("unwrapProxy");

  // Optional: Basic unwrap helper (override for custom Proxies)
  private static defaultUnwrapProxy: UnwrapProxy = (proxy) => {
    return (proxy as any)[this.unwrapProxySymbol]?.() ?? proxy;
  };

  private static isProxyObject(obj: object): boolean {
    if (typeof Proxy !== "function") {
      return false;
    }
    if (this.proxyTag !== null && objectToString.call(obj) === this.proxyTag) {
      try {
        const hasCtor = hasOwnProperty.call(obj, "constructor");
        const ctor = hasCtor ? (obj as any).constructor : null;
        if (
          ctor &&
          (/Proxy/.test(ctor.name) ||
            ctor.name === "Proxy" ||
            (typeof ctor.toString === "function" &&
              ctor.toString().includes("[native code]") &&
              ctor.toString().includes("Proxy")))
        ) {
          try {
            Object.keys(obj);
          } catch (e) {
            logger.warn("Utils.isEmpty: Proxy property access error:", e);
            return true;
          }
          return true;
        }
      } catch (e) {
        logger.warn("Utils.isEmpty: Proxy check error:", e);
        return true;
      }
    }
    try {
      if (obj instanceof Proxy) {
        return true;
      }
    } catch (e) {}
    return false;
  }

  static isWeakRef(obj: unknown): obj is WeakRef<object> {
    // Narrow from unknown → object
    if (typeof obj !== "object" || obj === null) {
      return false;
    }

    // Now TypeScript knows obj is object, so instanceof and property-access are allowed
    if (typeof WeakRef === "undefined") {
      return false;
    }

    // Fast same-realm check
    if (obj instanceof WeakRef) {
      return true;
    }

    // Cross-realm / fallback check: look for a .deref() method and “WeakRef” constructor name
    const anyObj = obj as any;
    if (
      typeof anyObj.deref === "function" &&
      anyObj.constructor?.name === "WeakRef" &&
      objectToString.call(obj) === "[object WeakRef]"
    ) {
      return true;
    }

    return false;
  }

  private static safeDeref(obj: WeakRef<object>): unknown {
    // Use a unique symbol to differentiate failure from `undefined` referent
    const DEREF_FAILED = Symbol("deref_failed");
    try {
      // Check if deref exists and is a function before calling
      if (typeof obj.deref === "function") {
        return obj.deref();
      }
      // If deref doesn't exist or isn't a function, treat as failure
      return DEREF_FAILED;
    } catch (e) {
      logger.warn("Utils.safeDeref: Failed to dereference WeakRef:", e);
      return DEREF_FAILED; // Return failure symbol on error
    }
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
    // Check for enumerable keys first (fastest)
    const keys = objectKeys(obj);

    // Quick path: no enumerable keys
    if (keys.length === 0) {
      // Get all own properties (enumerable AND non-enumerable string keys, and all symbols)
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
        // Ensure length is a number before comparing
        return typeof len === "number" && len === 0;
      }

      return false;
    }

    // Check single enumerable "length" property case
    if (keys.length === 1 && keys[0] === "length") {
      // Quick check for just length property (enumerable)
      const len = (obj as ArrayLike).length;
      return typeof len === "number" && len === 0;
    }

    // Any other properties, not empty
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
      typeof (value as ArrayLike).length === "number" &&
      (value as ArrayLike).length >= 0 // Ensure length is non-negative
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
   * Type guard to determines if the given value is an ArrayBuffer or ArrayBufferView type.
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
    // Direct instanceof checks first (fastest path)
    if (value instanceof ArrayBuffer || ArrayBuffer.isView(value)) return true;

    //fallback to Object.prototype.toString for cross-realm safety
    const tag = objectToString.call(value);
    return (
      tag === "[object ArrayBuffer]" ||
      (tag.startsWith("[object ") &&
        ((tag.includes("Array") && tag.includes("Buffer")) ||
          tag === "[object DataView]"))
    );
  }

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
   * Proxies are treated as non-empty by default due to detection limitations.
   * - Override with `unwrapProxy` option if you need to inspect the target.
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
    const internalOptions = {
      ...options,
      _seen,
      _internalCall: true,
      unwrapProxy: this.defaultUnwrapProxy,
    }; // _internalCall prevents re-checking .isEmpty()

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
        logger.warn(
          "Utils.isEmpty: Custom isEmpty function threw an error:",
          e,
        );
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
        logger.warn(
          "Utils.isEmpty: Custom isEmpty function threw an error:",
          e,
        );
        // Continue with standard object checks
      }
    }

    // Proxy and WeakRef Checks
    // 9. Handle Proxy objects
    if (this.isProxyObject(obj)) {
      // Best-effort detection
      try {
        const target = internalOptions.unwrapProxy(obj);
        return this.isEmpty(target, internalOptions, _seen);
      } catch (e) {
        return false; // Fallback to non-empty
      }
    }

    // 10. Check WeakRef objects (cross-environment safe) - Requires recursion protection
    if (this.isWeakRef(obj)) {
      const referent = this.safeDeref(obj);
      // Check if deref failed (symbol returned)
      if (typeof referent === "symbol") {
        return false; // Treat as non-empty if deref failed
      }
      // Check emptiness of the actual referenced object (or undefined)
      return referent === undefined
        ? true
        : this.isEmpty(referent, internalOptions, _seen);
    }

    // Built-in Collections

    // 11. Fast path for collections and buffers using instanceof (not cross-realm safe)
    // The toString check later provides cross-realm safety as a fallback.
    if (this.isCollection(obj)) {
      return (obj as Map<any, any> | Set<any>).size === 0;
    }

    if (this.isBufferType(obj)) {
      return (obj as ArrayBufferView | ArrayBuffer).byteLength === 0;
    }

    // 12. Handle specific object types potentially treated as empty with specialObjectsAsEmpty option
    if (options.specialObjectsAsEmpty) {
      if (
        obj instanceof Date ||
        obj instanceof RegExp ||
        obj instanceof Error
      ) {
        return true;
      }
    }

    // 13. Check special collection types first (Maps, Sets, ArrayBuffers, typed arrays, etc)
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

    // 14. Handle Plain Objects (({} or new Object())) specifically - optimized for performance
    if (this.isPlainObject(value)) {
      // Check if the object has no own properties (including symbols)
      return this.isEmptyPlainObject(obj); // Check for empty object
    }

    // 15. Handle *other* Iterables (non-Array/String/Map/Set/etc.)
    // Check this *after* specific types and plain objects
    if (Symbol.iterator in obj && typeof obj[Symbol.iterator] === "function") {
      try {
        // Fast check: get first item and return immediately if found
        const iterator = (
          obj as { [Symbol.iterator]: () => Iterator<unknown> }
        )[Symbol.iterator]();
        const first = iterator.next();

        // If done is true, no items (empty)
        return first.done === true;
      } catch (e) {
        logger.warn("Utils.isEmpty: Error iterating object:", e);
        return false; // Error during iteration, consider non-empty
      }
    }

    // Fallback Array-Like Check

    // 16. Handle remaining Array-Like objects (non-plain, not caught by toString or isPlainObject)
    // This catches generic array-likes or custom classes missed earlier.
    if (this.isArrayLike(obj)) {
      // For other array-like objects, only consider them empty if they're not custom class instances
      // Otherwise (custom class instance with length), treat as non-empty by default
      const proto = getProto(obj);
      return proto === objectProto || proto === null
        ? (obj as ArrayLike).length === 0
        : false;
    }

    // 17. Other object types (Date, RegExp, custom classes, etc.) and non-object primitives (numbers, booleans, symbols, functions, etx)
    return false;
  };
... }

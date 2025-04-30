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

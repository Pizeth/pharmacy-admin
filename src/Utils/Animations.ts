// utils/Animation.ts

/**
 * Utility class containing animation-related static methods.
 */
export class Animations {
  /**
   * Applies a shake animation effect to a Material-UI input label when validation fails.
   * The animation is triggered only when validation is complete and the input is invalid.
   *
   * This method determines if the input should exhibit a shake effect due to an invalid state.
   * It first checks if the input is not currently validating and is marked as invalid. If these
   * conditions are met, it queries for the label element within the provided container reference,
   * removes any existing shake class, and then re-adds the class after a short timeout to restart
   * the CSS animation. After the animation duration (defined by the interval), the shake class is
   * removed again to reset its state.
   *
   * If the input is either validating or not invalid, this method clears any existing errors for
   * the specified source field using the provided clearErrors callback.
   *
   * @param isValidating - Boolean flag indicating whether the input is currently in a validation state
   * @param invalid - Boolean flag indicating whether the input value is considered invalid.
   * @param inputRef - A React reference pointing to the container element whose child label will be animated.
   * @param shakeRef - A react reference object pointing to the DOM element to animate
   * @param clearErrors - A callback function from useFormContext to clear errors associated with the specified field name.
   * @param source - Field name identifier for error clearing.
   * @param className - CSS class name used to apply the shake animation effect (defaults to "shake").
   * @param interval - Duration of the shake animation in milliseconds (defaults to 500).
   *
   * @example
   * ```typescript
   * Animation.shake(
   *   false,
   *   true,
   *   shakeRef,
   *   clearErrors,
   *   'fieldName',
   *   'shake',
   *   500
   * );
   * ```
   */
  static shake = (
    isValidating: boolean,
    invalid: boolean,
    shakeRef: React.RefObject<HTMLLabelElement | null>,
    clearErrors: (name: string) => void,
    source: string,
    className: string = "shake",
    interval: number = 500,
  ): void => {
    if (!isValidating && invalid && shakeRef.current) {
      // Get the target element to animate
      const shakeTarget = shakeRef.current;

      // Remove the class to reset the animation state
      shakeTarget.classList.remove(className);

      // Trigger the animation by adding the class after a 0ms delay to ensure the browser registers a new animation
      setTimeout(() => {
        if (shakeTarget) {
          shakeTarget.classList.add(className);

          // Remove the class after the animation duration (500ms)
          setTimeout(() => {
            if (shakeTarget) {
              shakeTarget.classList.remove(className);
            }
          }, interval);
        }
      }, 0);
    } else {
      // Clear errors for the field if conditions aren’t met
      clearErrors(source);
    }
  };
}

export default Animation;

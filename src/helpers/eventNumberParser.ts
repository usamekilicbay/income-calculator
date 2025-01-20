/**
 * Converts an input event value to a number, parsing it as a `float` and validating it.
 *
 * This function assumes the event comes from an `HTMLInputElement` and attempts to convert the input
 * value to a valid number. If the value is invalid or not a number, it throws an error or logs it.
 *
 * @param {Event} $event - The input event, typically triggered by an `input` or `change` event.
 * @throws {Error} Throws an error if the value is not a valid number.
 * @throws {Error} Throws an unknown error if parsing or conversion fails unexpectedly.
 * @returns {number} The parsed number from the input event, or `0` if invalid or an error occurs.
 */
export function convertFromInput($event: Event): number {
  try {
    const value = parseFloat(($event.target as HTMLInputElement).value);

    if (isValidNumber(value)) {
      return value;
    }

    throw new Error(
      `The input value (${
        ($event.target as HTMLInputElement).value
      }) is not a valid number`
    );
  } catch (error) {
    if (error instanceof Error) {
      console.error("Caught error:", error.message);
    } else {
      console.error("An unknown error occurred");
    }
  }

  return 0; // Return 0 if any error occurs or if the value is invalid.
}

/**
 * Checks if the provided value is a valid number (not NaN).
 * This function narrows the type of `value` to `number` if it's a valid number.
 *
 * @param {any} value - The value to check.
 * @returns {value is number} - Returns `true` if the value is a valid number, otherwise `false`.
 */
function isValidNumber(value: any): value is number {
  return typeof value === "number" && !isNaN(value);
}

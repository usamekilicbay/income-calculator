import { convertFromInput } from "./eventNumberParser";

/**
 * Takes the input event extracts the number and passes it to enforceMinMax
 * function and returns the value within the given limitations.
 * @param { number } value - a number value that will be checked with given limitations
 * @param { number } min - minimum value for the given value
 * @param { number } max - maximum value for the given value
 * @param { boolean } allowEmpty - is empty value allowed
 * @returns { number } number min, max or 0. If there's an error, 0 or min value.
 */
export default function enforceMinMax(
  value: number,
  min: number,
  max: number,
  allowEmpty: boolean = false
): number {
  try {
    // Validate that value is a valid number (not NaN)
    if (isNaN(value)) {
      throw new Error("Invalid input value, not a number.");
    }

    // Ensure min is not greater than max
    if (min > max) {
      throw new Error(
        `Minimum number (${min}) cannot be bigger than maximum number (${max})`
      );
    }

    // If value is less than min AND empty allowed, return 0
    if (allowEmpty && value < min) {
      return 0;
    }

    // Return the value constrained within the min and max bounds
    return Math.max(min, Math.min(max, value));
  } catch (error) {
    if (error instanceof Error) {
      console.error("Caught error:", error.message);
    } else {
      console.error("An unknown error occurred");
    }
  }

  // If value is less than min AND empty allowed, return 0
  if (allowEmpty && value < min) {
    return 0;
  }

  // Return min if there's an error
  return min;
}

/**
 * Takes the input event extracts the number and passes it to enforceMinMax
 * function and returns the value within the given limitations.
 * @param { Event } event - event from default input element to extract the number
 * @param { number } min - minimum value for the given value
 * @param { number } max - maximum value for the given value
 * @param { boolean } allowEmpty - is empty value allowed
 * @returns { number } number
 */
export function enforceMinMaxWithInputEvent(
  event: Event,
  min: number,
  max: number,
  allowEmpty: boolean = false
): number {
  const value = convertFromInput(event);

  if (value) {
    return enforceMinMax(value, min, max, allowEmpty);
  }

  // Return if event.value is not a number AND empty is allowed
  if (allowEmpty) {
    return 0;
  }

  // Return min if event.value is not a number
  return min;
}

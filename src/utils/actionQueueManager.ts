import { TUpdateFields } from "../components/CurrencyRow.vue";

// An array that holds registered actions with associated ids
let actionQueue: { id: string; callback: Function }[] = [];

/**
 * Registers a new callback function associated with a unique ID.
 *
 * This function ensures that each ID is only registered once. If an ID is already registered,
 * a message will be logged, and the callback will not be added again.
 *
 * @param {string} id - The unique identifier for the callback.
 * @param {TUpdateFields} callback - The callback function that will be invoked for the given ID.
 */
export const register = (id: string, callback: TUpdateFields) => {
  if (actionQueue.some((x) => x.id === id)) {
    console.log(`${id} already registered`);
    return;
  }

  // Create a new array with the new action added (immutability)
  actionQueue = [...actionQueue, { id, callback }];
};

/**
 * Unregisters the callback associated with the specified ID.
 *
 * This function removes the entry from the `actionQueue` array based on the provided ID.
 *
 * @param {string} id - The unique identifier for the callback to be removed.
 */
export const unregister = (id: string) => {
  actionQueue = actionQueue.filter((x) => x.id !== id);
};

/**
 * Triggers all registered actions, except for the one with the specified ID.
 *
 * This function is used to trigger all actions in the `actionQueue` array, passing the specified amount
 * to the callback functions, except the callback associated with the provided ID.
 *
 * @param {string} id - The ID that will be excluded from the triggering process.
 * @param {number} amount - The value to be passed to each callback function.
 */
export const trigger = (id: string, amount: number) => {
  actionQueue.forEach((x) => {
    if (x.id !== id) {
      x.callback("siblingTrigger", amount);
    }
  });
};

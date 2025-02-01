<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import { enforceMinMaxWithInputEvent } from "../../helpers/valueEnforcer";
import { TNumberInputState } from "../../common/type";

const props = defineProps<{
  id: string;
  min: number;
  max: number;
  allowEmpty?: boolean;
  inputState: TNumberInputState;
  validClass: string;
  invalidClass: string;
}>();

const emit = defineEmits<{
  (event: "update:modelValue", value: number): void;
  (event: "update:inputState", value: TNumberInputState): void;
}>();

// const value = ref<number>(1);
const tempValue = ref<number>(1);

const inputState = computed<TNumberInputState>(() => {
  // Less than minimum limit
  if (tempValue.value < props.min && props.max > 0) return "small";
  // More than maximum limit
  if (tempValue.value > props.max) return "big";
  // Within the valid range
  if (tempValue.value > props.min && tempValue.value < props.max)
    return "valid";
  // Empty but allowed (valid)
  if (props.allowEmpty) return "valid";
  // Empty (invalid)
  return "empty";
});

//#region HANDLE
// Handles the input for annual leave and updates the duration if the input is valid.
// const handleOnInput = () => {
// inputState.value === "valid" && (value.value = tempValue.value);
// };

const handleOnChange = ($event: Event) => {
  tempValue.value = enforceMinMaxWithInputEvent(
    $event,
    props.min,
    props.max,
    props.allowEmpty
  );
};
//#endregion

watch(tempValue, () => {
  emit("update:modelValue", tempValue.value);
});

watch(inputState, () => emit("update:inputState", inputState.value));
</script>

<template>
  <input
    :id="props.id"
    v-model="tempValue"
    @change="handleOnChange($event)"
    :class="{
      [props.validClass]: inputState === 'valid',
      [props.invalidClass]: inputState !== 'valid',
    }"
  />
</template>

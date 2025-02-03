<script lang="ts" setup>
import { computed, onMounted, ref, watch } from "vue";
import { enforceMinMaxWithInputEvent } from "../../helpers/valueEnforcer";
import { TNumberInputState } from "../../common/type";
import { isValidNumber } from "../../helpers/eventNumberParser";

const props = defineProps<{
  id: string;
  originalValue: number;
  min: number;
  max: number;
  allowEmpty?: boolean;
  validClass: string;
  invalidClass: string;
}>();

const emit = defineEmits<{
  (event: "update:modelValue", value: number): void;
  (event: "update:inputState", value: TNumberInputState): void;
}>();

// TODO: Remove
// const value = ref<number>(1);
const tempValue = ref<number>(0);

const inputState = computed<TNumberInputState>(() => {
  // TODO: Remove
  if (props.id === "annual-leave") {
    console.log(tempValue.value, "annual");
  }
  // Valid number input
  if (isValidNumber(tempValue.value)) {
    // Less than minimum limit
    if (tempValue.value < props.min) {
      // Empty but allowed (valid)
      if (props.allowEmpty) return "valid";
      return "small";
    }
    // More than maximum limit
    if (tempValue.value > props.max) return "big";
    // Within the valid range
    if (tempValue.value >= props.min && tempValue.value <= props.max)
      return "valid";
  }

  // Empty but allowed (valid)
  if (props.allowEmpty) return "valid";
  // Empty (invalid)
  return "empty";
});

//#region HANDLE
// TODO: Remove
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

onMounted(() => (tempValue.value = props.originalValue));

watch(tempValue, () => {
  if (inputState.value === "valid") {
    emit("update:modelValue", tempValue.value);
  }
});

watch(inputState, () => {
  emit("update:inputState", inputState.value);
});

watch(
  () => props.originalValue,
  () => (tempValue.value = props.originalValue)
);
</script>

<template>
  <input
    :id="props.id"
    type="number"
    v-model.number="tempValue"
    @change="handleOnChange($event)"
    :class="{
      [props.validClass]: inputState === 'valid',
      [props.invalidClass]: inputState !== 'valid',
    }"
  />
</template>

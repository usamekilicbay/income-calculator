<script setup lang="ts">
import { inject, onMounted, onUnmounted, ref, watch } from "vue";
import { TrashIcon } from "@heroicons/vue/24/outline";
import { TColumns, TCurrency, TFormula } from "../common/type";
import { register, trigger, unregister } from "../utils/actionQueueManager";
import { enforceMinMaxWithInputEvent } from "../helpers/valueEnforcer";

// Props
const props = defineProps<{
  formula: TFormula;
  currency: TCurrency;
  currencyRate?: number;
  updateActiveCurrency: (currency: TCurrency) => void;
  removeCurrency: (currency: TCurrency) => void;
}>();

// Reactive variables for income values in different time periods
const hourly = ref<number>(0);
const daily = ref<number>(0);
const weekly = ref<number>(0);
const monthly = ref<number>(0);
const annually = ref<number>(0);

// Object for refs to take advantage from keyof typeof combination
const periods = { hourly, daily, weekly, monthly, annually };

const columns = inject<TColumns>("columns")!;

onMounted(() => register(props.currency.abbr, updateFields2));
onUnmounted(() => unregister(props.currency.abbr));

const handleOnInput = ($event: Event, baseIncome: keyof typeof periods) => {
  periods[baseIncome].value = enforceMinMaxWithInputEvent($event, 1, Infinity);

  props.updateActiveCurrency(props.currency);
  updateFields2(baseIncome);

  trigger(props.currency.abbr, hourly.value);
};

const updateFields2 = (
  baseIncome:
    | keyof typeof periods
    | "siblingTrigger"
    | "formulaTrigger" = "siblingTrigger",
  amount: number = 1
) => {
  const currencyRate = props.currencyRate ?? 1;

  // console.log(`${baseIncome} ${props.currency.abbr}`);
  hourly.value = hourly.value === 0 ? 1 : hourly.value;
  daily.value = daily.value === 0 ? 1 : daily.value;
  weekly.value = weekly.value === 0 ? 1 : weekly.value;
  monthly.value = monthly.value === 0 ? 1 : monthly.value;
  annually.value = annually.value === 0 ? 1 : annually.value;

  if (baseIncome === "formulaTrigger") {
    // 4 hours - 20 days - 20 annual leave
    hourly.value = parseFloat((daily.value / props.formula.hours).toFixed(2)); // 1/4 * cur
    daily.value = parseFloat((hourly.value * props.formula.hours).toFixed(2)); // 4cur
    monthly.value = parseFloat((props.formula.days * daily.value).toFixed(2)); // 4cur * 20
    weekly.value = parseFloat((monthly.value / 4.33).toFixed(2)); // 80cur / 4.33
    annually.value = // 80cur * 12 - 20 * 4cur
      parseFloat(
        (monthly.value * 12 - props.formula.annualLeave * daily.value).toFixed(
          2
        )
      );

    return;
  }

  switch (baseIncome) {
    case "siblingTrigger":
      // 4 hours - 20 days - 20 annual leave
      hourly.value = props.formula.hours / props.formula.hours; // 1/4 * cur
      daily.value = props.formula.hours; // 4cur
      monthly.value = props.formula.days * daily.value; // 4cur * 20
      weekly.value = monthly.value / 4.33; // 80cur / 4.33
      annually.value = // 80cur * 12 - 20 * 4cur
        monthly.value * 12 - props.formula.annualLeave * daily.value;
      break;
    case "hourly":
      daily.value = props.formula.hours * hourly.value;
      monthly.value = props.formula.days * daily.value;
      weekly.value = monthly.value / 4.33;
      annually.value =
        monthly.value * 12 - props.formula.annualLeave * daily.value;
      break;
    case "daily":
      hourly.value = daily.value / props.formula.hours;
      monthly.value = props.formula.days * daily.value;
      weekly.value = monthly.value / 4.33;
      annually.value =
        monthly.value * 12 - props.formula.annualLeave * daily.value;
      break;
    case "weekly":
      monthly.value = props.formula.days / 4.33;
      daily.value = monthly.value / props.formula.days;
      hourly.value = daily.value / props.formula.hours;
      annually.value =
        monthly.value * 12 - props.formula.annualLeave * daily.value;
      break;
    case "monthly":
      daily.value = monthly.value / props.formula.days;
      hourly.value = daily.value / props.formula.hours;
      weekly.value = monthly.value / 4.33;
      annually.value =
        monthly.value * 12 - props.formula.annualLeave * daily.value;
      break;
    case "annually":
      monthly.value = annually.value / 12;
      weekly.value = monthly.value / 4.33;
      daily.value = monthly.value / props.formula.days;
      hourly.value = daily.value / props.formula.hours;
      break;
  }

  hourly.value = parseFloat((hourly.value * currencyRate * amount).toFixed(2));
  daily.value = parseFloat((daily.value * currencyRate * amount).toFixed(2));
  weekly.value = parseFloat((weekly.value * currencyRate * amount).toFixed(2));
  monthly.value = parseFloat(
    (monthly.value * currencyRate * amount).toFixed(2)
  );
  annually.value = parseFloat(
    (annually.value * currencyRate * amount).toFixed(2)
  );
};

/**
 * Function to update all income fields based on a changed value.
 * @param source - The field (e.g., "hourly", "daily") that triggered the update.
 */
// const updateFields = (
//   baseIncome: keyof typeof periods | "sibling" = "sibling",
//   amount: number = 1
// ) => {
//   console.log(`${props.currency.abbr}: updated`);

//   // console.log(props.currency.abbr);
//   const baseIncomeValue =
//     baseIncome === "sibling" ? 1 : periods[baseIncome].value;
//   for (const target in conversionRates[baseIncome]) {
//     const conversionRate = conversionRates[baseIncome][target];

//     const tempIncome: number = parseFloat(
//       (
//         baseIncomeValue *
//         conversionRate *
//         (props.currencyRate ?? 1) *
//         amount
//       ).toFixed(2)
//     );

//     (periods[target as keyof typeof periods] as { value: number }).value =
//       tempIncome;
//   }
// };
export type TUpdateFields = typeof updateFields2;

const handleOnRemoveCurrency = () => {
  props.removeCurrency(props.currency);
};

watch(
  () => props.currencyRate,
  () => {
    updateFields2("siblingTrigger");
  }
);

watch(
  () => props.formula,
  () => updateFields2("formulaTrigger"),
  { deep: true }
);
</script>

<template>
  <!-- Table Start -->
  <tr class="hover">
    <td>
      <div class="font-normal sm:font-bold text-sm sm:text-base">
        {{ props.currency.name }}
      </div>
    </td>
    <td>
      <div v-if="columns.hourly">
        <input
          :id="`hourly-${props.currency.abbr}`"
          type="number"
          step="any"
          class="input input-bordered input-xs w-full max-w-xs input-primary"
          v-model="hourly"
          @input="handleOnInput($event, 'hourly')"
        />
      </div>
    </td>
    <td>
      <div v-if="columns.daily">
        <input
          :id="`daily-${props.currency.abbr}`"
          type="number"
          step="any"
          class="input input-bordered input-xs w-full max-w-xs input-secondary"
          v-model="daily"
          @input="handleOnInput($event, 'daily')"
        />
      </div>
    </td>
    <td>
      <div v-if="columns.weekly">
        <input
          :id="`weekly-${props.currency.abbr}`"
          type="number"
          step="any"
          class="input input-bordered input-xs w-full max-w-xs input-info"
          v-model="weekly"
          @input="handleOnInput($event, 'weekly')"
        />
      </div>
    </td>
    <td>
      <div v-if="columns.montly">
        <input
          :id="`monthly-${props.currency.abbr}`"
          type="number"
          step="any"
          class="input input-bordered input-xs w-full max-w-xs input-success"
          v-model="monthly"
          @input="handleOnInput($event, 'monthly')"
        />
      </div>
    </td>
    <td>
      <div v-if="columns.annually">
        <input
          :id="`annually-${props.currency.abbr}`"
          type="number"
          step="any"
          class="input input-bordered input-xs w-full max-w-xs input-warning"
          v-model="annually"
          @input="handleOnInput($event, 'annually')"
        />
      </div>
    </td>
    <td>
      <button @click="handleOnRemoveCurrency" class="btn-ghost">
        <TrashIcon class="w-5 h-5 text-error" />
      </button>
    </td>
  </tr>
  <!-- Table End -->
</template>

<style scoped></style>

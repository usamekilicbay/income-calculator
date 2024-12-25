<script setup lang="ts">
import { ref, watch } from "vue";
import { conversionRates } from "../helpers/conversionRates";
import { TrashIcon } from "@heroicons/vue/24/outline";
import { TCurrency } from "./CalculatorMain.vue";

// Props
const props = defineProps<{
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

const handleOnInput = (baseIncome: keyof typeof periods) => {
  props.updateActiveCurrency(props.currency);
  updateFields(baseIncome);
};

/**
 * Function to update all income fields based on a changed value.
 * @param source - The field (e.g., "hourly", "daily") that triggered the update.
 */
const updateFields = (baseIncome: keyof typeof periods | "default") => {
  const baseIncomeValue =
    baseIncome === "default" ? 1 : periods[baseIncome].value;
  for (const target in conversionRates[baseIncome]) {
    const conversionRate = conversionRates[baseIncome][target];

    const tempIncome: number = parseFloat(
      (baseIncomeValue * conversionRate * (props.currencyRate ?? 1)).toFixed(2)
    );

    (periods[target as keyof typeof periods] as { value: number }).value =
      tempIncome;
  }
};

const handleOnRemoveCurrency = () => {
  props.removeCurrency(props.currency);
};

watch(
  () => props.currencyRate,
  () => updateFields("default")
);
</script>

<template>
  <tr class="hover">
    <td>
      <div class="font-bold">{{ props.currency.name }}</div>
    </td>
    <td>
      <input
        :id="`hourly-${props.currency.abbr}`"
        type="number"
        class="input input-bordered input-xs w-full max-w-xs input-primary"
        v-model="hourly"
        @input="handleOnInput('hourly')"
      />
    </td>
    <td>
      <input
        :id="`daily-${props.currency.abbr}`"
        type="number"
        class="input input-bordered input-xs w-full max-w-xs input-secondary"
        v-model="daily"
        @input="handleOnInput('daily')"
      />
    </td>
    <td>
      <input
        :id="`weekly-${props.currency.abbr}`"
        type="number"
        class="input input-bordered input-xs w-full max-w-xs input-info"
        v-model="weekly"
        @input="handleOnInput('weekly')"
      />
    </td>
    <td>
      <input
        :id="`monthly-${props.currency.abbr}`"
        type="number"
        class="input input-bordered input-xs w-full max-w-xs input-success"
        v-model="monthly"
        @input="handleOnInput('monthly')"
      />
    </td>
    <td>
      <input
        :id="`annually-${props.currency.abbr}`"
        type="number"
        class="input input-bordered input-xs w-full max-w-xs input-warning"
        v-model="annually"
        @input="handleOnInput('annually')"
      />
    </td>
    <td>
      <button @click="handleOnRemoveCurrency" class="btn-ghost">
        <TrashIcon class="w-5 h-5 text-error" />
      </button>
    </td>
  </tr>
</template>

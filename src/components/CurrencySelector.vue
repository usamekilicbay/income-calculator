<script setup lang="ts">
import axios from "axios";
import { ref, onMounted } from "vue";
import { TCurrency } from "./CalculatorMain.vue";

const props = defineProps<{
  addNewCurrency: (currency: TCurrency) => void;
}>();

const currencies = ref<TCurrency[]>([]);

onMounted(() => {
  fetchCurrencies();
});

// Fetch currency list for select
const fetchCurrencies = async () => {
  try {
    const response = await axios.get(
      "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json"
    );

    const keys: string[] = Object.keys(response.data);
    const values: string[] = Object.values(response.data);

    currencies.value = keys.map((abbr, index) => {
      let currency = values[index];

      if (!currency) {
        currency = abbr.charAt(0).toUpperCase() + abbr.slice(1);
      }

      return { abbr: abbr, name: currency };
    });
  } catch (error) {
    console.error("Error fetching currencies:", error);
  }
};

// Method to handle currency selection
const handleCurrencySelect = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  const selectedValue = target.value;

  console.log(selectedValue);
  if (selectedValue) {
    const currency = currencies.value.find(
      (currency) => currency.abbr === selectedValue
    );

    if (currency) {
      props.addNewCurrency(currency);
    }

    target.selectedIndex = 0;
  }
};
</script>

<template>
  <select
    id="currency-selector"
    class="select select-bordered select-accent w-full max-w-xs"
    @change="handleCurrencySelect"
  >
    <option disabled selected>Add new currency</option>
    <option
      v-for="currency in currencies"
      :key="currency.abbr"
      :value="currency.abbr"
    >
      {{ currency.name }}
    </option>
  </select>
</template>

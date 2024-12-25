<script setup lang="ts">
import axios from "axios";
import { ref, onMounted } from "vue";

const props = defineProps<{
  addNewCurrency: (currencyName: string) => void;
}>();

const currencies = ref<string[]>([]);
const currencyAbbr = ref<string[]>([]);

onMounted(() => {
  fetchCurrencies();
});

// Fetch currency list for select
const fetchCurrencies = async () => {
  try {
    const response = await axios.get(
      "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json"
    );

    currencyAbbr.value = Object.keys(response.data);
    currencies.value = Object.values(response.data);

    // Use indices to update the reactive array
    currencies.value = currencies.value.map((value, index) => {
      if (!value) {
        const tempValue = currencyAbbr.value[index];
        return tempValue.charAt(0).toUpperCase() + tempValue.slice(1);
      }
      return value;
    });

    console.log(response.data);
  } catch (error) {
    console.error("Error fetching currencies:", error);
  }
};

// Method to handle currency selection
const handleCurrencySelect = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  const selectedValue = target.value;

  if (selectedValue) {
    props.addNewCurrency(selectedValue);

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
    <option v-for="currency in currencies" :key="currency" :value="currency">
      {{ currency }}
    </option>
  </select>
</template>

<script lang="ts" setup>
import axios from "axios";
import CurrencyRow from "./CurrencyRow.vue";
import CurrencySelector from "./CurrencySelector.vue";
import { onMounted, ref } from "vue";
import useLocalStorage from "../helpers/useLocalStorage";
import Links from "./Links.vue";

export type TMoney = {
  amount: number;
  name: string;
};

const activeCurrency = ref<string>();
const currencies = useLocalStorage<string[]>([], "currencies");
const exchangeRates = ref<{ activeCurrency: string; rates: TMoney[] }>();

const prepare = async () => {
  if (!currencies || currencies.value.length === 0) {
    return;
  }
  if (!activeCurrency.value) {
    activeCurrency.value = currencies.value[0];
  }

  fetchCurrencies();
};

const fetchCurrencies = async () => {
  try {
    if (!activeCurrency.value) {
      throw new Error(`${activeCurrency} is undefined`);
    }

    const response = await axios.get(
      `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${activeCurrency.value}.json`
    );

    if (!response) {
      throw new Error(`Currency data for ${activeCurrency} not found.`);
    }

    const activeCurrencyName = activeCurrency.value;

    exchangeRates.value = { activeCurrency: activeCurrency.value, rates: [] };

    currencies.value.forEach((targetCurrencyName: string) => {
      exchangeRates.value?.rates.push({
        amount: response.data[activeCurrencyName][targetCurrencyName],
        name: targetCurrencyName,
      });
    });
  } catch (error) {
    console.error("Failed to fetch currency:", error);
  }
};

const addNewCurrency = async (currency: string) => {
  if (currencies.value.includes(currency)) {
    return;
  }

  currencies.value.push(currency);

  await updateActiveCurrency(currency);
};

const removeCurrency = (currency: string) => {
  currencies.value = currencies.value.filter((x) => x !== currency);
};

const updateActiveCurrency = async (currency: string) => {
  if (activeCurrency.value === currency) {
    return;
  }

  activeCurrency.value = currency;
  await fetchCurrencies();
};

onMounted(() => {
  prepare();
});
</script>

<template>
  <div class="navbar mb-5">
    <div class="navbar-start">
      <Links></Links>
    </div>
  </div>
  <CurrencySelector
    class="mb-5"
    :add-new-currency="addNewCurrency"
  ></CurrencySelector>
  <table
    class="table table-xs w-full max-w-2xl border-spacing-y-3 border-separate mx-auto"
  >
    <thead>
      <tr>
        <th>Currency</th>
        <th>Hourly</th>
        <th>Daily</th>
        <th>Weekly</th>
        <th>Monthly</th>
        <th>Annually</th>
      </tr>
    </thead>
    <tbody>
      <CurrencyRow
        v-if="activeCurrency"
        :currency-name="currency"
        :currency-rate="
          exchangeRates?.rates.find((x) => x.name === currency)?.amount
        "
        :update-active-currency="updateActiveCurrency"
        :remove-currency="removeCurrency"
        :key="currency"
        v-for="currency in currencies"
      ></CurrencyRow>
    </tbody>
  </table>
</template>

<style scoped></style>

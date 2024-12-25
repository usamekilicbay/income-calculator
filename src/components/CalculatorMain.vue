<script lang="ts" setup>
import axios from "axios";
import CurrencyRow from "./CurrencyRow.vue";
import CurrencySelector from "./CurrencySelector.vue";
import { onMounted, ref } from "vue";
import useLocalStorage from "../helpers/useLocalStorage";
import Links from "./Links.vue";

export type TMoney = {
  amount: number;
} & TCurrency;

export type TCurrency = {
  name: string;
  abbr: string;
};

const activeCurrency = ref<TCurrency>();
const currencies = useLocalStorage<TCurrency[]>([], "currencies");
const exchangeRates = ref<{ activeCurrency: TCurrency; rates: TMoney[] }>();

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

    console.log(`active ${activeCurrency.value.name}`);

    const response = await axios.get(
      `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${activeCurrency.value.abbr}.json`
    );

    if (!response) {
      throw new Error(
        `Currency data for ${activeCurrency.value.abbr} not found.`
      );
    }

    exchangeRates.value = { activeCurrency: activeCurrency.value, rates: [] };

    currencies.value.forEach((targetCurrency: TCurrency) => {
      exchangeRates.value?.rates.push({
        abbr: targetCurrency.abbr,
        name: targetCurrency.name,
        amount: response.data[activeCurrency.value!.abbr][targetCurrency.abbr],
      });
    });
  } catch (error) {
    console.error("Failed to fetch currency:", error);
  }
};

const addNewCurrency = async (currency: TCurrency) => {
  if (currencies.value.includes(currency)) {
    return;
  }

  currencies.value.push(currency);

  await updateActiveCurrency(currency);
};

const removeCurrency = (currency: TCurrency) => {
  currencies.value = currencies.value.filter((x) => x !== currency);
};

const updateActiveCurrency = async (currency: TCurrency) => {
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
        :currency="currency"
        :currency-rate="
          exchangeRates?.rates.find((x) => x.name === currency.name)?.amount
        "
        :update-active-currency="updateActiveCurrency"
        :remove-currency="removeCurrency"
        :key="currency.abbr"
        v-for="currency in currencies"
      ></CurrencyRow>
    </tbody>
  </table>
</template>

<style scoped></style>

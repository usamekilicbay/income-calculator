<script lang="ts" setup>
import axios from "axios";
import CurrencyRow from "./CurrencyRow.vue";
import CurrencySelector from "./CurrencySelector.vue";
import { onMounted, provide, Reactive, ref } from "vue";
import useLocalStorageRef from "../helpers/useLocalStorageRef";
import Navbar from "./Navbar.vue";
import Work from "./Formula.vue";
import CurrencyHeader from "./CurrencyHeader.vue";
import useLocalStorageReactive from "../helpers/useLocalStorageReactive";
import { TColumns, TCurrency, TFormula, TMoney } from "../common/type";

const columns = useLocalStorageReactive<TColumns>(
  {
    hourly: true,
    daily: true,
    weekly: true,
    montly: true,
    annually: true,
  },
  "columns"
);
const formula = ref<TFormula>();
const activeCurrency = ref<TCurrency>();
const currencies = useLocalStorageRef<TCurrency[]>([], "currencies");
const exchangeRates = ref<{ activeCurrency: TCurrency; rates: TMoney[] }>();

provide<Reactive<TColumns>>("columns", columns);

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

const removeCurrency = (currency: TCurrency): void => {
  currencies.value = currencies.value.filter((x) => x !== currency);
};

const updateActiveCurrency = async (currency: TCurrency): Promise<void> => {
  if (activeCurrency.value === currency) {
    return;
  }

  activeCurrency.value = currency;
  await fetchCurrencies();
};

const updateFormula = (updatedFormula: TFormula): void => {
  formula.value = updatedFormula;
};

onMounted(() => {
  prepare();
});
</script>

<template>
  <Navbar class="px-3 sm:px-6"></Navbar>
  <Work :update-formula="updateFormula" class="mt-5 mb-3"></Work>
  <CurrencySelector
    class="mb-5"
    :add-new-currency="addNewCurrency"
  ></CurrencySelector>
  <!-- Table Start -->
  <div class="overflow-auto">
    <table
      class="table table-xs max-w-xs md:max-w-2xl lg:max-w-3xl border-spacing-y-3 border-separate mx-auto"
    >
      <thead>
        <CurrencyHeader></CurrencyHeader>
      </thead>
      <tbody>
        <CurrencyRow
          v-if="activeCurrency && formula"
          :formula="formula"
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
  </div>

  <!-- Table End -->
</template>

<style scoped></style>

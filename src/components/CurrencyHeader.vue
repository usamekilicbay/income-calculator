<script lang="ts" setup>
import { inject } from "vue";
import { TColumns } from "../common/type";

const columns = inject<TColumns>("columns")!;
</script>

<template>
  <tr>
    <th class="">Currency</th>
    <th class="text-th">
      <div class="flex gap-x-1">
        <span v-if="columns.hourly"> Hourly </span>
        <label
          :class="
            columns.hourly ? 'swap swap-flip swap-active' : 'swap swap-flip'
          "
          @click="columns.hourly = !columns.hourly"
        >
          <div className="swap-on">👁️</div>
          <div className="swap-off">🕳️</div>
        </label>
      </div>
    </th>
    <th class="text-th">
      <div class="flex gap-x-1">
        <span v-if="columns.daily"> Daily </span>
        <label
          :class="
            columns.daily ? 'swap swap-flip swap-active' : 'swap swap-flip'
          "
          @click="columns.daily = !columns.daily"
        >
          <div className="swap-on">👁️</div>
          <div className="swap-off">🕳️</div>
        </label>
      </div>
    </th>
    <th class="text-th">
      <div class="flex gap-x-1">
        <span v-if="columns.weekly"> Weekly </span>
        <label
          :class="
            columns.weekly ? 'swap swap-flip swap-active' : 'swap swap-flip'
          "
          @click="columns.weekly = !columns.weekly"
        >
          <div className="swap-on">👁️</div>
          <div className="swap-off">🕳️</div>
        </label>
      </div>
    </th>
    <th class="text-th">
      <div class="flex gap-x-1">
        <span v-if="columns.montly"> Monthly </span>
        <label
          :class="
            columns.montly ? 'swap swap-flip swap-active' : 'swap swap-flip'
          "
          @click="columns.montly = !columns.montly"
        >
          <div className="swap-on">👁️</div>
          <div className="swap-off">🕳️</div>
        </label>
      </div>
    </th>
    <th class="text-th">
      <div class="flex gap-x-1">
        <span v-if="columns.annually"> Annually </span>
        <label
          :class="
            columns.annually ? 'swap swap-flip swap-active' : 'swap swap-flip'
          "
          @click="columns.annually = !columns.annually"
        >
          <div className="swap-on">👁️</div>
          <div className="swap-off">🕳️</div>
        </label>
      </div>
    </th>
  </tr>
</template>

<style scoped>
.text-th {
  @apply font-medium sm:font-bold text-sm sm:text-lg;
}
</style>

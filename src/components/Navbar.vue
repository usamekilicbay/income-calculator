<script lang="ts" setup>
import Links from "./Links.vue";
</script>

<template>
  <div class="navbar">
    <div class="w-full h-11 px-3 font-mono bg-slate-700 rounded-lg">
      <div class="navbar-start">
        <a href="#" class="font-extrabold flex">
          <img src="/RateMateLogo.png" class="size-10" />
          <span class="self-center">RATEMATE</span>
        </a>
      </div>
      <div class="navbar-end">
        <Links></Links>
      </div>
    </div>
  </div>
</template>

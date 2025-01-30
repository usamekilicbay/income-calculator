<script lang="ts" setup>
import { FaGithub, FaLinkedin, FaTwitter } from "vue3-icons/fa";
</script>

<template>
  <div class="flex justify-end items-center space-x-2">
    <a href="https://www.fiverr.com/usame_kilicbay/">
      <img src="../assets/fiverr-logo.jpg" class="h-5 rounded" />
    </a>
    <a href="https://www.linkedin.com/in/usame-kilicbay/">
      <FaLinkedin class="link-icon h-7 text-blue-500" />
    </a>
    <a href="https://www.x.com/usame_kilicbay/">
      <FaTwitter class="link-icon h-7 text-blue-400" />
    </a>
    <a href="https://github.com/usamekilicbay/"
      ><FaGithub class="link-icon h-7 text-orange-400"
    /></a>
  </div>
</template>

<style lang="css" scoped>
a {
  color: orange;
  font-size: larger;
}

.h-7:hover {
  color: white;
}

img:hover {
  filter: invert(100%) brightness(1000%);
}
</style>

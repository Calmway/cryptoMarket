<template>
  <div class="regular_layout_wrapper">
    <div class="component-content">
      <router-view />
    </div>
  </div>
</template>
<script setup lang="ts"></script>
<style lang="scss" scoped>
.regular_layout_wrapper {
  background: rgb(13, 20, 33);
  height: 100vh;
  overflow-y: auto;
}
</style>

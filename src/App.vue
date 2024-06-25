<template>
  <div class="app">
    <OsMain ref="terminalLoadingRef"></OsMain>
  </div>
</template>

<script setup lang="ts">
import OsMain from '@/views/WIN-OS/OsMain.vue'
import { nextTick, onMounted, ref } from 'vue'
const terminalLoadingRef = ref()

onMounted(() => {
  console.log(terminalLoadingRef)
  nextTick(() => {
    console.log(terminalLoadingRef)

    const terminalEl = terminalLoadingRef.value.$el
    console.log(terminalLoadingRef.value)
  })
})
</script>

<style scoped>
.app {
  width: 100vw;
  height: 100vh;
}
</style>
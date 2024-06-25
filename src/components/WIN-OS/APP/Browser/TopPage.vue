<template>
  <div class="top-page w-[150px] h-[30px] bg-slate-700 text-white rounded-lg flex items-center p-1 relative hover:bg-slate-600 duration-200" :class="{'active-page': browser.currentId === props.pageInfo._id}" :data-uniqueid="props.pageInfo._id" @mousedown.stop="" @mouseup.stop="togglePage($event)">
    <div class="top-page-text">
      {{ props.pageInfo.title }}
    </div>
    <div class="icon absolute w-4 h-4 right-2 flex justify-center items-center rounded-sm cursor-default hover:bg-slate-700 duration-75" :data-uniqueid="props.pageInfo._id" @mouseup.stop="closePage($event)">x</div>
  </div>
</template>

<script setup lang="ts">
import { useBrowserStore } from '@/stores/browserStore'

const props = defineProps(['pageInfo'])
const browser = useBrowserStore()
function togglePage(e: MouseEvent) {
  const _id = (e.currentTarget as HTMLDivElement).dataset.uniqueid!
  browser.togglePage(_id)
}

function closePage(e: MouseEvent) {
  const _id = (e.currentTarget as HTMLDivElement).dataset.uniqueid!
  browser.closePage(_id)
}
</script>

<style scoped lang="scss">
.top-page {
  @apply flex-shrink;

  .top-page-text {
    @apply text-ellipsis overflow-hidden whitespace-nowrap;
    max-width: calc(100% - 24px);
  }
}
</style>
<template>
  <div class="window-all">
    <Transition name="wallpaper">
      <div class="bgimg" v-show="wallpaperChanging"></div>
    </Transition>
    <Transition name="wallpaperMask">
      <div class="bgmask" v-show="!wallpaperChanging"></div>
    </Transition>
    <div class="window-main">
      <Window v-for="windowName in appsStore.activeApps" ref="windowList" :window-name="windowName" :key="windowName">
        <template v-slot="slotProps">
          <component :is="componentRef[slotProps.windowName as ComponentRef]" :window-name="slotProps.windowName" @wallpaperChange="wallpaperChange"></component>
        </template>
      </Window>
    </div>
    <Footer></Footer>
  </div>
</template>

<script setup lang="ts">
import Window from '@/components/WIN-OS/Window.vue'
import { useAppsStore } from '@/stores/appsStore'
import Browser from '@/components/WIN-OS/APP/Browser.vue'
import Terminal from '@/components/WIN-OS/APP/Terminal.vue'
import Wallpaper from '@/components/WIN-OS/APP/Wallpaper.vue'
import Blob from '@/components/WIN-OS/APP/BlobApp.vue'
import Chat from '@/components/WIN-OS/APP/ChatApp.vue'
import Footer from '@/components/WIN-OS/Footer.vue'
import { onMounted, reactive, ref } from 'vue'

const appsStore = useAppsStore()
appsStore.initApp()
// const url = '/wallpaper/windows1.jpg'

let wallpaperChanging = ref(true)
const windowList = reactive([])

type ComponentRef = 'Terminal' | 'Browser' | 'Blob' | 'Wallpaper' | 'Chat'
const componentRef: { [key in ComponentRef]: any } = {
  Terminal,
  Browser,
  Blob,
  Wallpaper,
  Chat
}

let timer: NodeJS.Timeout
let wallpaperDom: HTMLDivElement
function wallpaperChange(changeUrl: string) {
  wallpaperChanging.value = false
  clearTimeout(timer)
  timer = setTimeout(() => {
    wallpaperDom.style.background = `center / cover no-repeat url(${changeUrl})`
    wallpaperChanging.value = true
  }, 500)
}

onMounted(() => {
  wallpaperDom = document.querySelector('.bgimg')! as HTMLDivElement
})
</script>

<style lang="scss" scoped>
.window-all {
  width: 100%;
  height: 100%;
  .bgimg {
    width: 100%;
    height: 100%;
    position: absolute;
    background: center / cover no-repeat url(/wallpaper/windows1-zip.jpg);
    transition: background-color 0.15s linear;
  }

  .bgmask {
    width: 100%;
    height: 100%;
    position: absolute;
    background: radial-gradient(rgba(0, 0, 0, 0.314), black);
  }

  .window-main {
    height: calc(100% - 50px);
  }

  .runApps {
    position: absolute;
    z-index: 5;
  }
}

.wallpaper-enter-active,
.wallpaper-leave-active {
  transition: opacity 0.5s ease;
}

.wallpaper-enter-from,
.wallpaper-leave-to {
  opacity: 0;
}

.wallpaperMask-enter-active,
.wallpaperMask-leave-active {
  transition: opacity 0.5s ease;
}

.wallpaperMask-enter-from,
.wallpaperMask-leave-to {
  opacity: 0;
}
</style>
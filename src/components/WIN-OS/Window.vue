<template>
  <Transition name="window">
    <div class="window-app" :class="{'active-app': appsStore.activeApp === props.windowName}" :id="'window' + windowName" v-bind:style="{width: windowContext.width + 'px', height: windowContext.height + 'px', top: windowContext.top + 'px', left: windowContext.left + 'px', minHeight: windowContext.minHeight + 'px', minWidth: windowContext.minWidth + 'px', zIndex: windowContext.zIndex}" @mousedown="toggleWindowIndexToTop" v-show="windowContext.isShow" v-if="windowContext.isActive">

      <Resizeable :windowName="props.windowName"></Resizeable>

      <div class="window-control">
        <span class="btn btn-max" @click="enlargeWindow" v-if="windowContext.scalable"></span>
        <span class="btn btn-min" @click="miniWindow"></span>
        <span class="btn btn-close" @click="closeWindow"></span>
      </div>

      <slot :windowName="props.windowName">
      </slot>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import Resizeable from './Window/Resizeable.vue'
import { useAppsStore } from '../../stores/appsStore'
const props = defineProps({
  windowName: String
})

const appsStore = useAppsStore()

const windowSize = {
  width: window.innerWidth,
  height: window.innerHeight
}

const windowContext = appsStore.appContext(props.windowName!)

// const windowContext = appsStore[props.windowName?.toLowerCase() + 'Context']

const windowSizeBeforeMax = {
  top: windowContext.top,
  left: windowContext.left,
  right: windowContext.right,
  bottom: windowContext.bottom,
  height: windowContext.height,
  width: windowContext.width
}

// const windowWidth = computed(() => {
//   if(isSizing) {
//     return windowSize.width - windowContext.right - windowContext.left
//   } else {
//     return
//   }
// })

function enlargeWindow() {
  if (windowContext.top !== 0 || windowContext.left !== 0 || windowContext.right !== 0 || windowContext.bottom !== 50) {
    windowSizeBeforeMax.top = windowContext.top
    windowSizeBeforeMax.left = windowContext.left
    windowSizeBeforeMax.right = windowContext.right
    windowSizeBeforeMax.bottom = windowContext.bottom
    windowSizeBeforeMax.width = windowContext.width
    windowSizeBeforeMax.height = windowContext.height

    windowContext.top = 0
    windowContext.left = 0
    windowContext.right = 0
    windowContext.bottom = 50
    windowContext.width = windowSize.width
    windowContext.height = windowSize.height - 50
  } else {
    windowContext.top = windowSizeBeforeMax.top
    windowContext.left = windowSizeBeforeMax.left
    windowContext.right = windowSizeBeforeMax.right
    windowContext.bottom = windowSizeBeforeMax.bottom
    windowContext.width = windowSizeBeforeMax.width
    windowContext.height = windowSizeBeforeMax.height
  }
}

function miniWindow() {
  appsStore.minApp(props.windowName!)
}

function closeWindow() {
  appsStore.closeApp(props.windowName!)
  /* const index = appsStore.currentApps.findIndex(val => val === props.windowName)
  for (const windowName of appsStore.currentApps) {
    if (appsStore[windowName.toLowerCase() + 'Context'].zIndex > windowContext.zIndex) {
      appsStore[windowName.toLowerCase() + 'Context'].zIndex--
    }
  }
  appsStore.currentApps.splice(index, 1)
  windowContext.isActive = false */
}

function toggleWindowIndexToTop(e: MouseEvent) {
  if (/btn-close/.test((e.target as HTMLDivElement).classList.value) || /btn-min/.test((e.target as HTMLDivElement).classList.value)) {
    return
  }
  appsStore.toggleWindowIndexToTop(props.windowName!)
}

onMounted(() => {
  windowContext.windowBox = document.getElementById('window' + props.windowName)
})
</script>

<style lang="scss" scoped>
.window-app {
  position: absolute;
  backdrop-filter: blur(10px);
  opacity: 0.9;
  border-radius: 8px;
  overflow: hidden;
  transition: opacity 0.15s;

  .header {
    position: absolute;
    width: 100%;
    height: 30px;
    background-color: transparent;
  }

  .window-control {
    height: 30px;
    position: absolute;
    top: 0;
    right: 6px;
    display: flex;
    align-items: center;
    z-index: 999;

    & .btn::before {
      transition: all 0.2s;
      border-color: transparent;
    }

    & .btn::after {
      transition: all 0.2s;
      border-color: transparent;
    }

    &:hover .btn::before {
      border-color: #424242cc;
    }

    &:hover .btn::after {
      border-color: #424242cc;
    }

    .btn {
      position: relative;
      width: 20px;
      height: 20px;
      margin-right: 5px;
      border-radius: 50%;
    }

    .btn-max {
      background-color: rgba(19, 238, 19, 0.955);
    }

    .btn-max::before {
      content: '';
      display: block;
      width: 0px;
      height: 0px;
      position: absolute;
      left: 5px;
      top: 5px;
      border: transparent 3.5px solid;
      border-bottom-color: transparent !important;
      border-right-color: transparent !important;
    }

    .btn-max::after {
      content: '';
      display: block;
      width: 0px;
      height: 0px;
      position: absolute;
      right: 5px;
      bottom: 5px;
      border: transparent 3.5px solid;
      border-top-color: transparent !important;
      border-left-color: transparent !important;
    }

    .btn-min {
      background: yellow;
      &::before {
        content: '';
        display: block;
        width: 7px;
        height: 0;
        position: absolute;
        left: 5px;
        top: 8.5px;
        border: transparent 1.5px solid;
      }
    }

    .btn-close {
      background-color: red;

      &::before {
        content: '';
        display: block;
        width: 7px;
        height: 0;
        position: absolute;
        left: 6px;
        top: 8.5px;
        border: transparent 1.5px solid;
        transform: rotate(45deg);
      }

      &::after {
        content: '';
        display: block;
        width: 7px;
        height: 0;
        position: absolute;
        left: 6px;
        top: 8.5px;
        border: transparent 1.5px solid;
        transform: rotate(-45deg);
      }
    }
  }

  .scaleall {
    .window-resize {
      z-index: 3;
    }

    .window-resize-top {
      position: absolute;
      top: 0;
      left: 0;
      height: 3px;
      width: 100%;
      cursor: n-resize;
    }

    .window-resize-left {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 3px;
      cursor: w-resize;
    }

    .window-resize-right {
      position: absolute;
      top: 0;
      right: 0;
      height: 100%;
      width: 3px;
      cursor: e-resize;
    }

    .window-resize-bottom {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 3px;
      width: 100%;
      cursor: s-resize;
    }

    .window-resize-topleft {
      position: absolute;
      top: 0;
      left: 0;
      width: 6px;
      height: 6px;
      cursor: nw-resize;
    }

    .window-resize-topright {
      position: absolute;
      top: 0;
      right: 0;
      width: 6px;
      height: 6px;
      cursor: ne-resize;
    }

    .window-resize-bottomleft {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 6px;
      height: 6px;
      cursor: sw-resize;
    }

    .window-resize-bottomright {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 6px;
      height: 6px;
      cursor: se-resize;
    }
  }
}

.active-app {
  opacity: 1;
}

.window-enter-active,
.window-leave-active {
  transition: all 0.3s ease;
}

.window-enter-from,
.window-leave-to {
  transform: translateY(80%) scale(0.2, 0.2);
}
</style>
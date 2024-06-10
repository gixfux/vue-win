<template>
  <div class='resize-box'>
    <div class="header-move" @mousedown="beforeWindowMove"></div>

    <div class="scaleall" v-if="windowContext.scalable">
      <div class="window-resize window-resize-top" @mousedown="beforeResize"></div>
      <div class="window-resize window-resize-bottom" @mousedown="beforeResize"></div>
      <div class="window-resize window-resize-left" @mousedown="beforeResize"></div>
      <div class="window-resize window-resize-right" @mousedown="beforeResize"></div>

      <div class="window-resize window-resize-topleft" @mousedown="beforeResize"></div>
      <div class="window-resize window-resize-topright" @mousedown="beforeResize"></div>
      <div class="window-resize window-resize-bottomleft" @mousedown="beforeResize"></div>
      <div class="window-resize window-resize-bottomright" @mousedown="beforeResize"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppsStore } from '@/stores/appsStore'

const appsStore = useAppsStore()
const props = defineProps({
  windowName: String
})

const windowContext = appsStore.appContext(props.windowName!)

const windowSize = {
  width: window.innerWidth,
  height: window.innerHeight
}

function beforeWindowMove(e: MouseEvent) {
  document.body.style.userSelect = 'none'
  const onClickMousePos = {
    x: e.clientX,
    y: e.clientY
  }

  const initRange = {
    top: windowContext.top,
    left: windowContext.left,
    bottom: windowContext.bottom,
    right: windowContext.right
  }

  const maxTop = windowSize.height - windowContext.height - 50
  const maxLeft = windowSize.width - windowContext.width

  function windowMoving(e: MouseEvent) {
    const currentMousePos = {
      x: e.clientX,
      y: e.clientY
    }

    const offsetPos = { offsetX: currentMousePos.x - onClickMousePos.x, offsetY: currentMousePos.y - onClickMousePos.y }

    const newTop = initRange.top + offsetPos.offsetY
    const newLeft = initRange.left + offsetPos.offsetX
    const newRight = initRange.right - offsetPos.offsetX
    const newBottom = initRange.bottom - offsetPos.offsetY

    windowContext.top = newBottom > 50 ? Math.max(0, newTop) : maxTop
    windowContext.left = newRight > 0 ? Math.max(0, newLeft) : maxLeft
    windowContext.bottom = Math.max(50, newBottom)
    windowContext.right = Math.max(0, newRight)
  }

  function windowMoved() {
    document.body.style.userSelect = 'auto'
    document.removeEventListener('mousemove', windowMoving)
    document.removeEventListener('mouseup', windowMoved)
  }

  document.addEventListener('mousemove', windowMoving)
  document.addEventListener('mouseup', windowMoved)
}

function beforeResize(e: MouseEvent) {
  document.body.style.userSelect = 'none'
  const onClickMousePos = {
    x: e.clientX,
    y: e.clientY
  }
  const mainClass = (e.target as HTMLDivElement).classList.value

  const initRange = {
    top: windowContext.top,
    left: windowContext.left,
    bottom: windowContext.bottom,
    right: windowContext.right,
    maxTop: windowSize.height - windowContext.minHeight - windowContext.bottom,
    maxLeft: windowSize.width - windowContext.minWidth - windowContext.right
  }

  function mouseMoving(e: MouseEvent) {
    const currentMousePos = {
      x: e.clientX,
      y: e.clientY
    }
    const offsetPos = { offsetX: currentMousePos.x - onClickMousePos.x, offsetY: currentMousePos.y - onClickMousePos.y }

    if (/top/.test(mainClass)) {
      const newTop = initRange.top + offsetPos.offsetY
      windowContext.top = newTop < 0 ? 0 : newTop > initRange.maxTop ? initRange.maxTop : newTop
      windowContext.height = windowSize.height - windowContext.top - windowContext.bottom
    }
    if (/left/.test(mainClass)) {
      const newLeft = initRange.left + offsetPos.offsetX
      windowContext.left = newLeft < 0 ? 0 : newLeft > initRange.maxLeft ? initRange.maxLeft : newLeft
      windowContext.width = windowSize.width - windowContext.left - windowContext.right
    }
    if (/right/.test(mainClass)) {
      const newRight = initRange.right - offsetPos.offsetX
      windowContext.right = newRight < 0 ? 0 : newRight
      windowContext.width = windowSize.width - windowContext.left - windowContext.right
    }
    if (/bottom/.test(mainClass)) {
      const newBottom = initRange.bottom - offsetPos.offsetY
      windowContext.bottom = newBottom < 50 ? 50 : newBottom
      windowContext.height = windowSize.height - windowContext.top - windowContext.bottom
    }
  }

  function mouseMoved() {
    document.body.style.userSelect = 'auto'
    document.removeEventListener('mousemove', mouseMoving)
    document.removeEventListener('mouseup', mouseMoved)
  }

  document.addEventListener('mousemove', mouseMoving)
  document.addEventListener('mouseup', mouseMoved)
}
</script>

<style scoped lang="scss">
.resize-box {
  .header-move {
    position: absolute;
    top: 3;
    left: 3;
    right: 3;
    width: 100%;
    height: 30px;
    background-color: transparent;
    // position: absolute;
    z-index: 2;
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
</style>
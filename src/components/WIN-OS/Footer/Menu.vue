<template>
  <div id="menu">
    <div class="icon-menu" @click="footerStore.changeMenu()">
      <svg fill="white" width="30px" height="30px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <title>microsoft</title>
        <path d="M16.742 16.742v14.253h14.253v-14.253zM1.004 16.742v14.253h14.256v-14.253zM16.742 1.004v14.256h14.253v-14.256zM1.004 1.004v14.256h14.256v-14.256z"></path>
      </svg>
    </div>
    <div class="mask" v-show="footerStore.menuState" @click="footerStore.changeMenu()"></div>
    <Transition>
      <div class="menu-main" v-show="footerStore.menuState">
        <div class="item browser" @click="addApp('Browser')">
          <svg width="100px" height="100px" viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg" fill="none">
            <circle cx="96" cy="96" r="74" stroke="#2980b9" stroke-width="10" />
            <ellipse cx="96" cy="96" stroke="#2980b9" stroke-width="10" rx="30" ry="74" />
            <path stroke="#2980b9" stroke-linecap="round" stroke-linejoin="round" stroke-width="10" d="M28 72h136M28 120h136" />
          </svg>
        </div>

        <div class="item terminal" @click="addApp('Terminal')">
          <svg width="100px" height="100px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="System / Terminal">
              <path id="Vector" d="M17 15H12M7 10L10 12.5L7 15M3 15.8002V8.2002C3 7.08009 3 6.51962 3.21799 6.0918C3.40973 5.71547 3.71547 5.40973 4.0918 5.21799C4.51962 5 5.08009 5 6.2002 5H17.8002C18.9203 5 19.4796 5 19.9074 5.21799C20.2837 5.40973 20.5905 5.71547 20.7822 6.0918C21 6.5192 21 7.07899 21 8.19691V15.8031C21 16.921 21 17.48 20.7822 17.9074C20.5905 18.2837 20.2837 18.5905 19.9074 18.7822C19.48 19 18.921 19 17.8031 19H6.19691C5.07899 19 4.5192 19 4.0918 18.7822C3.71547 18.5905 3.40973 18.2837 3.21799 17.9074C3 17.4796 3 16.9203 3 15.8002Z" stroke="#ffffff" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
            </g>
          </svg>
        </div>

        <div class="item blob" @click="addApp('Blob')">
          <svg fill="none" width="100px" height="100px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 15.503A5.041 5.041 0 1 0 16 5.42a5.041 5.041 0 0 0 0 10.083zm0 2.215c-6.703 0-11 3.699-11 5.5v3.363h22v-3.363c0-2.178-4.068-5.5-11-5.5z" stroke="pink" stroke-width="1.5" />
          </svg>
        </div>

        <div class="item wallpaper" @click="addApp('Wallpaper')">
          <svg t="1713785966192" class="icon" viewBox="0 0 1024 1024" width="100px" height="100px">
            <path d="M392.32 800.192l242.912-242.944 164.992 164.992 0.032 77.76-407.968 0.192zM224 224l576-0.256 0.192 407.968-142.336-142.336a31.968 31.968 0 0 0-45.248 0L301.76 800.224H224V224z m576.256-64H223.712a63.808 63.808 0 0 0-63.68 63.744v576.512C160 835.424 188.544 864 223.68 864h576.544A63.808 63.808 0 0 0 864 800.256V223.744A63.84 63.84 0 0 0 800.256 160z" fill="white" p-id="4252"></path>
            <path d="M416 384a31.68 31.68 0 0 1 32 32 31.68 31.68 0 0 1-32 32 31.68 31.68 0 0 1-32-32c0-17.952 14.048-32 32-32m0 128c52.928 0 96-43.072 96-96s-43.072-96-96-96-96 43.072-96 96 43.072 96 96 96" fill="white" p-id="4253"></path>
          </svg>
        </div>

        <div class="item Chat" @click="addApp('Chat')">
          <svg width="100px" height="100px" viewBox="0 0 1024 1024" class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <path d="M885.8 383.8h-90.4c12.3 15.8 19.7 35.6 19.7 57.1v194c0 51.3-42 93.2-93.2 93.2H494.1c12.1 31 42.2 53.1 77.4 53.1h314.3c45.6 0 83-37.3 83-83V466.8c-0.1-45.7-37.4-83-83-83z" fill="" />
            <path d="M780.7 582.4V286.3c0-74.2-60.7-134.9-134.9-134.9H198.2c-74.2 0-134.9 60.7-134.9 134.9v296.1c0 70.5 54.8 128.7 123.8 134.4 0 0-20 155.4 4.9 155.4s188.4-154.9 188.4-154.9h265.3c74.3 0 135-60.7 135-134.9z m-424.1 74.9l-17.4 16.4c-0.3 0.3-34.5 32.7-73.2 67.1-8.5 7.5-16.2 14.3-23.3 20.5 1.9-20.9 3.9-36.6 3.9-36.8l8-62.3L192 657c-38.5-3.2-68.7-36-68.7-74.6V286.3c0-19.9 7.8-38.6 22.1-52.8 14.2-14.2 33-22.1 52.8-22.1h447.6c19.9 0 38.6 7.8 52.8 22.1 14.2 14.2 22.1 33 22.1 52.8v296.1c0 19.9-7.8 38.6-22.1 52.8-14.2 14.2-33 22.1-52.8 22.1H356.6z" fill="white" />
            <path d="M830.3 337.9c-16.2-3.3-32.1 7.1-35.4 23.3-3.3 16.2 7.1 32.1 23.3 35.4 39 8 67.3 42.7 67.3 82.5v177c0 41.6-31.1 77.5-72.3 83.4l-32.7 4.7 7.8 32.1c2 8.1 3.9 16.8 5.8 25.3-17.6-16.4-37.3-35.2-55.2-52.7l-8.7-8.6H562.5c-21.9 0-36.6-1.4-47.2-8.6-13.7-9.3-32.4-5.8-41.7 7.9-9.3 13.7-5.8 32.4 7.9 41.7 25.7 17.5 55.3 19 81 19h143.2c10 9.7 27.3 26.3 45 42.8 16.2 15.1 29.6 27.1 39.8 35.9 20 17 29.3 23.1 41.6 23.1 9.7 0 18.7-4.4 24.8-12.1 10.1-12.9 10.2-29.1 0.5-78.7-1.4-7.2-2.9-14.2-4.3-20.6 54.4-21.1 92.4-74.3 92.4-134.6v-177c0.1-68-48.4-127.4-115.2-141.2z" fill="white" />
            <path d="M434.6 602.8c-35.9 0-71-17.1-98.8-48.1-24.6-27.5-39.3-61.6-39.3-91.4v-29.7l29.7-0.3c0.4 0 36.2-0.4 95.4-0.4 16.6 0 30 13.4 30 30s-13.4 30-30 30c-22.3 0-41.2 0.1-56.2 0.1 3.8 7.1 8.8 14.5 15.1 21.6 16 17.9 35.7 28.1 54.1 28.1s38.1-10.3 54.1-28.1c6.5-7.3 11.6-14.9 15.4-22.2-13.7-2.8-24.1-15-24-29.5 0.1-16.5 13.5-29.9 30-29.9h0.1c27.1 0.1 32.5 0.2 33.6 0.3l28.9 1.1v28.9c0 29.8-14.7 63.9-39.3 91.4-27.9 31-62.9 48.1-98.8 48.1z m107.1-109.5z" fill="#33CC99" />
          </svg>
        </div>

      </div>

    </Transition>
  </div>
</template>

<script setup lang="ts">
import { useAppsStore } from '@/stores/appsStore'
import { useFooterStore } from '@/stores/footerStore'

const appsStore = useAppsStore()
const footerStore = useFooterStore()

function addApp(app: string) {
  appsStore.openApp(app)
  return
}
</script>

<style scoped>
#menu {
  .mask {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 50px;
    width: 100vw;
    background-color: transparent;
    z-index: 998;
  }
  .icon-menu {
    width: 50px;
    height: 50px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background: #ffffff46;
    }
  }

  .menu-main {
    position: absolute;
    box-sizing: border-box;
    width: 360px;
    height: 360px;
    background: #6c6c6c84;
    backdrop-filter: blur(4px);
    bottom: 50px;
    margin-bottom: 5px;
    border-radius: 5%;
    padding: 10px;
    z-index: 999;

    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, 1fr);

    .item {
      background-color: #353434d5;
      margin: 5px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 10%;
      transition: all 0.3s;

      &:hover {
        background-color: #35343463;
      }
    }
  }
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.1s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
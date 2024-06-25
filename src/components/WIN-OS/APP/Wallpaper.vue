<template>
  <div id="wallpaper">
    <!-- {{ props.windowName }} -->

    <div class="header">
      <svg t="1713785966192" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4251" xmlns:xlink="http://www.w3.org/1999/xlink" width="30" height="30">
        <path d="M392.32 800.192l242.912-242.944 164.992 164.992 0.032 77.76-407.968 0.192zM224 224l576-0.256 0.192 407.968-142.336-142.336a31.968 31.968 0 0 0-45.248 0L301.76 800.224H224V224z m576.256-64H223.712a63.808 63.808 0 0 0-63.68 63.744v576.512C160 835.424 188.544 864 223.68 864h576.544A63.808 63.808 0 0 0 864 800.256V223.744A63.84 63.84 0 0 0 800.256 160z" fill="white" p-id="4252"></path>
        <path d="M416 384a31.68 31.68 0 0 1 32 32 31.68 31.68 0 0 1-32 32 31.68 31.68 0 0 1-32-32c0-17.952 14.048-32 32-32m0 128c52.928 0 96-43.072 96-96s-43.072-96-96-96-96 43.072-96 96 43.072 96 96 96" fill="white" p-id="4253"></path>
      </svg>
      <div class="title">壁纸</div>
    </div>
    <div class="content">
      <div class="panel">
        <ul>
          <li @click="choosePanel('random')">随机</li>
          <li @click="choosePanel('color')">纯色</li>
          <li @click="choosePanel('self')">自选</li>
        </ul>
      </div>
      <div class="right-content">
        <div class="random right-box" v-show="currentPanel === 'random'">
          <div class="pics">
            <div class="pic" :class="{wallpaperActive: currentWallpaper === 'default'}" @click="changeWallpaper('default', '/wallpaper/windows1-zip.jpg')">
              <img src="/wallpaper/windows1-zip.jpg" alt="">
              <span>默认壁纸</span>
            </div>

            <div class="pic" :class="{wallpaperActive: currentWallpaper === 'random'}" @click="changeWallpaper('random', 'https://bing.img.run/rand.php')">
              <img src="https://bing.img.run/rand.php" alt="">
              <span>随机图片</span>
            </div>
          </div>
        </div>

        <div class="color right-box" v-show="currentPanel === 'color'">
          <ColorPicker @change-pure-color="changePureColor"></ColorPicker>
        </div>

        <div class="self right-box" v-show="currentPanel === 'self'">self</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ColorPicker from '@/components/WIN-OS/APP/wallpaperApp/ColorPicker.vue'

const emits = defineEmits(['wallpaperChange'])

let currentPanel = ref('color')
let currentWallpaper = ref('default')
function choosePanel(name: string) {
  currentPanel.value = name
}

function changeWallpaper(name: string, url: string) {
  if (currentWallpaper.value === name) {
    return
  }
  emits('wallpaperChange', url)
  currentWallpaper.value = name
}

function changePureColor() {
  currentWallpaper.value = 'pureColor'
}
</script>

<style scoped lang="scss">
#wallpaper {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: $appBackColor;
  overflow: hidden;

  .header {
    width: 100%;
    height: 30px;
    background-color: $appHeaderColor;
    display: flex;
    align-items: center;

    svg {
      margin-right: 6px;
    }

    .title {
      display: inline;
      color: white;
      font-weight: 700;
      font-size: large;
    }
  }

  .content {
    display: flex;
    user-select: none;
    height: calc(100% - 30px);
    .panel {
      height: 100%;
      width: 120px;
      color: white;
      font-size: 20px;
      background-color: #1f1e1ee5;

      ul > li {
        text-align: center;
        height: 30px;
        padding: 10px 10px;
        margin-bottom: 5px;
        border-radius: 10px;
        // background: #2a2c2f;
        transition: all 0.2s linear;

        &:hover {
          color: black;
          background-color: rgba(252, 252, 252, 0.796);
          transition: all 0.2s linear;
        }
      }
    }

    .right-content {
      height: 100%;
      width: calc(100% - 120px);

      .right-box {
        width: 100%;
        height: 100%;
        // display: flex;

        .pics {
          width: 100%;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          .pic {
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 5px;
            margin: 5px;
            border-radius: 5%;
            border: 3px solid transparent;
            transition: border-color 0.2s linear;

            &:hover {
              border-color: #ffffff3a;
            }

            img {
              width: 100%;
              height: 80%;
              border-radius: 5%;
              margin-bottom: 10px;
            }

            span {
              color: wheat;
              font-size: 20px;
            }
          }
        }
      }
    }
  }

  .wallpaperActive {
    border: 3px solid rgba(255, 255, 255, 0.805) !important;
  }
}
</style>
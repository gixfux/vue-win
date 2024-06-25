<template>
  <div id="browser" class="flex flex-col gap-1 bg-slate-800 bg-opacity-85">
    <!-- {{ props.windowName }} -->
    <div class="header h-[30px] w-full  bg-opacity-85 flex gap-1 items-center" @mousedown="onDrag($event)">
      <svg width="25px" height="25px" viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg" fill="white">
        <circle cx="96" cy="96" r="74" stroke="#000000" stroke-width="12" />
        <ellipse cx="96" cy="96" stroke="#000000" stroke-width="12" rx="30" ry="74" />
        <path stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="12" d="M28 72h136M28 120h136" />
      </svg>

      <div class="pages-header flex items-center gap-px select-none">
        <TopPage v-for="item in browser.pages" :key="item._id" :pageInfo="item" />
        <div class="add-icon h-6 basis-6 shrink-0 rounded-md flex justify-center items-center bg-slate-700 hover:bg-slate-600 duration-200 text-white text-2xl" @click="addPage">+</div>
      </div>
    </div>

    <div class="tools text-white h-7 flex gap-1 items-center">
      <div class="browser-tools-icon left-arr">
        <img src="/svg/browser/left-arrow.svg" class="w-5 h-5" alt="">
      </div>
      <div class="browser-tools-icon right-arr ">
        <img src="/svg/browser/right-arrow.svg" class="w-5 h-5" alt="">
      </div>
      <div class="browser-tools-icon refresh">
        <img src="/svg/browser/refresh.svg" class="w-5 h-5" alt="">
      </div>
      <div class="browser-tools-icon home">
        <img src="/svg/browser/home.svg" class="w-5 h-5" alt="">
      </div>
      <div class="url-show flex-grow h-[90%] text-black">
        <form action="" @submit="toggleUrl($event)">
          <input type="text" name="urlValue" class="outline-none w-full h-full rounded-2xl pl-3" v-model="browser.currentPageUrl">
        </form>
      </div>
      <div class="tools-right w-28"></div>
    </div>

    <transition-group name="list" tag="div" class="page-container w-full bg-opacity-85 flex-grow">
      <div class="borwser-page-item w-full h-full" v-for="(item, index) in browser.pages" :key="item._id" v-show="browser.currentPageIndex === index">
        <div v-if="item.type === 'index'" class="index-page w-full h-full grid grid-cols-9 grid-rows-9 text-white">
          <div class="title col-start-3 col-end-8 row-start-2 row-end-4 flex justify-center items-end gap-6">
            <span>必</span>
            <span>应</span>
            <span>谷</span>
          </div>
          <div class="seach-input col-start-3 col-end-8 row-start-4 row-end-5 flex justify-center items-center text-black">
            <form id="searchForm" action="" class="w-full h-1/2" @submit="search($event)">
              <input type="text" name="searchValue" class="outline-none w-full h-full rounded-2xl pl-3" placeholder="搜索或键入web地址" value="">
            </form>
          </div>
          <div class="slider-left col-start-1 col-end-3 row-start-3 row-end-8 bg-purple-500 bg-opacity-15">left</div>
          <div class="slider-right col-start-8 col-end-10 row-start-3 row-end-8 bg-purple-500 bg-opacity-15">right</div>
          <div class="adviser col-start-3 col-end-8 row-start-5 row-end-8 bg-green-500 bg-opacity-15">advise</div>
        </div>
        <iframe v-else class="w-full h-full" :src="item.url" frameborder="0"></iframe>
      </div>
    </transition-group>

  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useBrowserStore } from '@/stores/browserStore'
import TopPage from './Browser/TopPage.vue'
import { useAppsStore } from '@/stores/appsStore'

let form: HTMLFormElement

const browser = useBrowserStore()
browser.initPages()

onMounted(() => {})

function addPage() {
  browser.addPage('首页', '', 'index')
}

function onDrag(e: MouseEvent) {
  useAppsStore().moveApp(e, 'Browser')
}

function search(e: Event) {
  e.preventDefault()
  form = e.currentTarget as HTMLFormElement
  // @ts-ignore
  const searchValue = form.elements['searchValue'].value
  browser.addPage(`${searchValue} - 搜索`, `https://cn.bing.com/search?q=${searchValue}`, 'current')
}

function toggleUrl(e: Event) {
  e.preventDefault()
  form = e.currentTarget as HTMLFormElement
  // @ts-ignore
  const urlValue = form.elements['urlValue'].value
  const regexp = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/
  if (regexp.test(urlValue)) {
    const url = new URL(urlValue)

    browser.addPage(`搜索`, urlValue, 'current')
  } else {
    browser.addPage(`${urlValue} - 搜索`, browser.getBingSearchUrl(urlValue), 'current')
    browser.currentPageUrl = browser.getBingSearchUrl(urlValue)
  }
}
</script>

<style lang="scss" scoped>
input::placeholder {
  opacity: 0.5;
  text-align: center;
}

#browser {
  // position: relative;
  font-family: 'browserFont';
  width: 100%;
  height: 100%;
  overflow: hidden;

  .tools {
    .browser-tools-icon {
      @apply w-7 h-7 flex justify-center items-center rounded-md hover:bg-slate-500 duration-200;
    }
  }

  .page-container {
    .borwser-page-item {
      .index-page {
        background: center / cover no-repeat url(/wallpaper/browser.png);

        .title {
          font-size: 3rem;
          color: transparent;

          & span {
            background-clip: text;
          }

          & span:nth-child(1) {
            background-image: linear-gradient(-45deg, #3ab8f6, #214ee0, #40d8dd);
          }

          & span:nth-child(2) {
            background-image: linear-gradient(to right, #4285f4, #ea4335, #fbbc05, #4285f4, #34a853, #ea4335);
          }

          & span:nth-child(3) {
            background-image: linear-gradient(to right, #e10602, #2932e1, #e10602);
          }
        }
      }
    }
  }

  .pages-header {
    max-width: calc(100% - 180px);
  }

  .active-page {
    @apply bg-slate-600;
  }
}

.list-enter-active {
  transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
}
</style>
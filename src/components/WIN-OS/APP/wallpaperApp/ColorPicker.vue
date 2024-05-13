<template>
  <div class="color-picker">
    <div class="main-content">
      <div class="color-picker-title">纯色</div>
      <div class="table-choose">
        <div class="left table-item" :class="{'current-item': currentItem === 'left'}" @click="currentItem = 'left'">纯色</div>
        <div class="right table-item" :class="{'current-item': currentItem === 'right'}" @click="currentItem = 'right'">渐变</div>
      </div>

      <div class="radient-color">
        <div class="radient-type-selector">
          <div class="radient-selector">
            <span style="border-radius: 5px 0 0 5px;" :class="{'active': gradientType === 'linear'}" @click="gradientType = 'linear'">线性</span>
            <span style="border-radius: 0 5px 5px 0;" :class="{'active': gradientType === 'radial'}" @click="gradientType = 'radial'">径向</span>
          </div>
        </div>

        <div class="radient-panel" v-show="currentItem === 'right'">
          <div class="slider-bar-radient slider-bar">
            <div class="slider-back" :style="{color: 'black' ,background: gradientType === 'linear' ? `linear-gradient(${gradientDeg}deg, hsl(${gradientColor.left.hue}, ${gradientColor.left.saturation}%, ${gradientColor.left.lightness}%) ${gradientColor.left.position}%,hsl(${gradientColor.right.hue}, ${gradientColor.right.saturation}%, ${gradientColor.right.lightness}%) ${gradientColor.right.position}%)` : `radial-gradient(circle at center, hsla(${gradientColor.left.hue}, ${gradientColor.left.saturation}%, ${gradientColor.left.lightness}%, ${gradientColor.left.alpha}) ${gradientColor.left.position}%,hsla(${gradientColor.right.hue}, ${gradientColor.right.saturation}%, ${gradientColor.right.lightness}%, ${gradientColor.right.alpha}) ${gradientColor.right.position}%)`}">
              <div class="true-range-slider">
                <div class="gradient-btn" :class="{'gradient-active-btn': activeGradientPanel === 'left'}" :style="{ left: `${gradientColor.left.position}%`}" @mousedown="beforeBtnMove($event, 'left')"></div>
                <div class="gradient-btn" :class="{'gradient-active-btn': activeGradientPanel === 'right'}" :style="{ left: `${gradientColor.right.position}%`}" @mousedown="beforeBtnMove($event, 'right')"></div>
              </div>
            </div>
          </div>
          <div class="deg-input" @mouseenter="degTogglePanel = true" @mouseleave="degTogglePanel = false">
            <div>
              <input type="text" v-model="gradientDegText">
              deg
            </div>

            <div class="deg-toggle-panel" v-show="degTogglePanel === true" @mousedown="beforeDegToggle">
              <div class="circle">
                <div class="line-in-circle" :style="{transform: `rotate(${gradientDeg}deg)`}"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <pureColor @pure-color-change="pureColorChange" :activeType="activeType" :pureColor="currentPureColor" :gradientColor="gradientColor"></pureColor>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import pureColor from './pureColor.vue'
const emits = defineEmits(['changePureColor'])

let currentItem = ref('right')

const currentPureColor = reactive({
  hue: 0,
  saturation: 100,
  lightness: 50,
  alpha: 1
})

let activeGradientPanel = ref('left')

const gradientColor = reactive({
  left: {
    hue: 100,
    saturation: 100,
    lightness: 50,
    alpha: 1,
    position: 30
  },
  right: {
    hue: 0,
    saturation: 100,
    lightness: 50,
    alpha: 1,
    position: 60
  }
})

const gradientDeg = ref(90)
const gradientType = ref('linear')
const degTogglePanel = ref(true)

let timer: NodeJS.Timeout
const gradientDegText = computed({
  get() {
    return gradientDeg.value
  },
  set(newVal) {
    clearTimeout(timer)
    timer = setTimeout(() => {
      gradientDeg.value = newVal
    }, 300)
  }
})

let activeType = ref(1) // 1:pureColor 2:gradientLeftColor 3:gradientRightColor

let wallpaperDom: HTMLDivElement

let gradientPanel: HTMLDivElement
function beforeDegToggle(e: MouseEvent) {
  const x = e.offsetX - 50
  const y = 50 - e.offsetY
  let deg = Math.floor((Math.atan2(y, x) * 180) / Math.PI)

  if (deg < 0) {
    deg += 360
  }
  deg = 360 - deg

  gradientDeg.value = deg

  function degToggling(e: MouseEvent) {
    const x = e.offsetX - 50
    const y = 50 - e.offsetY
    if ((e.target as HTMLDivElement).classList.contains('line-in-circle')) {
      return
    }

    let deg = Math.floor((Math.atan2(y, x) * 180) / Math.PI)

    if (deg < 0) {
      deg += 360
    }
    deg = 360 - deg

    gradientDeg.value = deg
  }

  function stopToggle() {
    gradientPanel.removeEventListener('mousemove', degToggling)
    document.removeEventListener('mouseup', stopToggle)
  }

  gradientPanel.addEventListener('mousemove', degToggling)
  document.addEventListener('mouseup', stopToggle)
}

function pureColorChange(...value: number[]) {
  if (activeType.value === 1) {
    currentPureColor.hue = value[0]
    currentPureColor.saturation = value[1]
    currentPureColor.lightness = value[2]
    currentPureColor.alpha = value[3]
    emits('changePureColor', { hue: value[0], saturation: value[1], lightness: value[2] })
  } else if (activeType.value === 2) {
    gradientColor.left.hue = value[0]
    gradientColor.left.saturation = value[1]
    gradientColor.left.lightness = value[2]
    gradientColor.left.alpha = value[3]
  } else if (activeType.value === 3) {
    gradientColor.right.hue = value[0]
    gradientColor.right.saturation = value[1]
    gradientColor.right.lightness = value[2]
    gradientColor.right.alpha = value[3]
  }
}

function beforeBtnMove(e: MouseEvent, type: string) {
  activeGradientPanel.value = type

  const sliderWidth = Number(
    window
      .getComputedStyle((e.target as HTMLDivElement).parentElement!)
      .getPropertyValue('width')
      .slice(0, -2)
  )

  const sliderLeft = (e.target as HTMLDivElement).parentElement!.getBoundingClientRect().left

  function onMouseMove(e: MouseEvent) {
    const moveOffset = e.clientX - sliderLeft

    let offsetPercentage = moveOffset / sliderWidth

    offsetPercentage = offsetPercentage > 1 ? 1 : offsetPercentage < 0 ? 0 : offsetPercentage

    // btnDom.style.left = `calc(${offsetPercentage * 100}%)`
    if (type === 'left') {
      gradientColor.left.position = offsetPercentage * 100
    } else {
      gradientColor.right.position = offsetPercentage * 100
    }
  }

  function onMouseUp() {
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  }

  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
}

watch(activeGradientPanel, newVal => {
  if (newVal === 'left') {
    activeType.value = 2
  } else {
    activeType.value = 3
  }
})
watch(currentItem, newVal => {
  if (newVal === 'left') activeType.value = 1
  else if (activeGradientPanel.value === 'left') {
    activeType.value = 2
  } else {
    activeType.value = 3
  }
})

watch(currentPureColor, newVal => {
  wallpaperDom.style.background = `hsla(${newVal.hue}, ${newVal.saturation}%, ${newVal.lightness}%, ${newVal.alpha})`
})

watch(gradientColor, () => {
  if (gradientType.value === 'linear') {
    wallpaperDom.style.background = `linear-gradient(${gradientDeg.value}deg, hsla(${gradientColor.left.hue}, ${gradientColor.left.saturation}%, ${gradientColor.left.lightness}%, ${gradientColor.left.alpha}) ${gradientColor.left.position}%,hsla(${gradientColor.right.hue}, ${gradientColor.right.saturation}%, ${gradientColor.right.lightness}%, ${gradientColor.right.alpha}) ${gradientColor.right.position}%)`
  } else {
    wallpaperDom.style.background = `${gradientType.value}-gradient(circle at center, hsla(${gradientColor.left.hue}, ${gradientColor.left.saturation}%, ${gradientColor.left.lightness}%, ${gradientColor.left.alpha}) ${gradientColor.left.position}%,hsla(${gradientColor.right.hue}, ${gradientColor.right.saturation}%, ${gradientColor.right.lightness}%, ${gradientColor.right.alpha}) ${gradientColor.right.position}%)`
  }
})

watch(gradientDeg, () => {
  if (gradientType.value === 'linear') {
    wallpaperDom.style.background = `linear-gradient(${gradientDeg.value}deg, hsla(${gradientColor.left.hue}, ${gradientColor.left.saturation}%, ${gradientColor.left.lightness}%, ${gradientColor.left.alpha}) ${gradientColor.left.position}%,hsla(${gradientColor.right.hue}, ${gradientColor.right.saturation}%, ${gradientColor.right.lightness}%, ${gradientColor.right.alpha}) ${gradientColor.right.position}%)`
  } else {
    wallpaperDom.style.background = `${gradientType.value}-gradient(circle at center, hsla(${gradientColor.left.hue}, ${gradientColor.left.saturation}%, ${gradientColor.left.lightness}%, ${gradientColor.left.alpha}) ${gradientColor.left.position}%,hsla(${gradientColor.right.hue}, ${gradientColor.right.saturation}%, ${gradientColor.right.lightness}%, ${gradientColor.right.alpha}) ${gradientColor.right.position}%)`
  }
})

watch(gradientType, newVal => {
  if (newVal === 'linear') {
    wallpaperDom.style.background = `linear-gradient(${gradientDeg.value}deg, hsla(${gradientColor.left.hue}, ${gradientColor.left.saturation}%, ${gradientColor.left.lightness}%, ${gradientColor.left.alpha}) ${gradientColor.left.position}%,hsla(${gradientColor.right.hue}, ${gradientColor.right.saturation}%, ${gradientColor.right.lightness}%, ${gradientColor.right.alpha}) ${gradientColor.right.position}%)`
  } else {
    wallpaperDom.style.background = `${newVal}-gradient(circle at center, hsla(${gradientColor.left.hue}, ${gradientColor.left.saturation}%, ${gradientColor.left.lightness}%, ${gradientColor.left.alpha}) ${gradientColor.left.position}%,hsla(${gradientColor.right.hue}, ${gradientColor.right.saturation}%, ${gradientColor.right.lightness}%, ${gradientColor.right.alpha}) ${gradientColor.right.position}%)`
  }
})

onMounted(() => {
  wallpaperDom = document.querySelector('.bgimg') as HTMLDivElement
  gradientPanel = document.querySelector('.deg-toggle-panel')!
})
</script>

<style scoped lang="scss">
.color-picker {
  box-sizing: border-box;
  width: 100%;
  color: white;
  padding: 10px 5px;
  height: 100%;

  .main-content {
    width: calc(100% - 10px);

    .color-picker-title {
      font-size: 32px;
    }

    .table-choose {
      width: 100%;
      display: flex;
      margin-top: 15px;
      padding: 5px;
      height: 40px;
      color: rgba(255, 255, 255, 0.627);
      background: #02020272;
      border-radius: 10px;
      margin-bottom: 20px;

      .table-item {
        border-radius: 10px;
        width: 50%;
        text-align: center;
        font-size: 20px;
        font-weight: 600;
        line-height: 40px;
        transition: background-color 0.2s linear;
        transition: color 0.2s linear;

        &:hover {
          background-color: #ffffff1b;
        }
      }

      .left {
        margin-right: 5px;
      }

      .right {
        margin-left: 5px;
      }

      .current-item {
        color: white;
        background-color: #ffffff45 !important;
      }
    }

    .radient-color {
      display: flex;
      flex-direction: column;
      margin-bottom: 10px;

      .radient-type-selector {
        width: 100%;
        height: 30px;
        display: flex;
        flex-direction: row-reverse;
        margin-bottom: 10px;

        .radient-selector {
          width: 15%;
          height: 100%;
          border-radius: 5px;
          background-color: #ffffff2c;
          display: flex;

          .active {
            background-color: #ffffff29;
          }

          span {
            display: flex;
            width: 50%;
            justify-content: center;
            align-content: center;
            line-height: 30px;
            transition: background-color 0.15s;

            &:hover {
              background-color: #ffffff31;
              opacity: 0.7;
            }
          }
        }
      }

      .radient-panel {
        width: 100%;
        display: flex;

        .slider-bar {
          width: 80%;
          border-radius: 15px;
          margin: 4px 0;
          border: 4px 0;
          height: 25px;
          margin-right: 30px;

          .slider-back {
            width: 100%;
            height: 25px;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 15px;

            .true-range-slider {
              width: calc(100% - 25px);
              height: 100%;
              background: transparent;
              position: relative;

              .slider-btn {
                box-sizing: border-box;
                position: absolute;
                top: 0;
                height: 25px;
                width: 25px;
                border-radius: 15px;
                background-color: #fff;
                border: 1px solid black;
                transform: translateX(-50%);
              }

              .gradient-btn {
                box-sizing: border-box;
                position: absolute;
                top: -2px;
                height: 30px;
                width: 25px;
                background-color: transparent;
                border: 3px solid white;
                transform: translateX(-50%);
                opacity: 0.7;
              }

              .gradient-active-btn {
                // background: #ffffff8f;
                opacity: 1;
              }
            }
          }
        }

        .deg-input {
          width: 15%;
          border-radius: 5px;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #ffffff42;
          color: #ffffff62;
          position: relative;

          input {
            color: white;
            width: 50%;
            // height: 50px;
            font-size: 18px;
            outline: none;
            border: 0;
            text-align: center;
            font-style: italic;
            letter-spacing: 0.5px;
            // border-radius: 5px;
            // margin-left: 2%;
            background-color: transparent;
          }

          .deg-toggle-panel {
            position: absolute;
            top: 100%;
            height: 100px;
            width: 100px;
            color: #fff;
            background-color: #fff;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10;

            .circle {
              width: 90%;
              height: 90%;
              border-radius: 50%;
              background-color: transparent;
              border: 2px solid red;
              position: relative;

              .line-in-circle {
                position: absolute;
                width: 48%;
                height: 3px;
                background-color: #000;
                top: 50%;
                left: 50%;
                transform-origin: 0px 1.5px;
                transform: translateY(-50%) rotateZ(90deg);
              }
            }
          }
        }
      }
    }
  }
}
</style>
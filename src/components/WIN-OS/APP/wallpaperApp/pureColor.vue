<template>
  <div class="main-picker">
    <div class="pure-color-picker">
      <div class="pure-color-select" v-show="!pureColorHsv">
        <div class="color-row" v-for="row of 5" :key="row">
          <div class="color-item" v-for="column of 8" :key="column" :style="{backgroundColor:  `hsl(${(column * 45 - 45)}, 100%, ${42 +  row * 8}%)`}" @click="changePureColor(column * 45 - 45, 100, 42 + row * 8)">
          </div>
        </div>
        <div class="color-row color-last-line">
          <div class="color-item" v-for="column of 8" :key="column" :style="{background: column !== 8 ? `hsl(1, 0%, ${116.6 - column * 16.6}%)` : 'conic-gradient(red, magenta, blue, aqua, lime, yellow, red)'}" @click="changePureColor(0, 0, 116.6 - column * 16.6, column)">
          </div>
        </div>
      </div>

      <div class="color-subdivision" v-show="pureColorHsv">
        <div class="return-back" @click="pureColorHsv = false">
          <svg width="35px" height="35px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 12H18M6 12L11 7M6 12L11 17" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>

        <div class="color-hsv-box" :style="{backgroundColor: `hsla(${currentPureColor.hue}, 100%, 50%)`}">
          <div class="white-box hsv-box"></div>
          <div class="black-box hsv-box"></div>
          <div class="color-picker-hsv-cursor" @mousedown="beforePickerCursorMove"></div>
        </div>
      </div>

      <div class="slider-bar-lightness slider-bar" v-show="!pureColorHsv">
        <div class="slider-back" :style="{color: 'black' ,background: `linear-gradient(to right, hsl(${currentPureColor.hue}, ${currentPureColor.saturation}%, 100%),hsl(${currentPureColor.hue}, ${currentPureColor.saturation}%, 50%) ,hsl(${currentPureColor.hue}, ${currentPureColor.saturation}%, 0%))`}">
          <div class="true-range-slider">
            <div class="slider-btn" :style="{ left: `${100 - currentPureColor.lightness}%`}" @mousedown="beforeBtnMove('lightness', $event)"></div>
          </div>
        </div>
      </div>

      <div class="slider-bar-hue slider-bar" v-show="pureColorHsv">
        <div class="slider-back" :style="{color: 'black' ,background: `linear-gradient(90deg,red 0,#FFBF00 12.5%,#80FF00 25%,#00FF40 37.5%,#00FFFF 50%,#0040FF 62.5%, #8000FF 75%, #FF00BF 87.5%, #FF0004 100%)`}">
          <div class="true-range-slider">
            <div class="slider-btn" :style="{ left: `${currentPureColor.hue / 3.6}%`}" @mousedown="beforeBtnMove('hue', $event)"></div>
          </div>
        </div>
      </div>

      <div class="slider-bar-alpha slider-bar">
        <div class="slider-back" :style="{color: 'black' ,background: `linear-gradient(to right, hsla(${currentPureColor.hue}, ${currentPureColor.saturation}%, ${currentPureColor.lightness}%, 0),hsla(${currentPureColor.hue}, ${currentPureColor.saturation}%, ${currentPureColor.lightness}%, 0.5) ,hsla(${currentPureColor.hue}, ${currentPureColor.saturation}%, ${currentPureColor.lightness}%, 1))`}">
          <div class="true-range-slider">
            <div class="slider-btn" :style="{ left: `${currentPureColor.alpha * 100}%`}" @mousedown="beforeBtnMove('alpha', $event)"></div>
          </div>
        </div>
      </div>

      <div class="text-color">
        <div class="color-showing" :style="{backgroundColor: hslaText, color: 'white'}">
          <div class="background-img"></div>
        </div>
        <input type="text" class="color-text-show" v-model="rgbText">
        <input class="alpha-text" v-model="alphaValue"></input>
        <div class="alpha-toggle">
          <div class="toggle-top toggle-alpha-arrow" @click="currentPureColor.alpha = currentPureColor.alpha < 1 ? currentPureColor.alpha + 0.01 : currentPureColor.alpha"></div>
          <div class="toggle-bottom toggle-alpha-arrow" @click="currentPureColor.alpha = currentPureColor.alpha > 0 ? currentPureColor.alpha - 0.01 : currentPureColor.alpha"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'

const props = defineProps(['activeType', 'pureColor', 'gradientColor'])
const emits = defineEmits(['pureColorChange'])

let pureColorHsv = ref(true)
let currentPureColor = reactive({
  hue: 100,
  saturation: 100,
  lightness: 50,
  alpha: 1
})
let hsvBtnDom: HTMLDivElement

const activeType = computed(() => {
  return props.activeType
})

function changeColor(object1: any, object2: any) {
  object1.hue = object2.hue
  object1.saturation = object2.saturation
  object1.lightness = object2.lightness
  object1.alpha = object2.alpha
}

watch(activeType, newVal => {
  if (newVal === 1) {
    changeColor(currentPureColor, props.pureColor)
  } else if (newVal === 2) {
    changeColor(currentPureColor, props.gradientColor.left)
  } else if (newVal === 3) {
    changeColor(currentPureColor, props.gradientColor.right)
  }
  hsvCursorChange()
})

const hslaText = computed(() => {
  return `hsla(${currentPureColor.hue}, ${currentPureColor.saturation}%, ${currentPureColor.lightness}%, ${currentPureColor.alpha})`
})

let timer: NodeJS.Timeout
const rgbText = computed({
  get() {
    const rgbNum = hslToRgb(currentPureColor.hue / 360, currentPureColor.saturation / 100, currentPureColor.lightness / 100)
    return colorHex(`rgb(${rgbNum[0]}, ${rgbNum[1]}, ${rgbNum[2]})`)
  },
  set(newVal) {
    clearTimeout(timer)
    timer = setTimeout(() => {
      if (/^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/.test(newVal)) {
        const rgbColor = colorRgb(newVal)
        const hslColor = rgbToHsl(rgbColor[0], rgbColor[1], rgbColor[2])
        currentPureColor.hue = hslColor[0]! * 360
        currentPureColor.saturation = hslColor[1]! * 100
        currentPureColor.lightness = hslColor[2]! * 100
        hsvCursorChange()
      }
    }, 500)
  }
})

const alphaValue = computed({
  get() {
    return Math.floor(currentPureColor.alpha * 100) + '%'
  },
  set(newVal) {
    const alpha = Number(newVal.slice(0, -1))
    currentPureColor.alpha = alpha / 100
  }
})

//十六进制转为rgb
var colorRgb = function (sColor: string) {
  sColor = sColor.toLowerCase()
  //十六进制颜色值的正则表达式
  // 如果是16进制颜色
  // if (sColor && reg.test(sColor)) {
  if (sColor.length === 4) {
    var sColorNew = '#'
    for (var i = 1; i < 4; i += 1) {
      sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1))
    }
    sColor = sColorNew
  }
  //处理六位的颜色值
  var sColorChange = []
  for (var i = 1; i < 7; i += 2) {
    sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2)))
  }
  // return 'RGB(' + sColorChange.join(',') + ')'
  return sColorChange
  // }
  // return sColor
}
// colorRgb("#fff")
// "RGB(255,255,255)"

// rgb转为十六进制
var colorHex = function (color: string) {
  var that = color
  //十六进制颜色值的正则表达式
  var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
  // 如果是rgb颜色表示
  if (/^(rgb|RGB)/.test(that)) {
    var aColor = that.replace(/(?:\(|\)|rgb|RGB)*/g, '').split(',')
    var strHex = '#'
    for (var i = 0; i < aColor.length; i++) {
      var hex = Number(aColor[i]).toString(16)
      if (hex.length < 2) {
        hex = '0' + hex
      }
      strHex += hex
    }
    if (strHex.length !== 7) {
      strHex = that
    }
    return strHex
  } else if (reg.test(that)) {
    var aNum = that.replace(/#/, '').split('')
    if (aNum.length === 6) {
      return that
    } else if (aNum.length === 3) {
      var numHex = '#'
      for (var i = 0; i < aNum.length; i += 1) {
        numHex += aNum[i] + aNum[i]
      }
      return numHex
    }
  }
  return that
}

/**
 * RGB 颜色值转换为 HSL.
 * 转换公式参考自 http://en.wikipedia.org/wiki/HSL_color_space.
 * r, g, 和 b 需要在 [0, 255] 范围内
 * 返回的 h, s, 和 l 在 [0, 1] 之间
 *
 * @param   Number  r       红色色值
 * @param   Number  g       绿色色值
 * @param   Number  b       蓝色色值
 * @return  Array           HSL各值数组
 */
function rgbToHsl(r: number, g: number, b: number) {
  ;(r /= 255), (g /= 255), (b /= 255)
  var max = Math.max(r, g, b),
    min = Math.min(r, g, b)
  var h = 1,
    s,
    l = (max + min) / 2

  if (max == min) {
    h = s = 0 // achromatic
  } else {
    var d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h /= 6
  }

  return [h, s, l]
}

//输入的h范围为[0,360],s,l为百分比形式的数值,范围是[0,100]
//输出r,g,b范围为[0,255],可根据需求做相应调整
function hsvToRgb(h: number, s: number, v: number) {
  var s = s / 100
  var v = v / 100
  var h1 = Math.floor(h / 60) % 6
  var f = h / 60 - h1
  var p = v * (1 - s)
  var q = v * (1 - f * s)
  var t = v * (1 - (1 - f) * s)
  var r = 0,
    g = 0,
    b = 0
  switch (h1) {
    case 0:
      r = v
      g = t
      b = p
      break
    case 1:
      r = q
      g = v
      b = p
      break
    case 2:
      r = p
      g = v
      b = t
      break
    case 3:
      r = p
      g = q
      b = v
      break
    case 4:
      r = t
      g = p
      b = v
      break
    case 5:
      r = v
      g = p
      b = q
      break
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]
}

/**
 * HSL颜色值转换为RGB.
 * 换算公式改编自 http://en.wikipedia.org/wiki/HSL_color_space.
 * h, s, 和 l 设定在 [0, 1] 之间
 * 返回的 r, g, 和 b 在 [0, 255]之间
 *
 * @param   Number  h       色相
 * @param   Number  s       饱和度
 * @param   Number  l       亮度
 * @return  Array           RGB色值数值
 */
function hslToRgb(h: number, s: number, l: number) {
  var r, g, b

  if (s == 0) {
    r = g = b = l // achromatic
  } else {
    var hue2rgb = function hue2rgb(p: number, q: number, t: number) {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }

    var q = l < 0.5 ? l * (1 + s) : l + s - l * s
    var p = 2 * l - q
    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]
}

// r,g,b范围为[0,255],转换成h范围为[0,360]
// s,v为百分比形式，范围是[0,100],可根据需求做相应调整
function rgbToHsv(r: number, g: number, b: number) {
  r = r / 255
  g = g / 255
  b = b / 255
  var h = 0,
    s,
    v
  var min = Math.min(r, g, b)
  var max = (v = Math.max(r, g, b))
  var difference = max - min

  if (max == min) {
    h = 0
  } else {
    switch (max) {
      case r:
        h = (g - b) / difference + (g < b ? 6 : 0)
        break
      case g:
        h = 2.0 + (b - r) / difference
        break
      case b:
        h = 4.0 + (r - g) / difference
        break
    }
    h = Math.round(h * 60)
  }
  if (max == 0) {
    s = 0
  } else {
    s = 1 - min / max
  }
  s = Math.round(s * 100)
  v = Math.round(v * 100)
  return [h, s, v]
}

function hsvCursorChange() {
  const rgbColor = hslToRgb(currentPureColor.hue / 360, currentPureColor.saturation / 100, currentPureColor.lightness / 100)
  const hsvColor = rgbToHsv(rgbColor[0], rgbColor[1], rgbColor[2])
  hsvBtnDom.style.left = hsvColor[1] + '%'
  hsvBtnDom.style.top = 100 - hsvColor[2] + '%'
}

function changePureColor(hue: number, saturation: number, lightness: number, column?: number) {
  if (column === 8) {
    pureColorHsv.value = true
    hsvCursorChange()
  } else {
    currentPureColor.hue = hue
    currentPureColor.saturation = saturation
    currentPureColor.lightness = lightness
  }
}

function beforePickerCursorMove(e: MouseEvent) {
  // 左右移动改变饱和度， 上下移动改变lightness
  const colorPickerPanelLeft = (e.target as HTMLDivElement).parentElement!.getBoundingClientRect().left

  const colorPickerPanelTop = (e.target as HTMLDivElement).parentElement!.getBoundingClientRect().top
  console.log(colorPickerPanelTop)

  const colorPickerPanelWidth = Number(
    window
      .getComputedStyle((e.target as HTMLDivElement).parentElement!)
      .getPropertyValue('width')
      .slice(0, -2)
  )

  function onMouseMove(e: MouseEvent) {
    const moveOffsetX = e.clientX - colorPickerPanelLeft
    const moveOffsetY = e.clientY - colorPickerPanelTop

    let offsetPercentageX = moveOffsetX / colorPickerPanelWidth
    let offsetPercentageY = moveOffsetY / 200

    offsetPercentageX = offsetPercentageX > 1 ? 1 : offsetPercentageX < 0 ? 0 : offsetPercentageX
    offsetPercentageY = offsetPercentageY > 1 ? 1 : offsetPercentageY < 0 ? 0 : offsetPercentageY

    hsvBtnDom.style.left = offsetPercentageX * 100 + '%'
    hsvBtnDom.style.top = offsetPercentageY * 100 + '%'

    const rgbColor = hsvToRgb(currentPureColor.hue, offsetPercentageX * 100, (1 - offsetPercentageY) * 100)

    const hslColor = rgbToHsl(rgbColor[0], rgbColor[1], rgbColor[2])

    currentPureColor.saturation = hslColor[1]! * 100
    currentPureColor.lightness = hslColor[2]! * 100
  }

  function onMouseUp() {
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  }

  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
}

function beforeBtnMove(type: string, e: MouseEvent) {
  const sliderWidth = Number(
    window
      .getComputedStyle((e.target as HTMLDivElement).parentElement!)
      .getPropertyValue('width')
      .slice(0, -2)
  )

  const sliderLeft = (e.target as HTMLDivElement).parentElement!.getBoundingClientRect().left
  const btnDom = e.target as HTMLDivElement

  function onMouseMove(e: MouseEvent) {
    const moveOffset = e.clientX - sliderLeft

    let offsetPercentage = moveOffset / sliderWidth

    offsetPercentage = offsetPercentage > 1 ? 1 : offsetPercentage < 0 ? 0 : offsetPercentage
    console.log(offsetPercentage)

    btnDom.style.left = `calc(${offsetPercentage * 100}%)`
    if (type === 'lightness') {
      currentPureColor.lightness = 100 - offsetPercentage * 100
    } else if (type === 'alpha') {
      currentPureColor.alpha = offsetPercentage
    } else if (type === 'hue') {
      currentPureColor.hue = offsetPercentage * 359
    }
  }

  function onMouseUp() {
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  }

  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
}

onMounted(() => {
  hsvBtnDom = document.querySelector('.color-picker-hsv-cursor')!
})

watch(
  currentPureColor,
  newVal => {
    emits('pureColorChange', newVal.hue, newVal.saturation, newVal.lightness, newVal.alpha)
  },
  { deep: true }
)
</script>

<style lang="scss" scoped>
.main-picker {
  width: 100%;

  .pure-color-picker {
    width: 100%;

    .pure-color-select {
      display: grid;
      grid-template-rows: repeat(6, 1fr);
      .color-row {
        height: 50px;
        width: 100%;
        /* background-color: #fff; */
        display: grid;
        grid-template-columns: repeat(8, 1fr);

        .color-item {
          transition: all 0.2s linear;
          &:hover {
            transform: scale(1.1, 1.1);
            /* border: 3px solid #ffffff74; */
          }
        }
      }
    }

    .color-subdivision {
      .return-back {
        width: 40px;
        height: 40px;
        /* background-color: ; */
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        transition: background-color 0.15s linear;

        &:hover {
          background-color: #ffffff3e;
        }
      }

      .color-hsv-box {
        width: 100%;
        height: 200px;
        position: relative;

        .hsv-box {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
        }

        .white-box {
          background: linear-gradient(90deg, #fff, rgba(255, 255, 255, 0));
        }

        .black-box {
          background: linear-gradient(0deg, #000, transparent);
        }

        .color-picker-hsv-cursor {
          width: 20px;
          height: 20px;
          border: 2px solid white;
          position: absolute;
          border-radius: 50%;
          transform: translate(-50%, -50%);
        }
      }
    }
  }
}

.slider-bar {
  width: 100%;
  border-radius: 15px;
  overflow: hidden;
  margin-top: 15px;
  height: 25px;
  /* background: #fff; */

  .slider-back {
    width: 100%;
    height: 25px;
    display: flex;
    justify-content: center;
    align-items: center;

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
    }
  }
}

.slider-bar-alpha {
  background: url('/slider-bg.png');
}

.text-color {
  width: 100%;
  height: 50px;
  margin-top: 10px;
  /* background-color: #00000038; */
  display: flex;

  .color-showing {
    width: 18%;
    height: 100%;
    margin-right: 2%;
    border-radius: 5px;
    position: relative;

    .background-img {
      width: 100%;
      height: 100%;
      position: absolute;
      z-index: -1;
      background: url(/slider-bg.png);
    }
  }

  .color-text-show {
    color: #3a3a3a;
    width: 60%;
    height: 50px;
    font-size: 20px;
    outline: none;
    border: 0;
    text-align: center;
    font-style: italic;
    letter-spacing: 0.5px;
    border-radius: 5px;
    background-color: rgba(255, 255, 255);
  }

  .alpha-text {
    color: #474747b9;
    width: 15%;
    height: 50px;
    font-size: 20px;
    outline: none;
    border: 0;
    text-align: center;
    font-style: italic;
    letter-spacing: 0.5px;
    border-radius: 5px;
    margin-left: 2%;
    background-color: rgba(255, 255, 255);
  }

  .alpha-toggle {
    width: 3%;
    height: 50px;
    /* background-color: #00000000; */
    position: relative;

    .toggle-alpha-arrow {
      height: 40%;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 5px;
      transition: background-color 0.1s linear;

      &:hover {
        background-color: #ffffff9b;
      }
    }

    .toggle-top {
      margin-bottom: 10px;

      &::before {
        position: absolute;
        border-bottom: 8px solid #888;
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        content: '';
        display: block;
      }
    }

    .toggle-bottom {
      &:hover {
        background-color: #ffffff9b;
      }

      &::before {
        position: absolute;
        border-top: 8px solid #888;
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        content: '';
        display: block;
      }
    }
  }
}
</style>
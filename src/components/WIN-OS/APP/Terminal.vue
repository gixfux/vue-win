<template>
  <div id="terminal">
    <!-- {{ props.windowName }} -->

    <div class="header">
      <svg width="30px" height="30px" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
        <g id="System / Terminal">
          <path id="Vector" d="M17 15H12M7 10L10 12.5L7 15M3 15.8002V8.2002C3 7.08009 3 6.51962 3.21799 6.0918C3.40973 5.71547 3.71547 5.40973 4.0918 5.21799C4.51962 5 5.08009 5 6.2002 5H17.8002C18.9203 5 19.4796 5 19.9074 5.21799C20.2837 5.40973 20.5905 5.71547 20.7822 6.0918C21 6.5192 21 7.07899 21 8.19691V15.8031C21 16.921 21 17.48 20.7822 17.9074C20.5905 18.2837 20.2837 18.5905 19.9074 18.7822C19.48 19 18.921 19 17.8031 19H6.19691C5.07899 19 4.5192 19 4.0918 18.7822C3.71547 18.5905 3.40973 18.2837 3.21799 17.9074C3 17.4796 3 16.9203 3 15.8002Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </g>
      </svg>
      <div class="title">终端</div>
    </div>
    <div class="content">
      <div id="history-info"></div>
      <div id="current-info"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import Terminal from './TerminalApp/index'

const terminal = new Terminal()
onMounted(() => {
  const historyInfoBox = document.getElementById('history-info') as HTMLDivElement
  const currentInfoBox = document.getElementById('current-info') as HTMLDivElement
  const terminalDiv = document.getElementById('terminal') as HTMLDivElement
  terminal.context.terminal = terminalDiv
  terminal.context.currentInfoBox = currentInfoBox
  terminal.context.historyInfoBox = historyInfoBox
  terminal.startCmd()
})

const addLogOneByOne = function (text: string, delay = 20, callback) {
  if (typeof text !== 'string' || text === '') return
}
</script>

<style lang="scss" scoped>
#terminal {
  color: white;
  position: relative;
  width: 100%;
  height: 100%;
  background-color: $appBackColor;
  border-radius: 8px;
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
    height: calc(100% - 30px);
    overflow: scroll;
    scrollbar-width: none;

    #current-info {
      height: 100px;
    }
  }
}
</style>
import appInfo from '@/views/WIN-OS/Utils/assets'
import { defineStore } from 'pinia'

let AppConnection = {
  'Terminal': appInfo.TERMINALINFO,
  'Browser': appInfo.BROWSERINFO,
  'Blob': appInfo.BLOBINFO,
  'Wallpaper': appInfo.WALLPAPERINFO,
  'Chat': appInfo.CHATINFO
}
const windowSize = {
  width: window.innerWidth,
  height: window.innerHeight
}
let apps = ['Terminal', 'Browser', 'Blob', 'Wallpaper', 'Chat']
type AppContexts = 'terminalContext' | 'browserContext' | 'blobContext' | 'wallpaperContext' | 'chatContext';
type AppInfo = 'TERMINALINFO' | 'BROWSERINFO' | 'BLOBINFO' | 'WALLPAPERINFO' | 'CHATINFO';
type AppSizeInfo = 'width' | 'height' | 'bottom' | 'right' | 'left'

export const useAppsStore = defineStore('appsState', {
  state: () => {
    return {
      terminalContext: JSON.parse(JSON.stringify(appInfo.TERMINALINFO)) as TerminalContext,
      browserContext: JSON.parse(JSON.stringify(appInfo.BROWSERINFO)) as BrowserContext,
      blobContext: appInfo.BLOBINFO as BlobContext,
      wallpaperContext: appInfo.WALLPAPERINFO as WallpaperContext,
      chatContext: appInfo.CHATINFO as ChatContext,
      activeApps: ['Browser'] as string[],
      showApps: ['Browser'] as string[],
      // activeApp: 'Terminal'
    }
  },
  getters: {
    activeAppsNum: (state) => state.activeApps.length,
    showAppsNum: (state) => state.showApps.length,
    activeApp: (state) => state.showApps[state.showApps.length - 1]
  },
  actions: {
    resetApp(name: string) {
      const appInitInfo = appInfo[name.toUpperCase() + 'INFO' as AppInfo]
      const { width, height, top, left, right, bottom } = { ...appInitInfo }
      const appSizeInfo = { width, height, top, left, right, bottom }

      for (let key in appSizeInfo) {
        if (this.appContext(name).hasOwnProperty(key)) {
          this.appContext(name)[key as AppSizeInfo] = appSizeInfo[key as AppSizeInfo];
        }
      }
    },
    contactAppName(name: string) {
      return name.toLowerCase() + 'Context' as AppContexts
    },
    appContext(name: string): appContext {
      return this[this.contactAppName(name)]
    },
    initApp() { // 初始化app状态
      this.activeApps.forEach((name) => {

        this.appContext(name).isActive = true
      })

      this.showApps.forEach((name, index) => {

        this.appContext(name).isShow = true
        this.appContext(name).zIndex = index + 1
      })
    },
    appShowing(name: string) {
      return this.appContext(name).isShow
    },
    appShow(name: string) {
      if (this.appContext(name).isShow) {
        const index = this.showApps.findIndex((app) => app === name)
        this.showApps.splice(index, 1)
      } else {
        this.showApps.push(name)
      }
      this.appContext(name).isShow = !this.appContext(name).isShow
    },
    appRunning(name: string): boolean { // 查看某一app是否运行
      return Boolean(this.activeApps.find((app: string) => app === name))
    },
    appRun(name: string) {
      if (this.appContext(name).isActive) {
        const index = this.activeApps.findIndex((app) => app === name)
        this.activeApps.splice(index, 1)
      } else {
        this.activeApps.push(name)
      }
      this.appContext(name).isActive = !this.appContext(name).isActive
    },
    appInTop() {
      let name = ''
      this.showApps.forEach((app) => {
        if (this.appContext(app).zIndex === this.showApps.length) {
          name = app
        }
      })
      return name
    },
    openApp(name: string) {
      name = name.slice(0, 1).toUpperCase() + name.slice(1)
      if (this.appRunning(name)) {
        if (!this.appShowing(name)) {
          this.appShow(name)
        }
        this.toggleWindowIndexToTop(name)
        return
      } else {
        this.resetApp(name)
        this.appRun(name)
        this.appShow(name)
        this.toggleWindowIndexToTop(name)
        return
      }
    },
    closeApp(name: string) {
      name = name.slice(0, 1).toUpperCase() + name.slice(1)
      if (this.appRunning(name)) {
        this.appRun(name)
        this.appShow(name)
        // @ts-ignore
        this[name.toLowerCase() + 'Context'] = JSON.parse(JSON.stringify(AppConnection[name]))
        return true
      } else {
        return false
      }
    },
    minApp(name: string) {
      this.appShow(name)
    },
    footerIconClick(name: string) {
      if (this.appInTop() === name) {
        this.minApp(name)
      } else if (this.appShowing(name)) {
        this.toggleWindowIndexToTop(name)
      } else {
        this.openApp(name)
      }
    },
    toggleWindowIndexToTop(name: string) {
      for (const windowName of this.showApps) {
        if (this[this.contactAppName(windowName)].zIndex > this.appContext(name).zIndex) {
          this[this.contactAppName(windowName)].zIndex--
        }
      }
      // this.activeApp = name
      this.appContext(name).zIndex = this.showAppsNum
      const index = this.showApps.findIndex((name) => name === this.appInTop())
      this.showApps.splice(index, 1)
      this.showApps.push(name)
    },
    moveApp(e: MouseEvent, appName: string) {
      const windowContext = this.appContext(appName)
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
          console.log('moved')

          document.body.style.userSelect = 'auto'
          document.removeEventListener('mousemove', windowMoving)
          document.removeEventListener('mouseup', windowMoved)
        }

        document.addEventListener('mousemove', windowMoving)
        document.addEventListener('mouseup', windowMoved)
      }
      beforeWindowMove(e)
    }
  }
})
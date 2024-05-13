import appInfo from '@/views/WIN-OS/Utils/assets'
import { defineStore } from 'pinia'

type AppContexts = 'terminalContext' | 'browserContext' | 'blobContext' | 'wallpaperContext' | 'chatContext';
type AppInfo = 'TERMINALINFO' | 'BROWSERINFO' | 'BLOBINFO' | 'WALLPAPERINFO' | 'CHATINFO';
type AppSizeInfo = 'width' | 'height' | 'bottom' | 'right' | 'left'

export const useAppsStore = defineStore('appsState', {
  state: () => {
    return {
      terminalContext: appInfo.TERMINALINFO as TerminalContext,
      browserContext: appInfo.BROWSERINFO as BrowserContext,
      blobContext: appInfo.BLOBINFO as BlobContext,
      wallpaperContext: appInfo.WALLPAPERINFO as WallpaperContext,
      chatContext: appInfo.CHATINFO as ChatContext,
      activeApps: ['Chat'] as string[],
      showApps: ['Chat'] as string[],
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
      this.appRun(name)
      this.appShow(name)
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
    }
  }
})
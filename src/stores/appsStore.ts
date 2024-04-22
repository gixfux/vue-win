import { defineStore } from 'pinia'
// import {TerminalContext} from '../types/types'
export const useAppsStore = defineStore('appsState', {
  state: () => ({
    terminalContext: {} as TerminalContext,
    browserContext: {} as BrowserContext,
    blobContext: {} as BlobContext,
    currentApps: [] as string[],
    showAppsNum: 3 as number
  }),
  actions: {
    toggleWindowIndexToTop(currentWindowName: string) {
      for (const windowName of this.currentApps) {
        if (this[windowName.toLowerCase() + 'Context'].zIndex > this[currentWindowName].zIndex) {
          this[windowName.toLowerCase() + 'Context'].zIndex--
        }
      }
      this[currentWindowName].zIndex = this.showAppsNum
    }
  }
})
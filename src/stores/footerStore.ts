import { defineStore } from 'pinia'

export const useFooterStore = defineStore('footerStore', {
  state: () => {
    return {
      calendarState: false as boolean,
      menuState: false as boolean
    }
  },
  actions: {
    changeCalendar() {
      this.calendarState = !this.calendarState
      this.menuState = false
    },
    changeMenu() {
      this.menuState = !this.menuState
      this.calendarState = false
    },
    resetAll() {
      this.menuState = false
      this.calendarState = false
    }
  }
})
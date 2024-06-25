import { defineStore } from 'pinia'
import _ from 'lodash'

interface PAGE {
  title: string
  url: string
  type: string,
  _id: string
}

export const useBrowserStore = defineStore('browserStore', {
  state: () => {
    return {
      pages: [] as PAGE[],
      currentId: _.uniqueId() as string,
      currentPageUrl: '' as string
    }
  },
  getters: {
    currentPageIndex: (state) => {
      const currentPageIndex = state.pages.findIndex((item: { _id: any }) => item._id === state.currentId)
      state.currentPageUrl = state.pages[currentPageIndex].url
      return currentPageIndex
    }
  },
  actions: {
    initPages() {
      this.pages.push({
        title: 'test1',
        url: '',
        _id: this.currentId,
        type: 'index'
      })
      this.pages.push({
        title: 'wiki',
        url: 'https://en.wikipedia.org/wiki/Avocado',
        _id: _.uniqueId(),
        type: 'normal'
      })
      this.pages.push({
        title: 'wiki',
        url: 'https://cn.bing.com/search?q=jhsjdfi',
        _id: _.uniqueId(),
        type: 'normal'
      })
    },

    addPage(title: string, url: string, type = 'normal') {
      if (type === 'current') {
        this.pages[this.currentPageIndex].title = title
        this.pages[this.currentPageIndex].url = url
        this.pages[this.currentPageIndex].type = 'normal'
      } else {
        const id = _.uniqueId()
        this.pages.push({
          title,
          url,
          _id: id,
          type
        })

        this.currentId = id
      }
    },

    closePage(id: string) {
      if (this.pages.length === 1 && this.pages[0].type !== 'index') {
        this.pages.splice(0, 1)
        this.currentId = _.uniqueId()
        this.pages.push({
          title: '首页',
          url: '',
          _id: this.currentId,
          type: 'index'
        })
        return
      }
      const index = this.pages.findIndex((item) => item._id === id)
      console.log(index);
      this.currentId = this.pages[index + 1] ? this.pages[index + 1]._id : this.pages[index - 1]._id
      this.pages.splice(index, 1)
    },
    togglePage(id: string) {
      this.currentId = id;
    },
    getBingSearchUrl(keyWord: string) {
      return `https://cn.bing.com/search?q=${keyWord}`
    }
  }
})
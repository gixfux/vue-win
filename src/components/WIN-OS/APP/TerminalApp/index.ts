import { useAppsStore } from '@/stores/appsStore'
enum APPENUM {
  '001' = 'Browser',
  '002' = 'Terminal',
  '003' = 'Blob',
  '004' = 'Wallpaper',
  '005' = 'Chat'
}

enum APPNAME {
  browser,
  terminal,
  blob,
  wallpaper,
  chat,
  Browser,
  Terminal,
  Blob,
  Wallpaper,
  Chat
}

const ARRNAME = ['Browser', 'Terminal', 'Blob', 'Wallpaper', 'Chat', 'browser', 'terminal', 'blob', 'wallpaper', 'chat']
let tipsTimer: Timeout

function textPrompts(this: TerminalBoxContext, currText: string, promptTextArr: string[], control?: string) {  // 单词智能补全
  const tipWord = promptTextArr.find((item) => {
    return item.startsWith(currText)
  });
  const wordsArr = (this.commendEnterSpan as HTMLSpanElement).innerText.split(' ');
  const tipText = tipWord?.slice(currText.length)

  if (control && tipWord) { // 按下Control并且有tipWord
    (this.commendEnterSpan as HTMLSpanElement).innerText = wordsArr.join(' ') + tipText;
    (this.tipsSpan as HTMLSpanElement).innerText = ''
    return
  }

  if (tipText !== undefined) {
    (this.tipsSpan as HTMLSpanElement).innerText = tipText
  }

}

const commands = [
  {
    name: 'app',
    description: 'app的一系列操作',
    fn: async function (this: Terminal, cmdArr: Array<string>) {  // 命令输入按下回车后执行该函数
      if (!cmdArr[1]) {
        await this.addLogOneByOne('使用app start [应用编号]启动应用 \n使用app close [应用编号]关闭应用')
        await this.addLogOneByOne('001 - Browser \n002 - Terminal \n003 - Blob \n004 - Wallpaper \n005 - chat')
      } else if (cmdArr[1] === 'start') {
        // @ts-ignore
        if (APPENUM[cmdArr[2]]) {  // 输入数字 001 002 003 ...
          // @ts-ignore
          this.appsStore.openApp(APPENUM[cmdArr[2]])
          // @ts-ignore
          this.addSingleLine(`成功打开${APPENUM[cmdArr[2]]}`)
        } else {
          // @ts-ignore
          if (APPNAME[cmdArr[2]] !== undefined) {  // 输入字符 Chat Browser ... 成功打开应用
            this.appsStore.openApp(cmdArr[2])
            this.addSingleLine(`成功打开${cmdArr[2]}`)
          } else {
            this.wrongCommend('指定应用不存在')
          }
        }
        this.appsStore.toggleWindowIndexToTop('Terminal')
        this.context.commendEnterSpan?.focus()
      } else if (cmdArr[1] === 'close') {
        let closeCheck: boolean | number = 0
        // @ts-ignore
        if (APPENUM[cmdArr[2]]) {  // 输入数字001 002 003 ...
          // @ts-ignore
          closeCheck = this.appsStore.closeApp(APPENUM[cmdArr[2]])
        } else {
          // @ts-ignore
          if (APPNAME[cmdArr[2]] !== undefined) {  // 输入字符 Chat Browser ... 成功关闭应用
            closeCheck = this.appsStore.closeApp(cmdArr[2])
          }
        }

        if (closeCheck === true) {
          this.addSingleLine(`成功关闭${cmdArr[2]}`)
        } else if (closeCheck === 0) {
          this.wrongCommend('指定应用不存在')
        } else {
          this.addSingleLine(`应用${cmdArr[2]}并未运行`)
        }
      }

      this.addLineBreak()
      this.startCmd()
    },
    callback: function (this: KeyboardEvent, cmdArr: string[], context: TerminalBoxContext) {  // 每次输入普通字符后执行该函数
      if (cmdArr[2] === '' || cmdArr[2] === undefined) {
        return
      }
      clearTimeout(tipsTimer)
      if (this.key === 'Control') {
        textPrompts.call(context, cmdArr[2], ARRNAME, "Control");
        toggleCursorToBottom.call(context)
      } else {
        tipsTimer = setTimeout(() => {
          textPrompts.call(context, cmdArr[2], ARRNAME)
        }, 400)
      }
    }
  },
  {
    name: 'help',
    description: '显示所有可用命令',
    fn(this: Terminal, cmdArr: Array<string>) {
      console.log(cmdArr);
      if (cmdArr[1]) {
        this.wrongCommend(`"${cmdArr.join(' ')}"命令未知`)
      } else {
        this.addLogOneByOne('  app  -  应用列表以及对应操作 \n  time  - 输出当前时间 \n  help  - 显示所有可执行的命令 \n  clear - 清屏 \n  exit  - 退出终端')
      }

      this.startCmd()
    },
    callback: function (this: KeyboardEvent, cmdArr: string[], context: TerminalBoxContext) {

    }
  },
  {
    name: 'clear',
    description: '清除',
    fn(this: Terminal, cmdArr: Array<string>) {
      this.clear()
      this.startCmd()
    },
    callback() {

    }
  }
]

export default class Terminal {
  public context: TerminalBoxContext = {}
  public appsStore = useAppsStore()
  public commandMemory: string[] = []
  public commandIndex: number = 0
  constructor() {
  }

  startCmd() {
    const p = document.createElement('p')
    const span1 = '<span class="cmd-input-start">[lxb ~]</span>'
    const span2 = document.createElement('span')
    span2.contentEditable = 'true'
    span2.classList.add('cmd-input-span')
    span2.innerText = ''
    this.context.currentInfoBox?.appendChild(p)
    p.classList.add('cmd-input-line')
    p.innerHTML = span1
    p.appendChild(span2)


    const span3 = document.createElement('span')
    span3.classList.add('tips-text')
    p.appendChild(span3)
    this.context.tipsSpan = span3
    this.context.commendEnterSpan = span2

    this.context.currentInfoBox?.appendChild(p)

    setTimeout(() => {
      span2.focus()
    }, 0)

    function cmdInputLineClick() {
      span2.focus()
    }

    const cmdInputEvent = (e: KeyboardEvent) => {
      console.log(e.key);
      if (e.key === 'ArrowUp') {  //  按下上箭头
        e.preventDefault()
        this.commandIndex = this.commandIndex === 0 ? 0 : this.commandIndex - 1;
        (e.target as HTMLSpanElement).innerText = this.commandMemory[this.commandIndex]
        toggleCursorToBottom.call(this.context)
      } else if (e.key === 'ArrowDown') { // 按下下箭头
        e.preventDefault()
        this.commandIndex = this.commandIndex === this.commandMemory.length - 1 ? this.commandIndex : this.commandIndex + 1;
        (e.target as HTMLSpanElement).innerText = this.commandMemory[this.commandIndex]
        toggleCursorToBottom.call(this.context)
      } else if (e.key === 'Enter') {
        e.preventDefault()
        const cmdStr = (e.target as HTMLSpanElement).innerText
        this.context.historyInfoBox?.appendChild(p)
          ; (e.target as HTMLSpanElement).contentEditable = 'false'
        this.context.currentInfoBox!.removeEventListener('click', cmdInputLineClick)
        span2.removeEventListener('keydown', cmdInputEvent)

        this.commendEnter(cmdStr)  // 执行enter逻辑
      } else {  // 输入普通字符的情况 调用对应命令的回调函数
        (this.context.tipsSpan as HTMLSpanElement).innerText = ''
        const cmdArr = (e.target as HTMLSpanElement).innerText.split(' ')
        const command = commands.find((element) => element.name === cmdArr[0])
        if (command) {
          command.callback.call(e, cmdArr, this.context)
        } else {

        }
      }
    }

    this.context.currentInfoBox?.addEventListener('click', cmdInputLineClick)

    span2.addEventListener('keyup', cmdInputEvent)
  }

  commendEnter(str: string) {  // 输入回车
    (this.context.tipsSpan as HTMLSpanElement).innerText = ''
    this.commandMemory.push(str.trim())
    this.commandIndex = this.commandMemory.length
    console.log(this.commandMemory);

    if (typeof str !== 'string' || str === '') {
      this.addLineBreak()
      this.startCmd()
      return
    }

    const cmdStr = str.trim()
    const cmdArr = cmdStr.split(' ')
    const command = commands.find((element) => element.name === cmdArr[0])
    if (!command) {
      this.wrongCommend(`${cmdStr}命令未找到,请输入help查看更多`)
    } else {
      command?.fn.call(this, cmdArr)
    }
  }

  wrongCommend(str: string) {
    const p = document.createElement('p')
    p.classList.add('response-wrong-p')
    p.innerText = str
    this.context.historyInfoBox?.appendChild(p)
  }

  clear() {
    this.context.historyInfoBox!.replaceChildren()
  }

  addSingleLine(text: string) {
    const p = document.createElement('p')
    p.classList.add('response-p')
    this.context.historyInfoBox?.appendChild(p)
    p.innerHTML = text
  }

  // 插入一行换行
  addLineBreak() {
    this.context.historyInfoBox?.insertAdjacentHTML("beforeend", "<br/>");
    this.context.currentInfoBox!.scrollIntoView()
  }

  async addLogOneByOne(text: string, delay = 20, callback?: Function) {
    if (typeof text !== 'string' || text === '') return
    let index = 0
    const p = document.createElement('p')
    p.classList.add('response-p')
    this.context.historyInfoBox?.appendChild(p)
    const characters = Array.from(text)
    for (const character of characters) {
      p.innerText += character
      index++
      this.context.currentInfoBox?.scrollIntoView()
      if (index === characters.length - 1) {
        this.addLineBreak()
      }
      await this.sleep(delay)
    }
    if (callback) callback()
  }

  sleep(delay: number) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(delay)
      }, delay)
    })
  }
}

function toggleCursorToBottom(this: TerminalBoxContext) {
  const range = new Range()
  range.selectNodeContents((this.commendEnterSpan as HTMLSpanElement))
  range.collapse(false)
  let selection = window.getSelection()
  selection?.removeAllRanges()
  selection?.addRange(range)
}
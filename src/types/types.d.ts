declare interface appContext {
  isShow: boolean
  isActive: boolean
  top: number
  left: number
  bottom: number
  right: number
  width: number
  height: number
  windowBox: HTMLElement | null
  windowName: string
  minWidth: number
  minHeight: number
  zIndex: number
  scalable: boolean
  headerSelf?: boolean
}

declare interface TerminalContext extends appContext {
}

declare interface BrowserContext extends appContext {
}

declare interface BlobContext extends appContext {
}

declare interface WallpaperContext extends appContext {
}

declare interface ChatContext extends appContext {
}

declare interface WindowInfo {
  isShow: boolean
  isActive: boolean
  top: number
  left: number
  bottom: number
  right: number
  windowBox: HTMLDivElement | null
  windowName: string
}

declare interface SvgContext {
  logos: {
    [name: string]: string
  }
}

declare interface TerminalBoxContext {
  terminal?: HTMLDivElement
  historyInfoBox?: HTMLDivElement
  currentInfoBox?: HTMLDivElement,
  commendEnterSpan?: HTMLSpanElement,
  tipsSpan?: HTMLSpanElement
}

declare interface AppInfo {
  TERMINALINFO: TerminalContext
  BROWSERINFO: BrowserContext
  BLOBINFO: BlobContext
  WALLPAPERINFO: WallpaperContext
  CHATINFO: ChatContext
}
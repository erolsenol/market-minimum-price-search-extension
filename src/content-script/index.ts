import Helper from '@/utils/helper'
import './index.scss'

const helper = new Helper()
const src = chrome.runtime.getURL('src/content-script/iframe/index.html')

const iframe = new DOMParser().parseFromString(
  `<iframe class="crx-iframe" src="${src}"></iframe>`,
  'text/html'
).body.firstElementChild

if (iframe) {
  // document.body?.append(iframe)
  // const carousel = document.querySelector("div[data-testid='carousel']")
  // if (carousel) {
  //   carousel.append(iframe)
  // }
}

self.onerror = function (message, source, lineno, colno, error) {
  console.info(
    `Error: ${message}\nSource: ${source}\nLine: ${lineno}\nColumn: ${colno}\nError object: ${error}`
  )
}

// helper.initialize()
helper.uiCreate()
console.log('content script loaded')

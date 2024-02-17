import domTools from './dom-tools'

// import tailwindSrc from '@/content-script/tailwind.ts'

export default {
  async initialize() {
    const meta = domTools.createElement('meta')
    meta.setAttribute('http-equiv', 'Content-Security-Policy')

    const res = await fetch('../content-script/tailwind.txt')
    const resText = await res.text()
    console.log('resText', resText)

    // const tailwindScript = domTools.createElement('script')
    // tailwindScript.setAttribute('src', 'https://cdn.tailwindcss.com')
    // document.querySelector('head')?.appendChild(tailwindScript)

    const tailwindJs = domTools.createElement('script')
    tailwindJs.setAttribute('type', 'text/javascript')
    // tailwindJs.setAttribute('src', tailwindSrc)
    tailwindJs.innerText = resText
    document.querySelector('head')?.appendChild(tailwindJs)
  },
  uiCreate() {
    const carousel = document.querySelector("div[data-testid='carousel']")
    if (!carousel) return

    const container = domTools.createElement('div')
    container.innerText = 'Market Minimum Price Search Extension'
    container.classList.add('p-2')
    container.classList.add('text-xl')
    carousel.appendChild(container)

    const containerInput = domTools.createElement('div')
    const inputSearch = domTools.createElement('input')
    inputSearch.setAttribute('type', 'text')
    containerInput.append(inputSearch)
    const buttonStart = domTools.createElement('button')
    buttonStart.innerText = 'Start'
    containerInput.append(buttonStart)
    buttonStart.addEventListener('click', this.startSearch)
    carousel.appendChild(containerInput)
  },
  startSearch() {
    console.log('startSearch')
    const windowHeight = document.querySelector('body')?.offsetHeight || 300
    console.log('windowHeight', windowHeight)
    window.scrollBy(0, windowHeight)
  },
}

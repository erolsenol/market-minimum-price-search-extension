import domTools from './dom-tools'

// import tailwindSrc from '@/content-script/tailwind.ts'

let searchCount = 5

export default class Helper {
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
  }
  uiCreate() {
    const carousel = document.querySelector("div[data-testid='carousel']")
    if (!carousel) return

    const container = domTools.createElement('div')
    container.innerText = 'Market Minimum Price Search Extension'
    container.classList.add('p-2')
    container.classList.add('text-xl')
    carousel.appendChild(container)

    const containerInput = domTools.createElement('div')

    const labelSearch = domTools.createElement('label')
    labelSearch.innerText = 'Search Key'
    containerInput.append(labelSearch)
    const inputSearch = domTools.createElement('input')
    inputSearch.setAttribute('type', 'text')
    containerInput.append(inputSearch)
    containerInput.append(domTools.createElement('br'))

    const labelSearchCount = domTools.createElement('label')
    labelSearchCount.innerText = 'Search Count'
    containerInput.append(labelSearchCount)
    const inputSearchCount = domTools.createElement('input')
    inputSearchCount.setAttribute('type', 'text')
    inputSearchCount.setAttribute('id', 'search-count')
    inputSearchCount.setAttribute('value', '5')
    containerInput.append(inputSearchCount)
    containerInput.append(domTools.createElement('br'))

    const buttonStart = domTools.createElement('button')
    buttonStart.innerText = 'Start'
    containerInput.append(buttonStart)
    buttonStart.addEventListener('click', this.startSearch)
    carousel.appendChild(containerInput)

    const containerResult = domTools.createElement('div')
    containerResult.setAttribute('style', `display:flex; flex-direction: row;`)
    const containerResultMin = domTools.createElement('div')
    const containerResultMax = domTools.createElement('div')
    containerResultMin.setAttribute(
      'style',
      `display:flex; flex-direction: column; width: 50%;`
    )
    containerResultMin.setAttribute('id', 'container-min')
    containerResultMax.setAttribute(
      'style',
      `display:flex; flex-direction: column; width: 50%;`
    )
    containerResultMin.setAttribute('id', 'container-max')
    const titleResultMin = domTools.createElement('h1')
    titleResultMin.setAttribute('style', `font-size:20px`)
    titleResultMin.innerText = 'Min'
    const titleResultMax = domTools.createElement('h1')
    titleResultMax.setAttribute('style', `font-size:20px`)
    titleResultMax.innerText = 'Max'
    containerResultMin.append(titleResultMin)
    containerResultMax.append(titleResultMax)

    containerResult.append(containerResultMin)
    containerResult.append(containerResultMax)

    carousel.appendChild(containerResult)
  }
  startSearch() {
    console.log('startSearch')
    const windowHeight = document.querySelector('body')?.offsetHeight || 300
    console.log('windowHeight', windowHeight)
    // window.scrollBy(0, windowHeight)

    const prdctCntnrWrppr = document.querySelector(
      "div[class='prdct-cntnr-wrppr']"
    )
    console.log('prdctCntnrWrppr', prdctCntnrWrppr)
    console.log(document)
    console.log(window)
    if (!prdctCntnrWrppr) return
    const products = prdctCntnrWrppr.children
    if (products.length < 1) return

    const result = []
    for (let index = 0; index < products.length; index++) {
      const product = products[index]
      const title = product.querySelector(
        "span[class*='prdct-desc-cntnr-name']"
      )?.innerHTML
      const priceStr =
        product
          .querySelector("div[class='prc-box-dscntd']")
          ?.innerHTML.replace('TL', '') || ''
      console.log('this', this)
      const price = this.commaHandler(priceStr)
      const ratingCountStr = product.querySelector(
        "span[class='ratingCount']"
      )?.innerHTML
      let rating = null
      if (ratingCountStr) {
        rating = Number(ratingCountStr.substring(1, ratingCountStr.length - 1))
      }

      const data = {
        index,
        price,
        title,
        rating: 0,
      }
      if (rating) data.rating = rating
      result.push(data)
      result.sort((a, b) => a.price - b.price)
    }
    console.log('result', result)
    console.log('123')
    this.pressTheResult(result)
  }
  pressTheResult(data: object[]) {
    console.log('12312312')
    const containerResultMin = document.querySelector('#container-min')
    const containerResultMax = document.querySelector('#container-max')
    console.log('containerResultMax', containerResultMax)
    const inputSearchCount = document.querySelector('#search-count')
    searchCount = Number(inputSearchCount?.getAttribute('value'))

    const listMin = domTools.createElement('ul')
    for (let index = 0; index < data.length && index < searchCount; index++) {
      const item = data[index]

      const itemMin = domTools.createElement('li')
      itemMin.innerText`Price: ${item.price}  --  Title: ${item.title}`
      listMin.append(itemMin)
    }
    containerResultMin?.append(listMin)
  }
  commaHandler(text: string) {
    const replaced = text.replaceAll('.', '')
    const commaIndex = replaced.indexOf(',')
    if (commaIndex < 0) return Number(replaced)
    return Number(replaced.substring(0, commaIndex))
  }
}

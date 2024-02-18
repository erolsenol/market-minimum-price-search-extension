import domTools from './dom-tools'

// import tailwindSrc from '@/content-script/tailwind.ts'

let searchCount = 5,
  scrollCount = 0,
  resizeObserver: ResizeObserver | null = null,
  _productLengths: number[] = []

export async function initialize() {
  const meta = domTools.createElement('meta')
  meta.setAttribute('http-equiv', 'Content-Security-Policy')

  const res = await fetch('../content-script/tailwind.txt')
  const resText = await res.text()

  // const tailwindScript = domTools.createElement('script')
  // tailwindScript.setAttribute('src', 'https://cdn.tailwindcss.com')
  // document.querySelector('head')?.appendChild(tailwindScript)

  const tailwindJs = domTools.createElement('script')
  tailwindJs.setAttribute('type', 'text/javascript')
  // tailwindJs.setAttribute('src', tailwindSrc)
  tailwindJs.innerText = resText
  document.querySelector('head')?.appendChild(tailwindJs)
}
export function uiCreate() {
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
  inputSearchCount.setAttribute('value', '30')
  containerInput.append(inputSearchCount)
  containerInput.append(domTools.createElement('br'))

  const buttonStart = domTools.createElement('button')
  buttonStart.innerText = 'Start'
  containerInput.append(buttonStart)
  buttonStart.addEventListener('click', pageScroll)
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
  containerResultMax.setAttribute('id', 'container-max')
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

  // const buttonUp = domTools.createElement('button')
  // buttonUp.innerText = 'UP'
  // buttonUp.setAttribute('id', 'button-up')
  // buttonUp.setAttribute(
  //   'style',
  //   `display:flex;position:fixed;right:30px;bottom:30px;width:40px;height:40px;
  //   border-radius:40px;border:2px solid #b0b0b0;align-items:center;justify-content:center;`
  // )
  // buttonUp.addEventListener('click', scrollToTop)
  // document.querySelector('body')?.append(buttonUp)
  // document.querySelector('body')?.setAttribute('style', `max-height: 20000px;`)
}
export async function pageScroll() {
  _productLengths = []
  resizeObserver = new ResizeObserver(async () => {
    const productLength =
      document.querySelector('.prdct-cntnr-wrppr').children.length || 0
    console.log('productLength', productLength)
    console.log('scrollCount', scrollCount)
    _productLengths.push(productLength)
    if (productLength > 100 && scrollCount == 0) {
      startSearch()
      scrollToTop()
      return
    }

    if (scrollCount < 7) {
      await timeout(250)
      scrollDown()
      if (
        _productLengths.length > 2 &&
        _productLengths[_productLengths.length - 1] ===
          _productLengths[_productLengths.length - 2] &&
        _productLengths[_productLengths.length - 1] ===
          _productLengths[_productLengths.length - 3]
      ) {
        setTimeout(() => {
          startSearch()
          scrollToTop()
        }, 250)
        return
      }
    } else if (scrollCount > 7) {
      scrollToTop()
      startSearch()
      scrollCount = 0
      resizeObserver?.disconnect()
      setTimeout(() => {
        scrollToTop()
      }, 150)
      return
    }

    scrollCount++
  })
  resizeObserver.observe(document.body)
  scrollDown()
}
export async function startSearch() {
  // const windowHeight = document.querySelector('body')?.offsetHeight || 300
  const prdctCntnrWrppr = document.querySelector(
    "div[class='prdct-cntnr-wrppr']"
  )

  if (!prdctCntnrWrppr) return
  const products = prdctCntnrWrppr.querySelectorAll(
    "div[class*='p-card-wrppr']"
  )
  if (products.length < 1) return

  const result = []

  for (let index = 0; index < products.length; index++) {
    const product = products[index]

    const rect = product.getBoundingClientRect()
    const rectY = rect.y
    const title = product.querySelector(
      "span[class*='prdct-desc-cntnr-name']"
    )?.innerHTML
    const priceStr =
      product
        .querySelector("div[class='prc-box-dscntd']")
        ?.innerHTML.replace('TL', '') || ''

    const price = commaHandler(priceStr)
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
      rect,
      rectY,
      rating: 0,
    }
    if (rating) data.rating = rating
    if (price < 0.1) {
      console.log('price not found data:', data)
      continue
    }
    result.push(data)
  }
  result.sort((a, b) => a.price - b.price)
  setTimeout(() => {
    pressTheResult(result)
  }, 200)
}
export function pressTheResult(data) {
  const containerResultMin = document.querySelector('#container-min')
  const containerResultMax = document.querySelector('#container-max')
  if (!containerResultMin || !containerResultMax) {
    return
  }

  const inputSearchCount = document.querySelector('#search-count')
  searchCount = Number(inputSearchCount?.getAttribute('value'))

  let listMin = document.querySelector('#list-min')
  if (!listMin) {
    listMin = domTools.createElement('ul')
    listMin.setAttribute('id', 'list-min')
  }
  while (listMin.lastElementChild) {
    listMin.removeChild(listMin.lastElementChild)
  }

  for (let index = 0; index < data.length && index < searchCount; index++) {
    const item = data[index]

    const itemMin = domTools.createElement('li')
    itemMin.innerHTML = `Price: ${item.price}  --  ${item.rating ? `&#9733;${item.rating}` : ''}  --  Title: ${item.title} react.y: ${item.rectY}`

    const bodyHeight = document.querySelector('body')?.offsetHeight
    const prdctCntnrWrpprHeight = document.querySelector(
      'div[class="prdct-cntnr-wrppr"]'
    )?.clientHeight
    const prdctCntnrWrpprReact = document
      .querySelector('div[class="prdct-cntnr-wrppr"]')
      ?.getBoundingClientRect()

    itemMin.addEventListener('click', () => {
      console.log('bodyHeight', bodyHeight)
      console.log('item.rectY', item.rectY)
      console.log('prdctCntnrWrpprHeight', prdctCntnrWrpprHeight)
      console.log('prdctCntnrWrpprReact', prdctCntnrWrpprReact)
      console.log('item.rectY', item.rectY)
      console.log('window.scrollY', window.scrollY)
      // const scrollSize =
      //   item.rectY - bodyHeight + prdctCntnrWrpprHeight - window.scrollY + 350
      const scrollSize = item.rectY - window.scrollY + prdctCntnrWrpprReact?.top + 600

      window.scrollBy(0, scrollSize)
    })
    listMin.append(itemMin)
  }
  containerResultMin?.append(listMin)
}

export function scrollToTop() {
  window.scrollBy(0, -(window.scrollY - 350))
  document.querySelector("i[class*='icon-scroll-to-up-arrow-iconset']")?.click()
}

export async function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(() => resolve(true), ms))
}

export async function scrollDown(delay = 1200, difference = 1000) {
  const bodyHeight = document.querySelector('body')?.offsetHeight || 0
  const footerHeight = document.querySelector('footer')?.offsetHeight || 0
  const currentScrool = document.documentElement.scrollTop

  const scroolSize = bodyHeight - footerHeight - currentScrool - difference
  window.scrollBy(0, scroolSize)
  await timeout(delay)
}

export function commaHandler(text: string) {
  const replaced = text.replaceAll('.', '')
  const commaIndex = replaced.indexOf(',')
  if (commaIndex < 0) return Number(replaced)
  return Number(replaced.substring(0, commaIndex))
}

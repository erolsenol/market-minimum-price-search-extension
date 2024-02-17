<template>
  <div class="bg-slate-100">
    <h1 class="text-red-800 font-bold text-xl">Content Script Iframe</h1>
    <div>
      <input type="text" />
      <button class="btn btn-primary ml-3" @click="search">Start Search</button>
    </div>

  </div>
</template>

<script setup lang="ts">
const items = ref([])

function search() {
  const prdctCntnrWrppr = document.querySelector("div[class='prdct-cntnr-wrppr']")
  console.log("prdctCntnrWrppr", prdctCntnrWrppr);
  console.log(document);
  console.log(window);
  if (!prdctCntnrWrppr) return
  const products = prdctCntnrWrppr.children
  if (products.length < 1) return

  for (let index = 0; index < products.length; index++) {
    const product = products[index];
    const title = product.querySelector("span[class*='prdct-desc-cntnr-name']")
    const price = product.querySelector("div[class='prc-box-dscntd']")
    const ratingCount = product.querySelector("span[class='ratingCount']")
    console.log("title", title);
    console.log("price", price);
  }
  console.log("123");
}
</script>

<style scoped></style>

<template>
  <div class="currency_component" ref="container" v-if="currencies && currencies.length">
    <div class="search">
      <input
        type="text"
        name="search"
        v-model="search"
        placeholder="Search currency here"
      />
    </div>
    <div class="currency_list" ref="list">
      <div
        class="currency_list_item"
        v-for="(currency, index) in searchedCurrencies"
        @click="currencyStore.selectCurrency(currency.code)"
        :key="index"
      >
        <img
          v-if="currency && currency.icon"
          :src="`data:image/svg+xml;base64,${currency.icon}`"
          alt=""
        />
        <span>{{ currency.ticker }}</span>
        <Close
          v-if="
            currencyStore.selectedCurrency &&
            currencyStore.selectedCurrency === currency.code
          "
          @click.stop="selectCurrency"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref, nextTick, onUnmounted, computed, watch } from "vue";
import { useCurrencyStore } from "@/stores/currency";
import { useMarketDataStore } from "@/stores/marketData";
import Close from "@/components/close.vue";
const currencyStore = useCurrencyStore();
const currencies = computed(() => currencyStore.currencies);
const searchedCurrencies = computed(() => {
  const term = search.value?.toLowerCase().trim();
  if (term) {
    return currencyStore.currencies.filter((x) => x.code?.toLowerCase().includes(term));
  }
  return currencyStore.currencies;
});
const container = ref<HTMLElement | null>(null);
const list = ref<HTMLElement | null>(null);
const search = ref("");
const marketDataStore = useMarketDataStore();
async function selectCurrency() {
  search.value = "";
  currencyStore.selectCurrency("");
  marketDataStore.selectSortColumn("", false);
  await marketDataStore.getMarketDataByClick();
}
onMounted(async () => {
  await currencyStore.getCurrencies();
});
onUnmounted(() => {
  const style = document.getElementById("marqueeAnimation");
  if (style) {
    document.head.removeChild(style);
  }
});
</script>
<style lang="scss" scoped>
.currency_component {
  color: #fff;
  padding: 15px 20px;
  overflow: hidden;
  .search {
    padding: 15px;
    input {
      padding: 8px 15px;
    }
  }
  .currency_list {
    display: flex;
    flex-flow: row wrap;
    gap: 10px;
    .currency_list_item {
      flex: 1;
      min-width: 100px;
      display: flex;
      flex-flow: row;
      gap: 10px;
      align-items: center;
      justify-content: center;
      user-select: none;
      border-radius: 15px;
      position: relative;
      cursor: pointer;
      img {
        max-width: 30px;
        max-height: 30px;
      }
      span {
        text-transform: uppercase;
      }
    }
  }
}
</style>

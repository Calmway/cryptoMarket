<template>
  <div class="market_data_component">
    <div class="header">
      <h1 class="title">Рыночные данные</h1>
      <div class="controls">
        <button class="refresh-btn" @click="refreshData">
          <span v-if="!marketDataStore.loading">Обновить</span>
          <loader v-else />
        </button>
      </div>
    </div>

    <div v-if="loading" class="loading">
      <loader />
      Загрузка данных...
    </div>

    <div v-else-if="error" class="error">
      <i class="fas fa-exclamation-circle"></i> {{ error }}
    </div>

    <div v-else>
      <div class="currency-table-container">
        <table class="currency-table">
          <thead>
            <tr>
              <th>Пара</th>
              <th>
                Price
                <sortArrows @click="marketDataStore.selectSortColumn('price', false)" />
              </th>
              <th>
                Bid / Offer
                <sortArrows @click="marketDataStore.selectSortColumn('offer', false)" />
              </th>
              <th>
                Change
                <sortArrows @click="marketDataStore.selectSortColumn('change', false)" />
              </th>
              <th>
                Volume
                <sortArrows @click="marketDataStore.selectSortColumn('volume', false)" />
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(c, i) in filteredMarketData" :key="i">
              <MarketDataRow :dataRow="c" />
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref, nextTick, onUnmounted, computed, watch } from "vue";
import { useMarketDataStore } from "@/stores/marketData";
import Chart from "chart.js/auto";
import MarketDataRow from "./MarketDataRow.vue";
import swal from "sweetalert2";
import { useCurrencyStore } from "@/stores/currency";
import sortArrows from "@/components/sortArrows.vue";
import loader from "@/components/loading.vue";

const currencyStore = useCurrencyStore();
const loading = computed(() => marketDataStore.loading);
const error = ref(null);
const marketDataStore = useMarketDataStore();
const marketData = computed(() => marketDataStore.market);
const filteredMarketData = computed(() => {
  if (currencyStore.selectedCurrency) {
    return marketDataStore.market.filter(
      (x) =>
        x.pair &&
        x.pair.primary.toLocaleLowerCase() ===
          currencyStore.selectedCurrency.toLocaleLowerCase()
    );
  } else {
    return marketDataStore.market;
  }
});
let intervalId: ReturnType<typeof setInterval> | null = null;
const sortBy = ref("");
const sortAsc = ref(false);
async function refreshData() {
  marketDataStore.selectSortColumn("", false);
  await marketDataStore.getMarketDataByClick();
}
onMounted(async () => {
  marketDataStore.startLoading();
  await marketDataStore.getMarketData();
  intervalId = setInterval(async () => {
    await marketDataStore.getMarketData();
  }, 5000);
});

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});
</script>
<style lang="scss" scoped>
.market_data_component {
  color: #fff;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  h1 {
    margin: 0;
  }
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.title {
  font-size: 24px;
  font-weight: 600;
  color: #e0e0e0;
}

.controls {
  display: flex;
  gap: 12px;
}

.refresh-btn {
  background: rgba(41, 182, 246, 0.2);
  color: #29b6f6;
  border: 1px solid rgba(41, 182, 246, 0.3);
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.refresh-btn:hover {
  background: rgba(41, 182, 246, 0.3);
}

.currency-table-container {
  overflow-x: auto;
  border-radius: 12px;
  margin-bottom: 24px;
}

.currency-table {
  width: 100%;
  border-collapse: collapse;
  background: rgba(30, 30, 40, 0.5);
  border-radius: 12px;
  thead {
    display: block;
    width: 100%;
    tr {
      display: flex;
      width: 100%;
    }
  }
  tbody {
    display: block;
    width: 100%;
    overflow-y: auto;
    tr {
      display: flex;
      width: 100%;
    }
  }
}
.currency-table th {
  display: flex;
  flex: 1;
  background: rgba(41, 50, 65, 0.8);
  padding: 16px;
  text-align: left;
  font-weight: 500;
  color: #a0a0b0;
  text-transform: uppercase;
  font-size: 12px;
  letter-spacing: 1px;
}

.chart-container {
  background: rgba(30, 30, 40, 0.5);
  border-radius: 12px;
  padding: 20px;
  margin-top: 24px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.chart-title {
  font-size: 18px;
  font-weight: 600;
}

.chart-timeframes {
  display: flex;
  gap: 8px;
}

.timeframe-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #a0a0b0;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.timeframe-btn.active {
  background: rgba(41, 182, 246, 0.3);
  color: #29b6f6;
}

.chart-wrapper {
  position: relative;
  height: 300px;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #a0a0b0;
}

.error {
  text-align: center;
  padding: 40px;
  color: #f44336;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .currency-table th,
  .currency-table td {
    padding: 12px 8px;
  }

  .pair-cell {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
}
</style>

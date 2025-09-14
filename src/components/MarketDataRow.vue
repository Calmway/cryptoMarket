<template v-if="dataRow">
  <td v-if="dataRow.pair">
    <div class="pair-cell">
      <div class="pair-icon">
        <img
          v-if="dataRow.pair && dataRow.pair.primary"
          :src="`data:image/svg+xml;base64,${getIcon(dataRow.pair.primary)}`"
          alt=""
        />
      </div>
      <span>{{ dataRow.pair.primary }}/{{ dataRow.pair.secondary }}</span>
    </div>
  </td>
  <td v-if="dataRow.price" class="price-cell">
    {{ formatNumber(dataRow.price.last) }} $
  </td>
  <td>
    <div class="bid-offer-cell">
      <span class="bid">{{ formatNumber(dataRow.price.bestBid) }}</span>
      <span>/</span>
      <span class="offer">{{ formatNumber(dataRow.price.bestOffer) }}</span>
    </div>
  </td>
  <td
    v-if="dataRow.price && dataRow.price.change && dataRow.price.change.direction"
    :class="['change-cell', dataRow.price.change.direction.toLowerCase()]"
  >
    <Arrow :positive="dataRow.price.change.direction === 'Up'" />
    <span
      >{{ dataRow.price.change.percent }}% ({{
        formatNumber(dataRow.price.change.amount)
      }})</span
    >
  </td>
  <td v-if="dataRow.volume" class="volume-cell">
    {{ formatNumber(dataRow.volume.primary) }} /
    {{ formatNumber(dataRow.volume.secondary) }}
  </td>
</template>
<script lang="ts" setup>
import { MarketDataData } from "@/types/MarketDataTypes";
import Arrow from "@/components/arrow.vue";
import { useCurrencyStore } from "@/stores/currency";
interface IComponentProps {
  dataRow: MarketDataData;
}
const props = withDefaults(defineProps<IComponentProps>(), {
  dataRow: () => new MarketDataData(),
});
const currencyStore = useCurrencyStore();
function formatNumber(val: string | number): string {
  return Number(val).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
function getIcon(currencyName: string) {
  if (!currencyName) {
    return;
  }
  const found = currencyStore.currencies.find(
    (x) => x.code.toLocaleLowerCase() === currencyName.toLocaleLowerCase()
  );
  if (found && found.icon) {
    return found.icon;
  }
}
</script>
<style lang="scss" scoped>
.pair-cell {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  span {
    text-transform: uppercase;
  }
}

.pair-icon {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(41, 182, 246, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    width: 100%;
  }
}

.bid-offer-cell {
  display: flex;
  gap: 8px;
}

.bid {
  color: #4caf50;
  font-weight: 600;
}
.up {
  color: #4caf50;
}

.down {
  color: #f44336;
}

.volume-cell {
  color: #a0a0b0;
}

.change-cell {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
}

.offer {
  color: #f44336;
  font-weight: 600;
}
</style>

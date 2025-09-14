import { defineStore } from "pinia";
import swal from "sweetalert2";
import { api } from "@/api/api";
import type { MarketDataData } from "@/types/MarketDataTypes";

function safeNumber(v: string | null | undefined) {
  if (!v) {
    return null;
  }
  const cleaned = v.replace(/[^\d.\-]/g, "");
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : null;
}
export const useMarketDataStore = defineStore("marketData", {
  state: () => ({
    market: [] as MarketDataData[],
    loading: false,
    sortParam: "",
    sortDesc: true
  }),
  getters: {},
  actions: {
    selectSortColumn(
      columnName: string,
      byApi: boolean = true,
      array: MarketDataData[] = this.market,
    ) {
      if (!byApi) {
        if (this.sortParam === columnName) {
          this.sortDesc = !this.sortDesc;
        } else {
          this.sortParam = columnName;
          this.sortDesc = true;
        }
      } else {
        this.sortParam = columnName;
      }

      array.sort((a, b) => {
        let aVal: number | null = null;
        let bVal: number | null = null;

        switch (this.sortParam) {
          case "price":
            aVal = safeNumber(a.price?.last ?? a.price?.bestBid ?? a.price?.bestOffer);
            bVal = safeNumber(b.price?.last ?? b.price?.bestBid ?? b.price?.bestOffer);
            break;

          case "offer":
            aVal = safeNumber(a.price?.bestOffer ?? a.price?.last);
            bVal = safeNumber(b.price?.bestOffer ?? b.price?.last);
            break;

          case "change":
            aVal = safeNumber(a.change?.percent ?? a.price?.change?.percent ?? a.change?.amount);
            bVal = safeNumber(b.change?.percent ?? b.price?.change?.percent ?? b.change?.amount);
            break;

          case "volume":
            aVal = safeNumber(a.volume?.primary ?? a.volume?.secondary);
            bVal = safeNumber(b.volume?.primary ?? b.volume?.secondary);
            break;
        }

        if (aVal === null && bVal === null) return 0;
        if (aVal === null) return 1;
        if (bVal === null) return -1;

        return this.sortDesc ? bVal - aVal : aVal - bVal;
      });
    },
    startLoading() {
      this.loading = true;
    },
    async getMarketDataByClick() {
      this.loading = true;
      await this.getMarketData();
    },
    async getMarketData() {
      const response = await api.getMarkeData();
      if (response.error || response.errorMessage) {
        this.loading = false;
        swal.close();
        swal.fire(response.error.message ?? response.errorMessage, "", "error");
        return;
      }
      if (response.data) {
        this.loading = false;
        this.selectSortColumn(this.sortParam, true, response.data);
        this.market = response.data;
        swal.close();
      }
    },
  },
});

import { defineStore } from "pinia";
import type { Currency } from "@/types/CurrencyTypes";
import swal from "sweetalert2";
import { api } from "@/api/api";

export const useCurrencyStore = defineStore("currency", {
  state: () => ({
    currencies: [] as Currency[],
    selectedCurrency: ""
  }),
  getters: {},
  actions: {
    selectCurrency(name: string) {
      this.selectedCurrency = name;
    },
    async getCurrencies() {
      swal.showLoading();
      const response = await api.getCurrencyConfiguration();
      if (response.error || response.errorMessage) {
        swal.close();
        swal.fire(response.error.message ?? response.errorMessage, "", "error");
        return;
      }
      if (response.data) {
        this.currencies = response.data.sort((a: Currency, b: Currency) =>
          a.code.localeCompare(b.code)
        );
        swal.close();
      }
    },
  },
});

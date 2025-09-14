import type { Currency } from "@/types/CurrencyTypes";
import { ApiResult, BaseApi } from "./baseApi";
import type { MarketDataData } from "@/types/MarketDataTypes";

class Api extends BaseApi {
  public async getCurrencyConfiguration(): Promise<ApiResult<Currency[]>> {
    return this.get<any>("currency");
  }
  public async getMarkeData(): Promise<ApiResult<MarketDataData[]>> {
    return this.get<any>("market");
  }
}

export const api = new Api();

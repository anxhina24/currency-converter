import { CurrencyConversionParams } from "@/utils/type";
import api from "@/utils/baseUrl";
import { AxiosResponse } from "axios";

interface CurrencyListResponse {
  [currencyCode: string]: string;
}

interface CurrencyConversionResponse {
  date: string;
  [key: string]: string | number;
}

export const getCurrencyList = (): Promise<
  AxiosResponse<CurrencyListResponse>
> => {
  return api.get(`currencies.json`);
};

export const convertCurrency = (
  params: CurrencyConversionParams
): Promise<AxiosResponse<CurrencyConversionResponse>> => {
  return api.get(`currencies/${params.from}/${params.to}.json`);
};

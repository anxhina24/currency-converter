import { createStore, Commit, ActionTree } from "vuex";
import { getCurrencyList, convertCurrency } from "@/service/currency-converter";
import { CurrencyConversionParams } from "@/utils/type";

interface RootState {
  currencyList: CurrencyItem[];
  currencyValue: number;
}

interface CurrencyItem {
  code: string;
  name: string;
}

interface StoreActions extends ActionTree<RootState, RootState> {
  fetchCurrencyListAction({ commit }: { commit: Commit }): Promise<void>;
  currencyValueAction(
    { commit }: { commit: Commit },
    params: CurrencyConversionParams
  ): Promise<void>;
}

export default createStore<RootState>({
  state: {
    currencyList: [],
    currencyValue: 1,
  },
  getters: {
    currencyList: (state) => state.currencyList,
    currencyValue: (state) => state.currencyValue,
  },
  mutations: {
    setCurrencyList(state, currencyList: CurrencyItem[]) {
      state.currencyList = currencyList;
    },
    setCurrencyValue(state, currencyValue: number) {
      state.currencyValue = currencyValue;
    },
  },
  actions: {
    async fetchCurrencyListAction({ commit }) {
      try {
        const response = await getCurrencyList();
        const currencyListUpdated: CurrencyItem[] = Object.entries(
          response.data
        ).map(([code, name]) => ({
          code,
          name,
        }));
        commit("setCurrencyList", currencyListUpdated);
      } catch (error) {
        console.error("Failed to fetch currency list", error);
      }
    },

    async currencyValueAction({ commit }, params: CurrencyConversionParams) {
      try {
        const response = await convertCurrency(params);
        const value: string | number = response.data[params.to] || "";
        commit("setCurrencyValue", value);
      } catch (error) {
        console.log("Failed to convert value");
      }
    },
  } as StoreActions,
  modules: {},
});

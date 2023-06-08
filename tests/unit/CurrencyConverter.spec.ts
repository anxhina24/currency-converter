import { mount, VueWrapper } from "@vue/test-utils";
import CurrencyConverterView from "../../src/components/currency-converter/CurrencyConverterView.vue";
import { createStore, StoreOptions } from "vuex";

interface RootState {
  currencyList: CurrencyItem[];
  currencyValue: number;
}

interface CurrencyItem {
  code: string;
  name: string;
}

// Mock Vuex store
const storeOptions: StoreOptions<RootState> = {
  state: {
    currencyList: [
      { code: "usd", name: "US Dollar" },
      { code: "eur", name: "Euro" },
    ],
    currencyValue: 1,
  },
  getters: {
    currencyList: (state) => state.currencyList,
    currencyValue: (state) => state.currencyValue,
  },
  actions: {
    fetchCurrencyListAction: jest.fn(),
    currencyValueAction: jest.fn(),
  },
};

const store = createStore<RootState>(storeOptions);

describe("CurrencyConverterView", () => {
  let wrapper: VueWrapper<any>;

  beforeEach(() => {
    wrapper = mount(CurrencyConverterView, {
      global: {
        plugins: [store],
      },
      props: {
        header: "Currency Converter",
      },
    });
  });

  afterEach(() => {
    wrapper.unmount();
  });

  test("Render Page", () => {
    expect(wrapper.find("h1").text()).toBe("Currency Converter");
    expect(wrapper.find("v-text-field[label='Amount']").exists()).toBe(true);
    expect(wrapper.find("v-autocomplete[label='From']").exists()).toBe(true);
    expect(wrapper.find("v-icon").exists()).toBe(true);
    expect(wrapper.find("v-autocomplete[label='To']").exists()).toBe(true);
    expect(wrapper.find("v-btn").exists()).toBe(true);
  });

  test("initializes with default values", () => {
    const vm = wrapper.vm;
    expect(vm.selectedFrom).toBe("eur");
    expect(vm.selectedTo).toBe("usd");
    expect(vm.amount).toBe(1);
  });

  test("calls fetchCurrencyListAction on component created", () => {
    expect(storeOptions.actions?.fetchCurrencyListAction).toHaveBeenCalled();
  });

  test("calls currencyValueAction when converting value", async () => {
    const vm = wrapper.vm;
    vm.selectedFrom = "usd";
    vm.selectedTo = "eur";
    vm.amount = 10;
    await wrapper.find("v-btn").trigger("click");
    expect(storeOptions.actions?.currencyValueAction).toHaveBeenCalledWith(
      expect.any(Object),
      { from: "usd", to: "eur" }
    );
  });

  test("switches currencies when switchCurrencies method is called", async () => {
    const vm = wrapper.vm;
    vm.selectedFrom = "usd";
    vm.selectedTo = "eur";
    await vm.switchCurrencies();

    expect(vm.selectedFrom).toBe("eur");
    expect(vm.selectedTo).toBe("usd");
  });

  test("calls convertValue when selectedFrom or selectedTo change", async () => {
    const vm = wrapper.vm;
    const convertValueSpy = jest.spyOn(vm, "convertValue");
    convertValueSpy.mockReset();
    vm.selectedTo = "usd";
    await wrapper.vm.onSelectedCurrencyChange();
    expect(convertValueSpy).toHaveBeenCalledTimes(1);
    convertValueSpy.mockReset();
    vm.selectedTo = "eur";
    await wrapper.vm.onSelectedCurrencyChange();
    expect(convertValueSpy).toHaveBeenCalledTimes(2);
  });
});

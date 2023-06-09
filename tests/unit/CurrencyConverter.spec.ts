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
    expect(
      wrapper
        .find(
          "v-text-field[label='Amount']" &&
            "v-autocomplete[label='From']" &&
            "v-icon" &&
            "v-autocomplete[label='To']"
        )
        .exists()
    ).toBe(true);
  });

  test("initializes with default values", () => {
    const vm = wrapper.vm;
    expect(vm.selectedFrom && vm.selectedTo && vm.amount).toBe(
      "eur" && "usd" && 1
    );
  });

  test("calls fetchCurrencyListAction on component created", () => {
    expect(
      storeOptions.actions?.fetchCurrencyListAction &&
        storeOptions.actions?.currencyValueAction
    ).toHaveBeenCalled();
  });

  test("calls currencyValueAction when converting value", async () => {
    const vm = wrapper.vm;
    vm.selectedFrom = "usd";
    vm.selectedTo = "eur";
    vm.amount = 10;
    vm.convertValue();
    await wrapper.vm.$nextTick();
    expect(storeOptions.actions?.currencyValueAction).toHaveBeenCalledWith(
      expect.any(Object),
      { from: "usd", to: "eur" }
    );
    // check if the converted value is displayed on the page
    const resultText = `${vm.amount} ${vm.selectedFrom.toUpperCase()}=${
      vm.amount * vm.currencyValue
    } ${vm.selectedTo.toUpperCase()}`;
    expect(wrapper.text()).toContain(resultText);
  });

  test("switches currencies when switchCurrencies method is called", async () => {
    const vm = wrapper.vm;
    vm.selectedFrom = "usd";
    vm.selectedTo = "eur";
    await vm.switchCurrencies();
    await wrapper.vm.$nextTick();
    expect(vm.selectedFrom && vm.selectedTo).toBe("eur" && "usd");
  });

  test("calls convertValue when selectedFrom or selectedTo change", async () => {
    const vm = wrapper.vm;
    const convertValueSpy = jest.spyOn(vm, "convertValue");
    vm.selectedTo = "usd";
    await vm.onSelectedCurrencyChange();
    expect(convertValueSpy).toHaveBeenCalled();
  });
});

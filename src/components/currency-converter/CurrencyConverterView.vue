<template>
  <v-container>
    <v-row align="center" justify="center">
      <v-col cols="12" md="8" lg="12">
        <v-card class="currency-converter-card" elevation="10">
          <v-card-title class="mb-12 mt-6">
            <h1 class="header">{{ header }}</h1>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" sm="3">
                <v-text-field
                  label="Amount"
                  dense
                  outlined
                  v-model="amount"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="4">
                <v-autocomplete
                  label="From"
                  v-model="selectedFrom"
                  dense
                  outlined
                  :items="currencyList"
                  item-key="code"
                  item-value="code"
                  :item-title="
                    (item) =>
                      `${item?.code?.toUpperCase() || ''} - ${item.name}`
                  "
                  @change="convertValue"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" sm="1" class="switch-arrow">
                <v-icon color="black" @click="switchCurrencies"
                  >mdi-48px mdi-swap-horizontal</v-icon
                >
              </v-col>
              <v-col cols="12" sm="4">
                <v-autocomplete
                  label="To"
                  v-model="selectedTo"
                  dense
                  outlined
                  :items="currencyList"
                  item-key="code"
                  item-value="code"
                  :item-title="
                    (item) =>
                      `${item?.code?.toUpperCase() || ''} - ${item.name}`
                  "
                  @change="convertValue"
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row class="result-row">
              <v-col cols="12" sm="6">
                {{ amount }} {{ selectedFrom?.toUpperCase() }}={{
                  amount * currencyValue
                }}
                {{ selectedTo?.toUpperCase() }}
              </v-col>
            </v-row>
            <v-row class="rate-row">
              <v-col cols="12" sm="6">
                1 {{ selectedFrom?.toUpperCase() }} = {{ currencyValue }}
                {{ selectedTo?.toUpperCase() }}
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Vue, Options } from "vue-class-component";
import { Prop, Watch } from "vue-property-decorator";
import { mapGetters, mapActions } from "vuex";
import { CurrencyConversionParams } from "@/utils/type";
import store from "@/store/currency-converter";

@Options({
  computed: {
    ...mapGetters(["currencyList", "currencyValue"]),
  },
  methods: {
    ...mapActions(["fetchCurrencyListAction", "currencyValueAction"]),
  },
  store,
})
export default class CurrencyConverterView extends Vue {
  @Prop() header!: string;

  selectedFrom = "eur";
  selectedTo = "usd";
  amount = 1;

  fetchCurrencyListAction!: () => void;
  currencyValueAction!: (params: CurrencyConversionParams) => void;

  created() {
    this.loadCurrencyList();
    this.convertValue();
  }

  async loadCurrencyList() {
    try {
      await this.fetchCurrencyListAction();
    } catch (error) {
      console.log("Failed to fetch currency list", error);
    }
  }

  async loadCurrencyValueAction(params: CurrencyConversionParams) {
    try {
      await this.currencyValueAction(params);
    } catch (error) {
      console.log("Failed to convert value");
    }
  }

  convertValue(): void {
    const data: CurrencyConversionParams = {
      from: this.selectedFrom,
      to: this.selectedTo,
    };
    this.loadCurrencyValueAction(data);
  }

  switchCurrencies(): void {
    const temp = this.selectedFrom;
    this.selectedFrom = this.selectedTo;
    this.selectedTo = temp;
  }

  @Watch("selectedFrom")
  @Watch("selectedTo")
  onSelectedCurrencyChange() {
    this.convertValue();
  }
}
</script>

<style scoped>
.currency-converter-card {
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  height: 500px;
}

.header {
  font-size: 32px;
  margin: 0;
  color: #333333;
}

.result-row {
  font-size: 30px;
  margin-top: 16px;
  color: #333333;
}

.rate-row {
  font-size: 20px;
  margin-top: 20px;
  color: #777777;
}

.switch-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

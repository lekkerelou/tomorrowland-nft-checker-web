<template>
  <div
    class="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white shadow-lg rounded-sm border border-slate-200"
  >
    <header class="px-5 py-4 border-b border-slate-100">
      <h2 class="font-semibold text-slate-800">Holding statistics</h2>
    </header>
    <!-- Chart built with Chart.js 3 -->
    <!-- Change the height attribute to adjust the chart height -->
    <DoughnutChart :data="chartData" width="389" height="260" />
  </div>
</template>

<script>
import { ref } from "vue";
import DoughnutChart from "../../charts/DoughnutChart.vue";

// Import utilities
import { tailwindConfig } from "../../utils/Utils";
import holders from "/result/holder/holders.json";

export default {
  name: "DashboardCard06",
  components: {
    DoughnutChart,
  },
  setup() {
    const chartData = ref({
      labels: [...holders.collections.at(-1).stats.map(value => `${value.name} (${value.value - 1})`).reverse(),
        `Exchanged Medallion (${holders.collections.at(-1).burned_medallion})`,
        `Medallion Redeemable (${holders.collections.at(-1).reedemable_medallion})`],
      datasets: [
        {
          label: "Holding",
          data: [...holders.collections.at(-1).stats.map(value => value.value - 1).reverse(),
            holders.collections.at(-1).burned_medallion,
            holders.collections.at(-1).reedemable_medallion
          ],
          backgroundColor: [
            tailwindConfig().theme.colors.indigo[600],
            tailwindConfig().theme.colors.indigo[400],
            tailwindConfig().theme.colors.indigo[200],
            tailwindConfig().theme.colors.rose[600],
            tailwindConfig().theme.colors.green[600],
          ],
          hoverBackgroundColor: [
            tailwindConfig().theme.colors.indigo[800],
            tailwindConfig().theme.colors.indigo[500],
            tailwindConfig().theme.colors.indigo[300],
            tailwindConfig().theme.colors.rose[700],
            tailwindConfig().theme.colors.green[700],
          ],
          hoverBorderColor: tailwindConfig().theme.colors.white,
        },
      ],
    });

    return {
      chartData,
    };
  },
};
</script>

<template>
  <div
    class="flex flex-col col-span-full xl:col-span-8 bg-white shadow-lg rounded-sm border border-slate-200"
  >
    <header class="px-5 py-4 border-b border-slate-100 flex items-center">
      <h2 class="font-semibold text-slate-800">Medallion of Memoria statistics</h2>
    </header>
    <!-- Chart built with Chart.js 3 -->
    <!-- Change the height attribute to adjust the chart height -->
    <LineChart :data="chartData" width="800" height="300" />
  </div>
</template>

<script>
import { ref } from "vue";
import LineChart from "../../charts/LineChart05.vue";
import moment from "moment";

// Import utilities
import { tailwindConfig, hexToRGB } from "../../utils/Utils";
import holders from "/result/holder/holders.json";

export default {
  name: "FintechCard01",
  components: {
    LineChart,
  },
  setup() {
    const chartData = ref({
      datasets: [
        // Indigo line
        {
          label: "Total Medallion",
          data: holders.collections.map((value) => {
            let date = new Date(value.date);
    	      const timestamp = moment(date).format("YYYY/MM/DD HH:mm:ss");
            return {
              x: `${timestamp}`,
              y: value.total - (value.burned_medallion?value.burned_medallion : 0),
            };
          }),
          borderColor: tailwindConfig().theme.colors.indigo[500],
          fill: true,
          backgroundColor: `rgba(${hexToRGB(
            tailwindConfig().theme.colors.blue[500]
          )}, 0.08)`,
          borderWidth: 2,
          tension: 0,
          pointRadius: 0,
          pointHoverRadius: 3,
          pointBackgroundColor: tailwindConfig().theme.colors.indigo[500],
          clip: 20,
        },
        // Indigo line
        {
          label: "Unique Medallion Holder",
          data: holders.collections.map((value) => {
            let date = new Date(value.date);
	    const timestamp = moment(date).format("YYYY/MM/DD HH:mm:ss");
            return {
              x: `${timestamp}`,
              y: value.unique_holder,
            };
          }),
          borderColor: tailwindConfig().theme.colors.indigo[200],
          fill: true,
          backgroundColor: `rgba(${hexToRGB(
            tailwindConfig().theme.colors.indigo[200]
          )}, 0.08)`,
          borderWidth: 2,
          tension: 0,
          pointRadius: 0,
          pointHoverRadius: 3,
          pointBackgroundColor: tailwindConfig().theme.colors.indigo[200],
          clip: 20,
        },
        // Red line
        {
          label: "Exchanged Medallion",
          data: holders.collections.map((value) => {
            let date = new Date(value.date);
            const timestamp = moment(date).format("YYYY/MM/DD HH:mm:ss");
            return {
              x: `${timestamp}`,
              y: (value.burned_medallion? value.burned_medallion : 0),
            };
          }),
          borderColor: tailwindConfig().theme.colors.rose[600],
          fill: true,
          backgroundColor: `rgba(${hexToRGB(
            tailwindConfig().theme.colors.rose[600]
          )}, 0.08)`,
          borderWidth: 2,
          tension: 0,
          pointRadius: 0,
          pointHoverRadius: 3,
          pointBackgroundColor: tailwindConfig().theme.colors.rose[600],
          clip: 20,
        },
        // Green line
        {
          label: "Medallion Redeemable",
          data: holders.collections.map((value) => {
            console.log(value);
            let date = new Date(value.date);
            const timestamp = moment(date).format("YYYY/MM/DD HH:mm:ss");
            return {
              x: `${timestamp}`,
              y: (value.reedemable_medallion? value.reedemable_medallion : 0),
            };
          }),
          borderColor: tailwindConfig().theme.colors.green[600],
          fill: true,
          backgroundColor: `rgba(${hexToRGB(
            tailwindConfig().theme.colors.green[600]
          )}, 0.08)`,
          borderWidth: 2,
          tension: 0,
          pointRadius: 0,
          pointHoverRadius: 3,
          pointBackgroundColor: tailwindConfig().theme.colors.green[600],
          clip: 20,
        },
      ],
    });

    return {
      chartData,
    };
  },
};
</script>

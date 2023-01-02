<template>
  <div class="flex h-screen overflow-hidden">
    <!-- Content area -->
    <div
      class="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden"
    >

      <main>
        <div class="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">

          <!-- Search form -->
          <div class="mb-5">
            <form class="relative">
              <label for="wallet-search" class="sr-only">Search</label>
              <input id="wallet-search" class="form-input w-full pl-9 focus:border-slate-300" type="text" placeholder="Type your address" @input="search"/>
              <button class="absolute inset-0 right-auto group" aria-label="Search">
                <svg class="w-4 h-4 shrink-0 fill-current text-slate-400 group-hover:text-slate-500 ml-3 mr-2" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 14c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zM7 2C4.243 2 2 4.243 2 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5z" />
                  <path d="M15.707 14.293L13.314 11.9a8.019 8.019 0 01-1.414 1.414l2.393 2.393a.997.997 0 001.414 0 .999.999 0 000-1.414z" />
                </svg>
              </button>
            </form>
          </div>

            <div v-if="addressValid" class="shadow-lg rounded-sm border px-5 py-4 mb-5" :class="color">
              <div class="md:flex justify-between items-center space-y-4 md:space-y-0 space-x-2">
                <!-- Left side -->
                <div class="flex items-start space-x-3 md:space-x-4">
                  <div>
                    <div class="text-sm" v-html="text"></div>
                  </div>
                </div>
                <!-- Right side -->
              </div>
            </div>
          <!-- Cards -->
          <div class="grid grid-cols-12 gap-6">
            <FintechCard01 />
            <!-- Doughnut chart (Top Countries) -->
            <DashboardCard06 />

          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { computed, ref } from "vue";
import Sidebar from "../partials/Sidebar.vue";
import Header from "../partials/Header.vue";
import WelcomeBanner from "../partials/dashboard/WelcomeBanner.vue";
import DashboardAvatars from "../partials/dashboard/DashboardAvatars.vue";
import FilterButton from "../components/DropdownFilter.vue";
import Datepicker from "../components/Datepicker.vue";
import FintechCard01 from "../partials/fintech/FintechCard01.vue";
import DashboardCard01 from "../partials/dashboard/DashboardCard01.vue";
import DashboardCard02 from "../partials/dashboard/DashboardCard02.vue";
import DashboardCard03 from "../partials/dashboard/DashboardCard03.vue";
import DashboardCard04 from "../partials/dashboard/DashboardCard04.vue";
import DashboardCard05 from "../partials/dashboard/DashboardCard05.vue";
import DashboardCard06 from "../partials/dashboard/DashboardCard06.vue";
import DashboardCard07 from "../partials/dashboard/DashboardCard07.vue";
import DashboardCard08 from "../partials/dashboard/DashboardCard08.vue";
import DashboardCard09 from "../partials/dashboard/DashboardCard09.vue";
import DashboardCard10 from "../partials/dashboard/DashboardCard10.vue";
import DashboardCard11 from "../partials/dashboard/DashboardCard11.vue";
import holders from "../../result/holder/holders.json";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Dashboard",
  components: {
    Sidebar,
    // eslint-disable-next-line vue/no-reserved-component-names
    Header,
    WelcomeBanner,
    DashboardAvatars,
    FilterButton,
    Datepicker,
    FintechCard01,
    DashboardCard01,
    DashboardCard02,
    DashboardCard03,
    DashboardCard04,
    DashboardCard05,
    DashboardCard06,
    DashboardCard07,
    DashboardCard08,
    DashboardCard09,
    DashboardCard10,
    DashboardCard11,

  },
  setup() {
    const snapshoted = ref(false);
    const text = ref("");
    const color = ref("");
    const addressValid = ref(false);
    const sidebarOpen = ref(false);
    const search = (event) => {
      if(event.target.value.length >= 32 && event.target.value.length <= 44){
        if(holders.collections.at(-1).holders[`${event.target.value}`] !== undefined){
          snapshoted.value = true;
          if(holders.collections.at(-1).holders[`${event.target.value}`]['Medallion of Memoria'] > 1 ){
            text.value = `Attention! Your address <b>is eligible</b> for the medallion snapshot but you have <b>${holders.collections.at(-1).holders[`${event.target.value}`]['Medallion of Memoria']} medallions</b>. Please split them in other wallets to be able to use them all.`;
            color.value = "bg-yellow-50 border-yellow-300";
          }else{
            text.value = "Congratulations, your address <b>is eligible</b> for the medaillion snapshot";
            color.value = "bg-emerald-50 border-emerald-300";
          }
        }else{
          snapshoted.value = false;
          text.value = "Oops, your address <b>is not eligible</b> for the medallion snapshot.";
          color.value = "bg-rose-50 border-rose-300";
        }
        addressValid.value = true;
      }else{
        addressValid.value = false;
        snapshoted.value = false;
      }
    };
    return {
      sidebarOpen,
      search,
      text,
      color,
      addressValid,
      snapshoted
    };
  },
};
</script>

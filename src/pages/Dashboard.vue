<template>
  <div class="flex h-screen overflow-hidden">
    <!-- Content area -->
    <div
      class="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden"
    >

      <main>
        <div class="flex items-center justify-between border-b border-slate-200 px-4 sm:px-6 md:px-5 h-16">
          <form class="relative w-full">
            <label for="inbox-search" class="sr-only">Search</label>
            <input id="inbox-search" class="form-input w-full pl-9 focus:border-slate-300" type="search" placeholder="Type your address" @input="search">
            <button class="absolute inset-0 right-auto group" type="submit" aria-label="Search">
              <svg class="w-4 h-4 shrink-0 fill-current text-slate-400 group-hover:text-slate-500 ml-3 mr-2" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 14c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zM7 2C4.243 2 2 4.243 2 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5z"></path>
                <path d="M15.707 14.293L13.314 11.9a8.019 8.019 0 01-1.414 1.414l2.393 2.393a.997.997 0 001.414 0 .999.999 0 000-1.414z"></path>
              </svg>
            </button>
          </form>
          <div class="flex items-center px-4">
            <a download href="result/snapshot/snapshot_aggregate_latest.json"><button class="btn bg-indigo-500 hover:bg-indigo-600 text-white whitespace-nowrap">
              <svg class="w-4 h-4 fill-current shrink-0 opacity-50 shrink-0" viewBox="0 0 16 16">
                <path d="M11 0c1.3 0 2.6.5 3.5 1.5 1 .9 1.5 2.2 1.5 3.5 0 1.3-.5 2.6-1.4 3.5l-1.2 1.2c-.2.2-.5.3-.7.3-.2 0-.5-.1-.7-.3-.4-.4-.4-1 0-1.4l1.1-1.2c.6-.5.9-1.3.9-2.1s-.3-1.6-.9-2.2C12 1.7 10 1.7 8.9 2.8L7.7 4c-.4.4-1 .4-1.4 0-.4-.4-.4-1 0-1.4l1.2-1.1C8.4.5 9.7 0 11 0ZM8.3 12c.4-.4 1-.5 1.4-.1.4.4.4 1 0 1.4l-1.2 1.2C7.6 15.5 6.3 16 5 16c-1.3 0-2.6-.5-3.5-1.5C.5 13.6 0 12.3 0 11c0-1.3.5-2.6 1.5-3.5l1.1-1.2c.4-.4 1-.4 1.4 0 .4.4.4 1 0 1.4L2.9 8.9c-.6.5-.9 1.3-.9 2.1s.3 1.6.9 2.2c1.1 1.1 3.1 1.1 4.2 0L8.3 12Zm1.1-6.8c.4-.4 1-.4 1.4 0 .4.4.4 1 0 1.4l-4.2 4.2c-.2.2-.5.3-.7.3-.2 0-.5-.1-.7-.3-.4-.4-.4-1 0-1.4l4.2-4.2Z"></path>
              </svg>
              <span class="ml-2">Latest snapshot</span>
            </button></a>
          </div>
        </div>


        <div class="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">

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

          <div class="shadow-lg rounded-sm border px-5 py-4 mb-5 bg-orange-50 border-orange-300" >
            <div class="md:flex justify-between items-center space-y-4 md:space-y-0 space-x-2">
              <!-- Left side -->
              <div class="flex items-start space-x-3 md:space-x-4">
                <div>
                  <div class="text-sm">For any question about the website, please ask @lekkerelou on Tomorrowland Discord | Last Update: 21 Nov 2023</div>
                </div>
              </div>
              <!-- Right side -->
            </div>
          </div>

          <div class="shadow-lg rounded-sm border px-5 py-4 mb-5 bg-red-50 border-red-300" >
            <div class="md:flex justify-between items-center space-y-4 md:space-y-0 space-x-2">
              <!-- Left side -->
              <div class="flex items-start space-x-3 md:space-x-4">
                <div>
                  <div class="text-sm">Exchanged Medaillon will be removed in next update (Option is no longer possible for the pre-sales registrations)</div>
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
    // eslint-disable-next-line vue/no-reserved-component-names
    FintechCard01,
    DashboardCard06,

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
            text.value = `Attention! This wallet own multiple  Medaillon (<b>${holders.collections.at(-1).holders[`${event.target.value}`]['Medallion of Memoria']}</b>). If you want to buy more than 4 tickets during pre-sales, you've to split it into multiple wallets. 1 MED = 1 TML account`;
            color.value = "bg-yellow-50 border-yellow-300";
          }else{
            text.value = "Congratulations, your address <b>is eligible</b> for the medallion snapshot";
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

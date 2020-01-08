<template>
  <vs-row vs-justify="center">
    <!-- /////////////////////////////////////////////
    Sales Summary
    /////////////////////////////////////////////-->
    <vs-col vs-lg="12" vs-xs="12" vs-sm="12">
      <vs-card>
        <SalesSummery></SalesSummery>
      </vs-card>
    </vs-col>
    <!-- /////////////////////////////////////////////
    Email Campaigns
    /////////////////////////////////////////////-->
    <vs-col vs-lg="8" vs-xs="12" vs-sm="12">
      <vs-card>
        <EmailCampaign></EmailCampaign>
      </vs-card>
    </vs-col>
    <!-- /////////////////////////////////////////////
    Active Visitors
    /////////////////////////////////////////////-->
    <vs-col vs-lg="4" vs-xs="12" vs-sm="12">
      <vs-card class="active-user-card">
        <ActiveVisitors></ActiveVisitors>
      </vs-card>
    </vs-col>
    <!-- /////////////////////////////////////////////
    Revenue Statistics
    /////////////////////////////////////////////-->
    <vs-col vs-lg="4" vs-xs="12" vs-sm="12">
      <vs-card class="bg-primary">
        <RevenueStatics></RevenueStatics>
      </vs-card>
    </vs-col>
    <!-- /////////////////////////////////////////////
    Page Views
    /////////////////////////////////////////////-->
    <vs-col vs-lg="4" vs-xs="12" vs-sm="12">
      <vs-card class="bg-info card-no-padding">
        <h3 class="card-title text-white p-3">
          <span class="mb-2 d-block">Page Views</span>
          <i class="ti-arrow-up"></i> 6548
        </h3>
        <PageViews></PageViews>
      </vs-card>
    </vs-col>
    <!-- /////////////////////////////////////////////
    Bounce Rate
    /////////////////////////////////////////////-->
    <vs-col vs-lg="4" vs-xs="12" vs-sm="12">
      <vs-card>
        <h3 class="card-title">Bounce Rate</h3>
        <BounceRate></BounceRate>
      </vs-card>
    </vs-col>
    <!-- /////////////////////////////////////////////
    Projects of the Month
    /////////////////////////////////////////////-->
    <vs-col vs-lg="12" vs-xs="12" vs-sm="12">
      <vs-card>
        <!-- Header -->
        <div class="d-md-flex align-items-center">
          <div>
            <h3 class="card-title">Projects of the Month</h3>
            <h5 class="card-subtitle text-muted font-weight-normal">Overview of Latest Month</h5>
          </div>
          <div class="ml-auto">
            <vs-select class="w-100px" v-model="month1">
              <vs-select-item
                :key="index"
                :value="item.value"
                :text="item.text"
                v-for="(item,index) in monthoptions1"
              />
            </vs-select>
          </div>
        </div>
        <MonthTable></MonthTable>
      </vs-card>
    </vs-col>
    <!-- /////////////////////////////////////////////
    Recent Comments
    /////////////////////////////////////////////-->
    <vs-col vs-lg="6" vs-xs="12" vs-sm="12">
      <vs-card class="card-no-padding">
        <h3 class="card-title mb-0" slot="header">Recent Comments</h3>
        <RecentComments></RecentComments>
      </vs-card>
    </vs-col>
    <!-- /////////////////////////////////////////////
    Recent Chats
    /////////////////////////////////////////////-->
    <vs-col vs-lg="6" vs-xs="12" vs-sm="12">
      <vs-card>
        <h3 class="card-title mb-0" slot="header">Recent Chats</h3>
        <RecentChats></RecentChats>
      </vs-card>
    </vs-col>
  </vs-row>
</template>
<script>
// //////////////////////////////////////////
// Import Components Here
// //////////////////////////////////////////
import SalesSummery from "../dashboard-components/sales-summery/SalesSummery";
import EmailCampaign from "../dashboard-components/email-campaign/EmailCampaign";
import ActiveVisitors from "../dashboard-components/active-visitors/ActiveVisitors";
import MonthTable from "../dashboard-components/month-table/MonthTable";
import RevenueStatics from "../../widgets/chart-widgets/revenue-statics/RevenueStatics";
import PageViews from "../../widgets/chart-widgets/page-views/PageViews";
import RecentComments from "../dashboard-components/recent-comments/RecentComments";
import RecentChats from "../dashboard-components/recent-chats/RecentChats";
import BounceRate from "../../widgets/chart-widgets/bounce-rate/BounceRate";

// //////////////////////////////////////////
// Export Here
// //////////////////////////////////////////
export default {
  name: "ClassicDashboard",
  data: () => ({
    title: "ClassicDashboard",
    // Month Table
    month1: 0,
    monthoptions1: [
      { text: "Monthly", value: 0 },
      { text: "Daily", value: 1 },
      { text: "Weekly", value: 2 },
      { text: "Yearly", value: 3 }
    ]
  }),
  components: {
    SalesSummery,
    EmailCampaign,
    ActiveVisitors,
    MonthTable,
    RevenueStatics,
    PageViews,
    RecentComments,
    RecentChats,
    BounceRate
  }
};
</script>
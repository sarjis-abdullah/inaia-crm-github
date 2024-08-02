<template>
    <div>
        <div class="row align-items-center mb-3">
      <div class="col-8">
        <h5 class="h2 mb-0">{{ $t("depot_history") }}</h5>
      </div>
      
    </div>
    <el-table
      class="table-hover table-responsive table-flush mb-3"
      header-row-class-name="thead-light"
      :data="depotHistories"
    >
    <el-table-column
        v-bind:label="$t('date')"
        prop="created_at"
      >
        <template v-slot="{ row }">
          {{ row.created_at ? $d(new Date(row.created_at)) : '' }}
        </template>
      </el-table-column>
    <el-table-column
        v-bind:label="$t('saving_plan')"
        prop="is_savings_plan"
      >
        <template v-slot="{ row }">
          <span class="text-break">
            {{ row.is_savings_plan ? $t('saving_plan') : $t('no_saving_plan') }}
          </span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('agio_payment_option')" min-width="100px" prop="agio_payment_option">
        <template v-slot="{ row }">
          <div class="dateStyle" v-if="row.agio_payment_option=='onetime'">{{$t(row.agio_payment_option)}}</div>
          <div class="dateStyle" v-else>{{$t('billing')}}  <span v-if="row.agio_percentage == 75">75/25</span>
              <span v-if="row.agio_percentage == 50">50/50</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column v-bind:label="$t('agio')" prop="agio">
        <template v-slot="{ row }">
          <span>{{$n(row.agio/100)}} {{ currency }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-bind:label="$t('interval_amount')"
        prop="interval_amount"
      >
        <template v-slot="{ row }">
          <span>{{$n(row.interval_amount/100)}} {{ currency }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-bind:label="$t('paymentMethod')"
        prop="payment_method"
      >
        <template v-slot="{ row }">
          <span class="text-break">{{ row.payment_method ? $t(row.payment_method) : $t('unassigned')  }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-bind:label="$t('interval_day')"
        prop="interval_day"
      >
        <template v-slot="{ row }">
          <span>{{ row.interval_day}}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-bind:label="$t('interval_startdate')"
        prop="interval_startdate"
      >
        <template v-slot="{ row }">
          <span>{{ $d(new Date(row.interval_startdate))}}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-bind:label="$t('interval_enddate')"
        prop="interval_enddate"
      >
        <template v-slot="{ row }">
          <span>{{ $d(new Date(row.interval_enddate))}}</span>
        </template>
      </el-table-column>
      <el-table-column
        
        prop="interval_enddate"
      >
        <template v-slot="{ row }">
          <div class="font-weight-300 name" v-if="row.created_by">{{$t('created_by')}} : <UserInfo :accountId="row.created_by" :isLazy="true"/></div>
          <div class="font-weight-300 name" v-if="row.updated_by">{{$t('updated_by')}} : <UserInfo :accountId="row.updated_by" :isLazy="true"/></div>
        </template>
      </el-table-column>
    </el-table>
    </div>
</template>
<script>

import { Table, TableColumn } from "element-ui";
import UserInfo from '@/components/Contacts/UserInfo';

export default {
  props: {
    depotHistories: {
      type: Array,
      default: [],
    },
    currency: {
      type: String,
      required: true,
    }
  },
  components: {
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    UserInfo
  },
}
</script>

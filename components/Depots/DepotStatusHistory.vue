<template>
  <div>

    <div class="row align-items-center mb-3">
      <div class="col-8">
        <h5 class="h2 mb-0">{{ $t("status_history") }}</h5>
      </div>
    </div>

    <el-table
      class="table-hover table-responsive table-flush mb-3"
      header-row-class-name="thead-light"
      :data="depotStatus"
    >
      <el-table-column label="#" min-width="100px" prop="id">
        <template v-slot="{ row }">
          <div class="media align-items-center">
            <div class="media-body">
              <div class="font-weight-300 name">{{ row.id }}</div>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column v-bind:label="$t('start_date')" min-width="180px" prop="start_date">
        <template v-slot="{ row }">
          <div class="d-flex align-items-center">
            <div>
              {{row.start_date?$d(new Date(row.start_date),'short'):""}}

            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column v-bind:label="$t('end_date')" min-width="180px" prop="end_date">
        <template v-slot="{ row }">
          <div class="d-flex align-items-center">
            <div>
              {{row.end_date?$d(new Date(row.end_date),'short'):''}}

            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        v-bind:label="$t('status')"
        min-width="150px"
      >
        <template v-slot="{ row }">
          <Status :row="row"/>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>
<script>

import { Table, TableColumn } from "element-ui";
import Status from '@/components/Depots/Status';
export default {
  props: {
    depotStatus: {
      type: Array,
      default: [],
    },
  },
  components: {
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    Status
  },


  data() {
    return {

    };
  },
  methods: {

  },
};
</script>
<style scoped>
.capitalize {
  text-transform: capitalize;
}
.mdi-10 {
  font-size: 18px;
}
.superscript {
  position: relative;
  top: -0.5em;
  font-size: 60%;
}
.orderType {
  white-space: nowrap;
}
.avatar,
.avatar img {
  height: 44px;
  width: 44px;
}
.dateStyle {
  color: #b5bacc;
  font-size: 0.85em;
  margin-top: -0.5em;
  white-space: nowrap;
}
.removeImageBorder {
  background-color: transparent !important;
}
.actionBtnStyle {
  color: #8898aa;
}
</style>

<template>
  <modal
    :show.sync="showCsvList"
    headerClasses=""
    bodyClasses="pt-0"
    footerClasses="border-top bg-secondary"
    @close="closeList"
    :allowOutSideClose="false"
  >
    <template slot="header" class="pb-0">
      <h5 class="modal-title">{{ $t("csv_files") }}</h5>
      <span></span>
    </template>
    <el-table
          class="table-hover table-responsive table-flush"
          header-row-class-name="thead-light"
          :data="csvFiles"
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

          <el-table-column
            v-bind:label="$t('file_name')"
            min-width="180px"
            header-align="right"
            align="right"
            prop="file_name"
          >
            <template v-slot="{ row }">
              <a :href="row.file_url">{{row.file_name}}</a>
            </template>
          </el-table-column>
          <el-table-column
            v-bind:label="$t('created_at')"
            min-width="180px"
            header-align="right"
            align="right"
            prop="creation_date"
          >
            <template v-slot="{ row }">
              {{$d(new Date(row.creation_date))}}
            </template>
          </el-table-column>
        </el-table>

        <div
          class="card-footer py-4 d-flex justify-content-end"
          v-if="totalPages > 1"
        >
          <base-pagination
            v-model="page"
            :per-page="perPage"
            :total="totalTableData"
          ></base-pagination>
        </div>
    <template slot="footer">
      <base-button type="link" class="ml-auto" @click="closeList()">
        {{ $t("cancel") }}
      </base-button>
      <base-button
        type="primary"
        @click="() => refreshList()"
        :disabled="isLoading"
      >
        {{ $t("refresh") }}
      </base-button>
    </template>
  </modal>
</template>
<script>
import { mapGetters } from "vuex";
import { Table, TableColumn } from "element-ui";
export default {
  props: {
    showCsvList: {
      type: Boolean,
      default: false,
    },
    selectedOrderProcess: {
      type: Object,
      default: null,
    },
  },
  components:{
      [Table.name]: Table,
    [TableColumn.name]: TableColumn,
  },
  data() {
    return {
      isLoading: false,
        page: 1,
      perPage: 10,
      totalTableData: 1,
      totalPages: 0,
    };
  },
  computed:{
      ...mapGetters({
      csvFiles: "csv-file/csvFiles",
    }),
  },
  watch:{
      page:{
          handler(){
              this.getListCSV();
          },
          immediate: true
      }
  },
  mounted(){
      this.getListCSV();
  },
  methods: {
    closeList() {
      this.showCsvList = false;
      this.selectedOrderProcess = null;
      this.$emit("closed");
    },
    refreshList(){
        this.page = 1;
        this.getListCSV();
    },
    getListCSV(){
        this.isLoading = true;
        let payload = "page="+this.page+"&per_page="+this.perPage;
        if(this.selectedOrderProcess){
            payload+="&order_process_id="+this.selectedOrderProcess.id;
        }
        this.$store.dispatch('csv-file/fetchList',payload).then((res)=>{
            this.totalTableData = res.meta.total;
            this.totalPages = res.meta.last_page;
        }).finally(()=>{
            this.isLoading = false;
        })
    }
  },
};
</script>
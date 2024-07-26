<template>
  <div>
    <base-header class="pb-6">
      <div class="row align-items-center py-4">
        <div class="col-lg-6 col-7">
          <h6 class="h2 text-white d-inline-block mb-0">
            {{ $t("Blacklist users") }}
          </h6>
        </div>
      </div>
    </base-header>

    <div class="container-fluid mt--6">
      <div class="row">
        <div class="col">
          <div class="card">
            <div class="card-header">
              <div class="row">
                <div class="col">
                  <el-input
                    prefix-icon="el-icon-search"
                    :placeholder="$t('search_blacklist_user_placeholder')"
                    clearable
                    style="width: 500px"
                    @change="onSearch"
                    v-model="searchWords"
                    @clear="clearSearch"
                  />
                </div>
              </div>
            </div>

            <el-table
              class="table-hover table-responsive table-flush"
              header-row-class-name="thead-light"
              :data="data"
              v-if="!loading"
            >
              <el-table-column
                label="Name"
                min-width="160px"
                prop="row.name"
                sortable
              >
                <template v-slot="{ row }">
                  <span>{{ row.name ? row.name : "N/A" }}</span>
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('email')"
                min-width="160px"
                prop="row.email"
                sortable
              >
                <template v-slot="{ row }">
                  <span>{{ row.email ? row.email : "N/A" }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="Surname"
                min-width="160px"
                prop="row.surname"
                sortable
              >
                <template v-slot="{ row }">
                  <span>{{ row.surname ? row.surname : "N/A" }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="Birthplace"
                min-width="160px"
                prop="row.birthplace"
                sortable
              >
                <template v-slot="{ row }">
                  <span>{{ row.birthplace ? row.birthplace : "N/A" }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="Birthday"
                min-width="160px"
                prop="row.birthday"
                sortable
              >
                <template v-slot="{ row }">
                  <span>{{ row.birthday ? row.birthday : "N/A" }}</span>
                </template>
              </el-table-column>
              <el-table-column min-width="100px" v-if="hasDeleteAccess">
                <template v-slot="{ row }">
                  <el-dropdown trigger="click" class="dropdown">
                    <span class="btn btn-sm btn-icon-only text-light">
                      <i class="fas fa-ellipsis-v mt-2"></i>
                    </span>
                    <el-dropdown-menu
                      class="dropdown-menu dropdown-menu-arrow show"
                      slot="dropdown"
                    >
                      <a
                        class="dropdown-item"
                        @click.prevent="() => removeConfirm(row)"
                        href="#"
                        >{{ $t("delete") }}</a
                      >
                    </el-dropdown-menu>
                  </el-dropdown>
                </template>
              </el-table-column>
            </el-table>

            <!-- Loading: Spinner -->
            <div v-else class="text-center py-4"><Loader /></div>

            <div
              class="card-footer py-4 d-flex align-items-center"
              v-if="meta && meta.total > 0"
            >
              <MetaInfo :meta="meta" class="d-flex" />
              <base-pagination
                v-model="page"
                :per-page="perPage"
                :total="totalTableData"
                class="ml-auto"
              ></base-pagination>
            </div>
            <modal :show.sync="showConfirm">
              <template slot="header">
                <h5 class="modal-title" id="confirmModal">Confirmation</h5>
              </template>
              <div>Are you sure to delete this blacklisted user?</div>
              <template slot="footer">
                <base-button type="secondary" @click="showConfirm = false"
                  >Close</base-button
                >
                <base-button type="danger" @click="remove(selectedResource)"
                  >Remove</base-button
                >
              </template>
            </modal>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  Table,
  TableColumn,
  DropdownMenu,
  DropdownItem,
  Dropdown,
  Select,
  Option,
  Checkbox,
} from "element-ui";
import { isEmail } from "@/helpers/helpers";
import MetaInfo from "@/components/common/MetaInfo";
import Loader from "../common/Loader/Loader";
import { canEditAdmin } from "@/permissions";

export default {
  components: {
    Loader,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Dropdown.name]: Dropdown,
    [DropdownItem.name]: DropdownItem,
    [DropdownMenu.name]: DropdownMenu,
    Select,
    Option,
    MetaInfo,
    Checkbox,
  },
  data() {
    return {
      data: [],
      loading: true,
      search: null,
      sort: "id",
      order: "desc",
      id: "",
      initiated: false,
      selectedResource: null,
      showConfirm: false,
      perPage: 10,
      page: 1,
      totalTableData: 0,
      searchWords: null,
      meta: null,
    };
  },

  computed: {
    searchQuery() {
      return (
        `?page=${this.page}` +
        `&order_by=${this.sort}&order_direction=${this.order}` +
        `&per_page=${this.perPage}` +
        (this.search ? "&" + this.search : "")
      );
    },
    totalPages() {
      return Math.ceil(this.totalTableData / this.perPage);
    },
    hasDeleteAccess() {
      return canEditAdmin();
    },
  },
  mounted() {},
  watch: {
    searchQuery: {
      handler() {
        this.fetchData(this.searchQuery);
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    fetchData(pageQuery) {
      if (!this.initiated) {
        this.initiated = true;
        this.loading = true;
        this.$store
          .dispatch("blacklist/fetchData", pageQuery)
          .then((response) => {
            console.log(response, "response");
            if (response.data.data) {
              this.data = response.data.data;
              if (response.data.meta.total) {
                this.totalTableData = response.data.meta.total;
                this.meta = response.data.meta;
              } else {
                this.totalTableData = response.data.total;
                this.meta = response.data;
              }
            }

            this.loading = false;
          })
          .finally(() => {
            this.initiated = false;
            this.loading = false;
          });
      }
    },
    removeConfirm(resource) {
      this.selectedResource = resource;
      this.showConfirm = true;
    },
    remove(resource) {
      this.loading = true;
      this.showConfirm = false;
      this.$store
        .dispatch("blacklist/remove", resource.id)
        .then(() => {
          if (!this.data.length && this.page > 1) {
            this.page = this.page - 1;
          } else {
            this.fetchData(this.searchQuery);
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    onSearch(value) {
      if (value != "") {
        if (isEmail(value)) {
          this.search = "email=" + value;
        } else {
          this.search = "name=" + value;
        }

        this.page = 1;
      } else {
        this.clearSearch();
      }
    },
    clearSearch() {
      this.search = "";
      this.page = 1;
    },
  },
};
</script>

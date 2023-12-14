<template>
    <div>

        

        
            <div class="row">
                <div class="col">
                    <div class="card">

                        <div class="card-header">
                            <div class="row">
                                <div class="col">
                                    <el-input prefix-icon="el-icon-search"
                                    :placeholder="$t('search_customer')" clearable
                                    style="width: 500px" @change="onSearch"
                                    v-model="searchWords"
                                    @clear="clearSearch"
                                    />
                                </div>
                                <div class="col">
                                  <Select
                                        :placeholder="$t('sales_advisors')"
                                        v-model="selectedSalesAdvisor"
                                        clearable
                                        @clear="clearSalesAdvisor"
                                        :multiple="false"
                                        class="float-right"
                                    >
                                        <Option
                                        v-for="option in salesAdvisors"
                                        :value="option.id"
                                        :label="formatSalesAdvisorLabel(option)"
                                        :key="option.id"
                                        >
                                        </Option>
                                    </Select>
                                </div>
                          </div>
                        </div>

                        <el-table class="table-hover table-responsive table-flush"
                              header-row-class-name="thead-light"
                              :data="data"
                              v-if="!loading">
                          <!-- <el-table-column label="ID"
                                          min-width="110px"
                                          prop="id"
                                          sortable>
                              <template v-slot="{row}">
                                  <div class="media align-items-center">
                                      <div class="media-body">
                                          <span class="font-weight-600 name mb-0 text-sm">{{row.id}}</span>
                                      </div>
                                  </div>
                              </template>
                          </el-table-column> -->

                          <el-table-column label="Name"
                                          min-width="260px">
                              <template v-slot="{row}">
                                  <div class="media align-items-center">
                                      <div class="avatar mr-3">
                                          <img v-bind:src="avatar(row)" alt="" />
                                      </div>
                                      <div class="media-body">
                                          <div class="font-weight-600 name mb-0 text-sm">{{ row.contact.name + (row.contact.person_data ? ' ' + row.contact.person_data.surname : '') }}</div>

                                              <div class="name mb-0 text-xs text-muted d-inline-block mr-2">
                                                  <i class="fa mr-1" :class="`${row.contact.is_verified ? 'fa-check-circle text-success' : 'fa-times text-danger'}`"></i>{{ row.contact.is_verified ? $t('verified') : $t('not_verified') }}
                                              </div>
                                              <!--<AmlStatus  class="d-inline-block" :amlStatus="row.contact.aml_status.name"/>-->
                                      </div>
                                  </div>
                              </template>
                          </el-table-column>

                          <el-table-column label="Account No."
                                          min-width="160px"
                                          prop="row.account.account_number"
                                          sortable>
                              <template v-slot="{row}">
                                  <span class="status">{{ row.account_number ? row.account_number : 'N/A' }}</span>
                              </template>
                          </el-table-column>

                          <el-table-column :label="$t('mobile')"
                                          min-width="160px"
                                          >
                              <template v-slot="{row}">
                                  <div v-if="getChannelInfo(row.contact.channels, 'mobile')"><i class="lnir lnir-mobile-alt-1 text-muted mr-1"></i>{{getChannelInfo(row.contact.channels, 'mobile')}}</div>
                              </template>
                          </el-table-column>

                          <el-table-column :label="$t('email')"
                                           min-width="160px">
                            <template v-slot="{row}">
                              <div v-if="getChannelInfo(row.contact.channels, 'email')"><i class="lnir lnir-envelope text-muted mr-1"></i>{{getChannelInfo(row.contact.channels, 'email')}}</div>
                            </template>
                          </el-table-column>

                          <!--
                          <el-table-column :label="$t('address')"
                                           min-width="160px">
                            <template v-slot="{row}">
                              <div>{{row.address ? row.address.line1 : ''}}</div>
                              <div>{{row.address ? row.address.country.name_translation_key : ''}}</div>
                            </template>
                          </el-table-column>
                          -->

                          <el-table-column label="Status"
                                          min-width="160px"
                                          prop="is_active"
                                          sortable
                                          >
                              <template v-slot="{row}">
                                <badge :type="`${row.contact.is_active ? 'success' : 'danger'}`">{{row.contact.is_active ? $t('active') : $t('inactive')}}</badge>

                                <badge v-if="row.contact.is_locked" type="danger"><i class="lnir lnir-lock-alt"></i>{{$t('locked')}}</badge>

                              </template>
                          </el-table-column>

                          <!-- <el-table-column label="Type"
                                          min-width="190px">
                              <template v-slot="{row}">
                                  <span class="status">{{getAccountType(row)}}</span>
                              </template>
                          </el-table-column> -->


                          <el-table-column>
                              <template v-slot="{row}">

                                <icon-button type="info" @click="gotoDetails(row.contact)"></icon-button>
                                <Dropdown trigger="click" @command="(command)=>handleCommand(command,row)">
                  <span class="btn btn-sm btn-icon-only text-light">
                      <i class="fas fa-ellipsis-v mt-2"></i>
                  </span>
                  <DropdownMenu  slot="dropdown">
                      <DropdownItem command="client_document">{{$t('client_document')}}</DropdownItem>
                      <DropdownItem command="upload_document">{{$t('upload_document')}}</DropdownItem>
                      <DropdownItem command="verify_client">{{$t('verify_client')}}</DropdownItem>
                      <DropdownItem command="decline_document">{{$t('decline_client')}}</DropdownItem>
                  </DropdownMenu>
                  </Dropdown>
                              </template>
                          </el-table-column>

                        <!--
                        <el-table-column min-width="180px" >
                            <template v-slot="{row}">
                                <el-dropdown trigger="click" class="dropdown ml-2">
                                    <span class="btn btn-sm btn-icon-only text-light">
                                        <i class="fas fa-ellipsis-v mt-2"></i>
                                    </span>
                                    <el-dropdown-menu class="dropdown-menu dropdown-menu-arrow show" slot="dropdown">
                                        <a class="dropdown-item" @click.prevent="() => popupDetails(row)" href="#">Details</a>
                                        <a class="dropdown-item" @click.prevent="() => $router.push('/customers/details/'+row.id)" href="#">{{ $t('details') }}</a>
                                        <a class="dropdown-item" @click.prevent="() => $router.push('/customers/edit/'+row.id)" href="#">{{ $t('edit') }}</a>
                                        <a class="dropdown-item" @click.prevent="() => removeConfirm(row)" href="#">{{ $t('delete') }}</a>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </template>
                        </el-table-column>
                        -->
                      </el-table>

                      <!-- Loading: Spinner -->
                      <div v-else class="text-center py-4"><Loader /></div>


                      <div class="card-footer py-4 d-flex align-items-center" v-if="meta && meta.total>0">
                        <MetaInfo :meta="meta" class="d-flex"/>
                        <base-pagination v-model="page" :per-page="perPage" :total="totalTableData" class="ml-auto"></base-pagination>
                      </div>

                     

                      

                    </div>
                </div>
            </div>
            <div v-if="selectedClient">
                <KycDocumentList :showModal="showKycDocument" :account_id="selectedClient.id" @closed="closeKycDocument"/>
                <VerifyContact :showModal="showVerifyContact" :client="selectedClient.contact" @closed="closeCustomerIdentity"/>
                <UploadDocuments :showUploadDialog="showUploadDocument" :contactId="selectedClient.contact_id" @canceled="closeUploadDocument"/>
            </div>
    </div>
</template>
<script>
import { mapGetters } from "vuex"
import { Table, TableColumn, DropdownMenu, DropdownItem, Dropdown,Select,Option } from 'element-ui'
import IconButton from '@/components/common/Buttons/IconButton';
import { isEmail,isPhoneNumber, checkIfItIsAccountNumber } from '../../helpers/helpers';
import AmlStatus from '@/components/Contacts/AmlStatus';
import MetaInfo from '@/components/common/MetaInfo';
import Loader from "../common/Loader/Loader";
import KycDocumentList from "@/components/Contacts/KycDocumentList";
import VerifyContact from '@/components/Contacts/VerifyContact';
import UploadDocuments from "@/components/Contacts/UploadDocuments.vue";
export default {
    components: {
      Loader,
        [Table.name]: Table,
        [TableColumn.name]: TableColumn,
        Dropdown,
      DropdownItem,
      DropdownMenu,
        IconButton,
        AmlStatus,
        Select,
        Option,
        MetaInfo,
        KycDocumentList,
        VerifyContact,
        UploadDocuments
    },
    data() {
        return {
            data: [],
            loading: true,
            search: null,
            sort: 'id',
            order: 'desc',
            selected: [],
            id: '',
            account_number: '',
            type_id: '',
            gender: '',
            initiated: false,
            debouced: null,
            selectedResource: null,
            showPopup: false,
            showConfirm: false,
            perPage: 10,
            page: 1,
            totalTableData: 0,
            sortedBy: { customer: "asc" },
            searchWords:null,
            selectedAmlStatus:null,
            selectedSalesAdvisor:null,
            meta:null,
            selectedClient:null,
            showKycDocument:false,
            showVerifyContact:false,
            showUploadDocument:false
        }
    },

    computed: {
        ...mapGetters({
            types: "types/pairs"
        }),
        ...mapGetters({
            kycStatuses: "clients/kycStatuses"
        }),
        ...mapGetters("salesCommission", {
            salesAdvisors: "salesAdvisors",
        }),
        searchQuery() {
            
            
                return (
                (this.search ? '&' + this.search : '') +
                ( this.selectedSalesAdvisor ? `&sales_advisor_id=${ this.selectedSalesAdvisor }`:'')+
                `&order_by=${ this.sort }&order_direction=${ this.order }` +
                `&page=${this.page}` +
                `&per_page=${this.perPage}&type=customer`
                // `&type_id=${ this.types && this.types.person ? this.types.person : 0 }`
            )
            
        },
        totalPages() {
            return Math.ceil(this.totalTableData / this.perPage)
        },
    },
     mounted(){
        if(this.salesAdvisors.length == 0)
        {
            this.$store.dispatch("salesCommission/fetchSalesAdvisors")
        }
        if(this.kycStatuses.length == 0){
            this.$store.dispatch("clients/getKycStatuses").then(res=>{
                this.fetchClientData(this.searchQuery);
            });

        }
    },
    watch: {
        searchQuery: {
            handler() {
                if(this.searchQuery!='')
                    this.fetchClientData(this.searchQuery)
            },
            immediate: true,
        },
        types: {
            handler() {
                this.fetchClientData(this.searchQuery)
            },
            immediate: true
        }
    },
    methods: {
        popupDetails(resource) {
            this.selectedResource= resource
            this.showPopup      = true
        },
        gotoDetails(resource) {
            const part = "/customers/details/";
            const url = "http://"+window.location.host+part+resource.id;
            window.open(url,'_blank');
          //this.$router.push('/customers/details/'+resource.id)
        },
        fetchClientData(pageQuery) {
            let pendingStatus = this.kycStatuses.find(x=>x.name=='pending');
            if (!this.initiated && this.types && this.types.person && pendingStatus) {
                this.initiated  = true
                let fullQuery = pageQuery+`&is_verified=0&kyc_status_id=${pendingStatus.id}`;
                this.$store
                    .dispatch("clients/initClientData", fullQuery)
                    .then(response => {
                        this.data = response.data.data
                        this.totalTableData = response.data.meta.total
                        this.meta = response.data.meta;
                        this.loading = false;
                    }).finally(() => {
                        this.initiated  = false
                    })
            }
        },
       
        
        getChannelInfo(channels, type) {
            let channel = channels && channels.length && channels.find( c => c.type.value == type )
            if (channel) {
                return channel.value
            }
            return null
        },
        getAccountType(contact) {
            if (contact.account && contact.account.type) {
                return contact.account.type.value
            }
            return null
        },
        avatar(resource) {
          if (resource.contact && resource.contact.avatar) return resource.contact.avatar;
          else if (resource.contact && resource.contact.person_data) {
              let gender = resource.contact.person_data.gender ? resource.contact.person_data.gender.toLowerCase() : ''
              if (gender == 'female' || gender == 'f') {
                  return '/img/theme/avatar_f.png'
              }
          }
          return '/img/theme/avatar_m.png'
        },
        handleSearch(search) {
            if (this.debouced) {
                clearTimeout(this.debouced)
            }
            this.debouced   = setTimeout(() => {
                if (search.length > 1) {
                    this.search = search
                } else if (this.search) {
                    this.search = ''
                }
            }, 400)
        },
        handleSort(sort, order) {
            if (!order || !sort)    return
            this.sort   = sort
            this.order  = order
        },
        onSearch(value){
            if(value!="")
            {
                if(checkIfItIsAccountNumber(value))
                {
                    this.search = "account_number="+value;
                }
                else if(isEmail(value))
                {
                    this.search = "email="+value;
                }
                else if(isPhoneNumber(value))
                {
                    this.search = "phone="+value;
                }
                else{
                    this.search = "name="+value;
                }

                this.page = 1;
            }
            else{
                this.clearSearch();
            }

        },
        clearSearch()
        {
            this.search = "";
            this.page = 1;
        },
        clearSalesAdvisor(){
            this.selectedSalesAdvisor = null;
        },
        formatSalesAdvisorLabel: function (client) {
            if (client) {
                let email = null;
                if (client.contact.channels) {
                    client.contact.channels.forEach((element) => {
                        if (element.type == "email") {
                            email = element.value;
                        }
                    });
                }
                let label =
                    client.contact.name + " " + client.contact.person_data.surname;
                if (email) {
                    label += ` (${email})`;
                }
                return label;
            }
        },
        handleCommand(command,client){
            this.selectedClient = client;
            switch (command) {
                case 'client_document':
                    this.showKycDocument = true;
                    break;
                case 'verify_client':
                    this.showVerifyContact = true;
                    break;
                case 'upload_document':
                    this.showUploadDocument = true;
                    break;
                default:
                    break;
            }
        },
        closeKycDocument(){
        this.showKycDocument = false;
      },
      closeUploadDocument(){
        this.showUploadDocument = false;
      },
      closeCustomerIdentity(){
        this.showVerifyContact = false
      },
    }
}
</script>

<style scoped>
.capitalize {
    text-transform: capitalize
}

.mdi-10 {
    font-size: 18px;
}
.avatar {
  border-radius: 100%;
  overflow: hidden;
  align-items: unset;
}
.avatar img {
  object-fit: cover;
}
</style>

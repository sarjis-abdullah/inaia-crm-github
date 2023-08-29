<template>
  <div class="vld-parent">
    <loading
        loader="dots"
        :active.sync="startProcess"
        :is-full-page="fullPage"
    />
    <!-- Header -->

    <!--<div class="header profile-header">-->
    <div class="header bg-gradient-info py-7 py-lg-8">

      <!--
      <div class="separator separator-bottom separator-skew zindex-100">
        <svg x="0" y="0" viewBox="0 0 2560 100" preserveAspectRatio="none" version="1.1"
             xmlns="http://www.w3.org/2000/svg">
          <polygon class="fill-secondary" points="2560 0 2560 100 0 100"></polygon>
        </svg>
      </div>
      -->

    </div>

    <!-- Page content -->
    <div class="container mt--4 mt-lg-8 pt-lg-6 mb-2">

      <div class="card card-profile shadow mt--300 ">
        <div class="px-4">
          <div class="row justify-content-center">
            <div class="col-lg-3 order-lg-2">
              <div class="card-profile-image">
                <div class="img-container">
                  <img :src="avatar" @error="refreshAvatar($event, gender)" class="rounded-circle" />
                  <div class="overlay" @click="clicked = true">
                    <div>
                      <i class="fa fa-camera" id="camera" @click.prevent.stop="clicked = true" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="text-center border-0 pt-7 pt-lg-4 pb-0 pb-md-4">
            <div class="d-flex justify-content-center justify-content-lg-end">
              <!-- <span class="float-left">
                  Language
              </span> -->
              <span class="float-left mr-4">
                    <select v-model="selectedLocale">
                        <option v-for="(i, idx) in locales" :key="idx" :value="i.value">{{i.text}}</option>
                    </select>
              </span>
              <nuxt-link to="/profile/edit" class="btn btn-sm btn-primary mr-4 ">{{ $t('edit_info') }}</nuxt-link>
              <nuxt-link to="/profile/reset-password" class="btn btn-sm btn-primary float-right">{{ $t('change_password') }}</nuxt-link>
            </div>
          </div>

          <div class="col-lg-4 order-lg-1">
            <!--
            <div class="card-profile-stats d-flex justify-content-center">
              <div>
                <span class="heading">22</span>
                <span class="description">Friends</span>
              </div>
              <div>
                <span class="heading">10</span>
                <span class="description">Photos</span>
              </div>
              <div>
                <span class="heading">89</span>
                <span class="description">Comments</span>
              </div>
            </div>
            -->
          </div>

          <div class="text-center mt-5 mt-md-4 mt-lg-3 pb-5">
            <h1>{{ name }}<!--<span class="font-weight-light" v-if="age">, {{ age }}</span>--></h1>
            <div class="h4 font-weight-300"><i class="ni ni-pin-3 mr-2"></i>{{ address }}</div>
            <!--
            <div class="h4 mt-4"><i class="ni business_briefcase-24 mr-2"></i>Solution Manager - Creative Tim Officer</div>
            <div><i class="ni education_hat mr-2"></i>University of Computer Science</div>
            -->
          </div>

          
          <div class="mt-5 py-5 border-top text-center">
            <div class="row justify-content-center">
              <div class="col-lg-9">

                <p>Your Apps and Services</p>

                <div class="row justify-content-center shortcuts">
                  <!-- <a v-if="accountingAccess" :href="accounting" @click.prevent.stop="goApp(accounting)" class="col-lg-3 shortcut-item"><span class="shortcut-media avatar avatar-xl bg-gradient-info"><i class="fas fa-calculator fa-2x"></i></span> <small>Accounting</small></a> -->
                  <a v-if="crmAccess" :href="crm" @click.prevent.stop="goApp(crm)" class="col-lg-3 shortcut-item"><span class="shortcut-media avatar avatar-xl bg-gradient-info"><i class="fas fa-users fa-2x"></i></span> <small>CRM</small></a>
                  <!-- <a v-if="goldAdminAccess" :href="golddinar" @click.prevent.stop="goApp(golddinar)" class="col-lg-3 shortcut-item"><span class="shortcut-media avatar avatar-xl bg-gradient-info"><i class="fas fa-coins fa-2x"></i></span> <small>Gold Dinar</small></a> -->
                  <!-- <a v-if="adminAccess" :href="admin" @click.prevent.stop="goApp(admin)" class="col-lg-3 shortcut-item"><span class="shortcut-media avatar avatar-xl bg-gradient-info"><i class="fas fa-cog fa-2x"></i></span> <small>{{ $t('admin_panel') }}</small></a> -->
                </div>

               </div>
            </div>
          </div>
         

          <modal :show.sync="clicked" :show-close="true" modal-classes="modal-secondary">
            <template #header>
              <h5 class="modal-title">Select Profile Photo</h5>
            </template>
            <Upload
        class="upload-demo"
        drag
        ref="upload"
        :auto-upload="false"
        accept=".png,.jpg,.jpeg"
        :limit="1"
        :multiple="false"
        :http-request="savePhoto"
        :disabled="startProcess"
        :on-change="onChange"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          Drop file here or <em>click to upload</em>
        </div>
        <div class="el-upload__tip" slot="tip">png,jpg and jpeg files</div>
      </Upload>
          <template #footer>
                <button type="button" class="btn btn-primary" @click.prevent.stop="submitUpload" :disabled="startProcess || !photo">Save photo</button>
                <button type="button" class="btn btn-link  ml-auto" @click.prevent.stop="clicked = !clicked;photo = null">Close</button>
            </template>
          </modal>
        </div>
      </div>

      <!--
      <div class="row mt-3">
        <div class="col-6">
            <router-link to="/services"><small>Service Dashboard</small></router-link>
        </div>
        <div class="col-6 text-right">
            <router-link to="/logout"><small>Logout</small></router-link>
        </div>
      </div>
      -->

    </div>
  </div>
</template>
<script>
import RefreshAvatarMixin from '~/mixins/RefreshAvatarMixin'
import { mapGetters } from "vuex"
import ProfilePhoto from '@/components/common/ProfilePhoto'
import Modal from '@/components/argon-core/Modal'
import { hasMaxAccess, avatar, anonymousUserAvatar, notifyError } from '@/helpers/auth'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
import { redirectPost } from "~/helpers/auth"
import { Upload } from "element-ui";
import { toBase64 } from '../../helpers/helpers'

export default {
    components: {
        ProfilePhoto,
        Modal,
        Loading,
        Upload
    },
    mixins: [
        RefreshAvatarMixin
    ],
    data() {
        return {
            clicked: false,
            startProcess: false,
            photo: null,
            selectedLocale: null,
            fullPage: true,
            isSubmitting:false
        }
    },
    computed: {
        ...mapGetters({
            locale: "auth/locale",
            locales: "auth/locales",
            auth: "auth/auth",
            loggedin: "auth/user",
            apps: "auth/apps",
            // contact: "clients/singleClientData"
        }),
        info() {
            // return this.contact && this.contact.customer
            return this.loggedin
        },
        gender() {
            if (this.loggedin && this.loggedin.person_data && this.loggedin.person_data.gender) {
                return this.loggedin.person_data.gender.toLowerCase()
            }
            return null
        },
        hasMaxAccess() {
            return this.info && hasMaxAccess(this.info.account)
        },
        accounting() {
            return process.env.entryPoints.accounting
        },
        accountingAccess() {
            return this.hasMaxAccess || (this.apps && this.apps.accounting_access)
        },
        crm() {
            return process.env.entryPoints.crm
        },
        crmAccess() {
            return this.hasMaxAccess || (this.apps && this.apps.crm_access)
        },
        admin() {
            return process.env.entryPoints.admin
        },
        adminAccess() {
            return this.hasMaxAccess || (this.apps && this.apps.adminpanel_access)
        },
        golddinar() {
            return process.env.entryPoints.golddinar
        },
        goldAdminAccess() {
            return this.hasMaxAccess || (this.apps && this.apps.goldadmin_access)
        },
        avatar() {
          if (this.info) {
                if (!this.info.avatar && this.info.person_data) {
                  let gender    = this.info.person_data.gender.toLowerCase()
                  return anonymousUserAvatar(gender);
                }
                else if (this.info.avatar) {
                   
                   return this.info.avatar
          }
          }
        },
        name() {
            let name    = ''
            if (this.info && this.info.name) {
                name    = this.info.name
            }
            if (this.info && this.info.person_data && this.info.person_data.surname) {
                name    += ' ' + this.info.person_data.surname
            }
            return name
        },
        address() {
            let city = (this.info && this.info.address && this.info.address.city) || '',
                country = (this.info && this.info.address && this.info.address.country && this.info.address.country.name_translation_key) || ''
            return city && country ? city + ', ' + country : city + '' + country
        },
        age() {
            let birthDate   = new Date((this.info && this.info.person_data && this.info.person_data.birthdate) || null),
                today       = new Date(),
                age         = today.getFullYear() - birthDate.getFullYear(),
                monthDiff   = today.getMonth() - birthDate.getMonth()
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--
            }
            return age
        }
    },
    watch: {
        selectedLocale: {
            handler(v) {
                if (this.locale !== v) {
                    this.$store.dispatch('auth/setLocale', {accountId: this.loggedin.account.id, locale: v, vm: this})
                    .then(res => {
                        this.$notify({type: 'success', timeout: 5000, message: 'Preferred language saved successfully!'})
                    })
                }
            }
        }
    },
    mounted() {
        if (!this.auth || !this.loggedin) {
            this.$router.push('/logout')
        }
        this.selectedLocale = this.locale
        this.$axios.setToken(`Bearer ${ this.auth }`)
        // this.initClientData()
    },
    methods: {
        avatar,
        anonymousUserAvatar,
        notifyError,
        redirectPost,

        goApp(appUrl) {
            // this.redirectPost(appUrl, { token: this.auth })
            this.$router.push(process.env.dashboardPath)
        },
        anonymousAvatar(e) {
            e.target.src    = this.anonymousUserAvatar(this.gender)
        },
        // initClientData() {
        //     return this.$store.dispatch("clients/clientDetailsData", this.loggedin.id)
        // },
        fileSelected(file) {
            // this.clicked = false
        },
        processStarted(fileName) {
            if (fileName) {
                this.startProcess   = true;
            } else {
                console.error('No file selected');
            }
        },
        onChange(file, fileList) {
          this.photo = file;
        },
        async savePhoto() {
            if (this.photo) {
              this.startProcess = true;
              let photodata = "";
              try{
                photodata = await toBase64(this.photo.raw);
              }
              catch(err){
                console.log(err);
                this.notifyError(err, this.$notify);
                this.startProcess = false;
                return;
              }
                this.$store.dispatch('clients/saveAvatar', {
                    id: this.loggedin.id,
                    avatar: photodata
                }).then(res => {
                    this.$notify({type: 'success', timeout: 5000, message: 'Profile picture saved successfully!'})
                    this.clicked = false;
                    this.photo = null;
                    // this.$store.dispatch('auth/fetchLoggedIn').then(res => {
                    // })
                }).catch(err => {
                    this.notifyError(err, this.$notify)
                }).finally(() => {
                    this.startProcess   = false
                })
            }
        },
        submitUpload() {
      this.$refs.upload.submit();
    },
    }

}
</script>

<style scoped>
  /*
  .profile-header {
    background-image: url(/img/theme/profile-cover.jpg);
    background-size: cover;
    background-position: center top;
    min-height: 580px;
  }
  */

 .img-container {
  cursor: pointer;
  position:relative;
  /* display:inline-block; */
}

.img-container .overlay {
  position:absolute;
  top:0;
  left:0;
  width:100%;
  height:100%;
  background:rgb(0,170,170);
  opacity:0;
  transition:opacity 250ms ease-in-out;
}
.img-container:hover .overlay {
  opacity:1;
}
/* .img-container .overlay {
  opacity:1;
} */
.overlay div {
  position:absolute;
  top:50%;
  left:50%;
  transform:translate(-50%,-50%);
  color:#fff;
}
.card-profile-image img {
    border: 0;
}
</style>

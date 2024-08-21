<template>
  <div class="card commentCard">

    <div class="card-body h-100 d-flex flex-column align-items-stretch">
      <h3 class="card-title mb-2" v-if="account">{{ $t('account_notes') }}</h3>
      <div class="message-area h-100" id="note-area">
        <div
          v-for="comment in comments"
          :key="comment.id"
          class="d-flex flex-column notebox p-2 mb-3"
          :id="'message-' + comment.id"
        >
          <h4 class="d-flex justify-content-between">
            <span>
              <span>{{ getCommentCreator(comment.created_by) }}</span>
              <span class="text-muted">
                <small>{{ new Date(comment.created_at).toLocaleDateString() + ' ' + new Date(comment.created_at).toLocaleTimeString() }}</small>
              </span>
            </span>
            <span v-if="comment.hasAbilityToDelete">
              <base-dropdown 
              title-classes="btn btn-sm mr-0"
              menu-on-right
              :has-toggle="false">
                  <template slot="title">
                      <i class="fas fa-ellipsis-v"></i>
                  </template>
                  <a href="#!" class="px-3" @click.prevent="openModal(comment)">
                      <span>{{ $t('delete') }}</span>
                  </a>
              </base-dropdown>
            </span>
          </h4>
          <pre class="comment m-0">{{ comment.comment }}</pre>
        </div>
        <LoadMore :currentPage="page" :lastPage="lastPage" :isLoading="isLoading" @click="loadMore"/>
      </div>
      <div class="write-area">
        <textarea
          type="text"
          class="chat-input mt-3"
          :placeholder="$t('message')"
          rows="3"
          v-model="note"
          v-if="hasEditAccess"
        >
        </textarea>
        <base-button
          type="primary"
          class="float-right mt-2"
          @click="sendNote"
          :disabled="isSending || !note || note == ''"
          v-if="hasEditAccess"
          >{{ $t('send') }}<i class="lnir lnir-arrow-right ml-2"></i></base-button>
      </div>
    </div>
    <modal
      :show.sync="showConfirmModal"
      headerClasses=""
      bodyClasses="pt-0"
      footerClasses="border-top bg-secondary"
      @close="closeModal"
      :allowOutSideClose="false"
    >
      <template slot="header">
          <h5 class="modal-title">{{ $t("delete_entry_confirmation") }}</h5>
          <span></span>
      </template>
      <template slot="footer">
          <base-button type="link" class="ml-auto" @click="closeModal()">
              {{ $t("cancel") }}
          </base-button>
          <base-button
              type="danger"
              @click="() => confirmDeleteMessage()"
              :disabled="isSubmitting"
          >
              {{ $t("delete") }}
          </base-button>
      </template>
    </modal>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import LoadMore from "@/components/common/Loader/LoadMore";
import { canEditCustomers } from '@/permissions';
import { apiErrorHandler } from '../../helpers/apiErrorHandler';
export default {
  props: {
    account: {
      type: Object,
      default: null,
    }
  },
  components: {
    LoadMore,
  },
  computed: {
    ...mapGetters({
      commentList: "comment/comments",
      authUser: "auth/user",
    }),
    clientName() {
      return (
        this.account.name +
        (this.account.person_data ? " " + this.account.person_data.surname : "")
      );
    },
    hasEditAccess(){
      return canEditCustomers();
    },
    authUserId(){
      if (this.authUser && this.authUser.account && this.authUser.account.id) {
          return this.authUser.account.id
      }
      return null
    },
    comments(){
      let hasAdminRole = false
      if (this.authUser && this.authUser.account && this.authUser.account.roles && this.authUser.account.roles.length) {
        const found = this.authUser.account.roles.find(item => {
          const {name_translation_key} = item
          if (name_translation_key == 'superadmin_role' || name_translation_key == 'admin_role') {
            return item
          }
        })
        if (found) {
          hasAdminRole = true
        }
      }
      
      return this.commentList.map(item => {
        return {
          ...item,
          hasAbilityToDelete: hasAdminRole ? true : this.checkAbilityToDelete(item)
        }
      })
    }
  },
  data() {
    return {
      page: 1,
      note: null,
      isSending: false,
      perPage: 10,
      lastPage: 1,
      isLoading: false,
      showConfirmModal: false,
      selectedComment: false,
      isSubmitting: false,
    };
  },
  mounted() {
    this.fetchComments();

    let noteArea = this.$el.querySelector("#note-area");
    noteArea.scrollTop = noteArea.scrollHeight;
  },
  methods: {
    fetchComments() {
      if (this.account) {
        let payload = "&page=" + this.page + "&per_page=" + this.perPage;
        payload += "&account_id=" + this.account.account.id;
        this.isLoading = true;
        this.$store
          .dispatch("comment/fetchList", payload)
          .then((res) => {
            this.page = res.meta.current_page;
            this.lastPage = res.meta.last_page;
          })
          .finally(() => {
            this.isLoading = false;
          });
      }
    },
    onClose() {
      this.displayModal = false;
      this.$emit("closed");
    },
    sendNote() {
      const data = {
        comment: this.note
      };
      if(this.account)
      {
        data.account_id = this.account.account.id;
      }
      this.isSending = true;
      this.$store
        .dispatch("comment/addComment", data)
        .then(() => {
          var lastNote = this.comments[0];
          /*var noteArea = this.$el.querySelector("#message-"+lastNote.id.toString());
                if(noteArea)
                    noteArea.scrollIntoView();*/
          var noteArea = this.$el.querySelector("#note-area");
          noteArea.scrollTo(0, 0);
          this.note = null;
        })
        .catch((err) => {
          apiErrorHandler(err,this.$notify);
        })
        .finally(() => {
          this.isSending = false;
        });
    },
    getCommentCreator(creator) {
      let name = "";
      if (creator && creator.contact) {
        name = creator.contact.name;
        if (creator.contact.person_data) {
          name += ' '+creator.contact.person_data.surname;
        }
      }
      return name;
    },
    loadMore(){
        this.page+=1;
        this.fetchComments();
    },
    checkAbilityToDelete(comment){
      const {created_by_id} = comment
      if (!created_by_id) {
          return false
      }

      return this.authUserId && this.authUserId == created_by_id
    },
    openModal(comment){
      this.showConfirmModal = true
      this.selectedComment = comment
    },
    closeModal(){
      this.showConfirmModal = false
      this.selectedComment = null
    },
    confirmDeleteMessage(){
      this.showConfirmModal = false
      this.isSubmitting = true
      this.$store.dispatch('comment/deleteComment', this.selectedComment.id)
      .then((result) => {
          this.$notify({type:'success',message:this.$t('entry_deleted_successfully'),duration:5000});
          this.selectedComment = null
      })
      .catch((err) => {
          this.$notify({type:'danger',message:this.$t('entry_deleted_failed'),duration:5000});
      })
      .finally(()=> {
        this.isSubmitting = false
      })
    }
  },
};
</script>

<style>
  .message-area {
    width: 100%;
    z-index: 1000;
    margin: 0 auto;
    overflow:scroll;
    overflow-x:hidden;
  }
  .write-area {
    margin: 0 auto;
    position: relative;
    bottom: 0;
    height: auto;
    width: 100%;
  }
  .chat-input {
    background-color: #f5f5f5;
    width: 100%;
    border: white 0 solid;
    padding: 10px;
  }
  .notebox {
    min-height: 50px;
    width: 100%;
    background-color: #dfeeff;
    border-radius: 10px;
  }
  .comment {
    font-family: 'Noah', 'Open Sans', sans-serif;
  }
  .commentCard {
    max-height: 400px;
  }
  .commentCard .card-body {
    overflow-y: scroll;
  }
  @media(min-width: 992px) {
    .commentCard {
      max-height: calc(100vh - 185px);
      position: sticky;
      top: 30px;
      left: 0;
    }
  }

</style>

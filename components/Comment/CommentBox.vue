<template>
  <modal
    :show.sync="displayModal"
    class="orderModal"
    headerClasses=""
    bodyClasses="pt-0"
    footerClasses="border-top bg-secondary"
    @close="onClose"
    :allowOutSideClose="false"
  >
    <template slot="header" class="pb-0">
      <h5 class="modal-title" v-if="account">{{ clientName }}</h5>
      <h5 class="modal-title" v-if="depot">{{ depot.name }}</h5>
      <span></span>
    </template>
    <div class="p-3">
      <div class="message-area" id="note-area">
        <div
          v-for="comment in comments"
          :key="comment.id"
          class="d-flex flex-column notebox p-2 mt-3"
          :id="'message-' + comment.id"
        >
          <h4>
            {{ getCommentCreator(comment.created_by) }}
            <span class="text-muted"
              ><small>{{ $d(new Date(comment.created_at)) }}</small></span
            >
          </h4>
          <div>{{ comment.comment }}</div>
        </div>
        <LoadMore :currentPage="page" :lastPage="lastPage" :isLoading="isLoading" @click="loadMore"/>
      </div>
     
        
      
      <div class="write-aria">
        <textarea
          type="text"
          class="chat-input mt-3"
          :placeholder="$t('type')"
          rows="5"
          v-model="note"
        >
        </textarea>
        <base-button
          type="primary"
          class="float-right mt-2"
          @click="sendNote"
          :disabled="isSending || !note || note == ''"
          >Send<span class="btn-inner--icon"
            ><i class="fa fa-arrow-right"></i></span
        ></base-button>
      </div>
    </div>
  </modal>
</template>
<script>
import { mapGetters } from "vuex";
import LoadMore from "@/components/common/Loader/LoadMore";
export default {
  props: {
    account: {
      type: Object,
      default: null,
    },
    depot: {
      type: Object,
      default: null,
    },
    displayModal: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    LoadMore,
  },
  computed: {
    ...mapGetters({
      comments: "comment/comments",
    }),
    clientName() {
      return (
        this.account.name +
        (this.account.person_data ? " " + this.account.person_data.surname : "")
      );
    },
  },
  data() {
    return {
      page: 1,
      note: null,
      isSending: false,
      perPage: 10,
      lastPage: 1,
      isLoading: false,
    };
  },
  mounted() {
    this.fetchComments();
  },
  methods: {
    fetchComments() {
      if (this.account || this.depot) {
        let payload = "&page=" + this.page + "&per_page=" + this.perPage;
        if (this.depot) {
          payload += "&depot_id=" + this.depot.id;
        } else if (this.account) {
          payload += "&account_id=" + this.account.account.id;
        }
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
      else if(this.depot){
        data.depot_id = this.depot.id;
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
          this.$notify({
            message: this.$t("cant_create_new_note"),
            type: "error",
            duration: 5000,
          });
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
          name += creator.contact.person_data.surname;
        }
      }
      return name;
    },
    loadMore(){
        this.page+=1;
        this.fetchComments();
    }
  },
};
</script>
<style scoped>
.message-area {
  overflow-x: hidden;
  height: 40vh;
  max-height: 40vh;
  width: 100%;
  z-index: 1000;
  margin: 0 auto;
  margin-bottom: 10px;
}
.write-aria {
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
</style>
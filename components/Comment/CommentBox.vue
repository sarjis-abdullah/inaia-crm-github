<template>
  <div
  >
    <div slot="header" class="pb-0">
      <h5 class="modal-title" v-if="account">{{ clientName }}</h5>
      <span></span>
    </div>
    <div class="px-3 pb-3">
      <div class="message-area" id="note-area">
        <div
          v-for="(comment, index) in comments"
          :key="comment.id"
          class="d-flex flex-column notebox p-2"
          :class="index != 0 && 'mt-3'"
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
        <LoadMore :currentPage="page" :lastPage="lastPage" :isLoading="isLoading" :showLinear="true" @click="loadMore"/>
      </div>



      <div class="write-area">
        <textarea
          type="text"
          class="chat-input"
          :placeholder="$t('type')"
          rows="1"
          v-model="note"
          v-if="hasEditAccess"
        >
        </textarea>
        <base-button
          type="primary"
          class="float-right mt-2"
          v-if="hasEditAccess"
          @click="sendNote"
          :disabled="isSending || !note || note == ''"
          >Send<span class="btn-inner--icon"
            ><i class="fa fa-arrow-right"></i></span
        ></base-button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import LoadMore from "@/components/common/Loader/LoadMore";
import LinearLoader from "@/components/common/Loader/LinearLoader";
import { canEditDepot } from '@/permissions';
import { apiErrorHandler } from '../../helpers/apiErrorHandler';
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
    LinearLoader
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
    hasEditAccess(){
        return canEditDepot();
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
  /* height: 40vh; */
  max-height: 15vh;
  width: 100%;
  z-index: 1000;
  margin: 0 auto;
  margin-bottom: 10px;
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
</style>

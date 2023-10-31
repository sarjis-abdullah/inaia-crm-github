<template>
  <div class="card commentCard">

    <div class="card-body h-100 d-flex flex-column align-items-stretch">
      <h3 class="card-title" v-if="account">{{ $t('account_notes') }}</h3>
      <div class="message-area h-100" id="note-area">
        <div
          v-for="comment in comments"
          :key="comment.id"
          class="d-flex flex-column notebox p-2 mb-3"
          :id="'message-' + comment.id"
        >
          <h4 class="d-flex justify-content-between">
            {{ getCommentCreator(comment.created_by) }}
            <span class="text-muted"
              ><small>{{ new Date(comment.created_at).toLocaleDateString() + ' ' + new Date(comment.created_at).toLocaleTimeString() }}</small></span
            >
          </h4>
          <pre class="comment m-0">{{ comment.comment }}</pre>
        </div>
        <LoadMore :currentPage="page" :lastPage="lastPage" :isLoading="isLoading" @click="loadMore"/>
      </div>
      <div class="write-aria">
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
      comments: "comment/comments",
    }),
    clientName() {
      return (
        this.account.name +
        (this.account.person_data ? " " + this.account.person_data.surname : "")
      );
    },
    hasEditAccess(){
      return canEditCustomers();
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
    }
  },
};
</script>

<style>
@media(min-width: 992px) {
  .commentCard {
    height: calc(100vh - 185px);
    position: sticky;
    top: 30px;
    left: 0;
  }
}
.message-area {
  overflow-x: hidden;
  width: 100%;
  z-index: 1000;
  margin: 0 auto;
  overflow:scroll;
  overflow-x:hidden;
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
.comment {
  font-family: 'Noah', 'Open Sans', sans-serif;
}
</style>

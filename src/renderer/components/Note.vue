<template>
  <div class="note">
    <div class="no-content" v-if="isEmpty">
      <div class="no-content-text">No content</div>
    </div>
    <div  v-if="!isEmpty">
      <div class="note-control" v-bind:class="{ disable: !isInbox }">
        <a href="javascript:;" class="note-list-open" id="note-list-open">Right</a>
        <div class="note-control--text-styles" style="display: none">
          <a href="" class="" data-type='{"name":"bold"}'> <i class="fa fa-bold"></i></a>
          <a href="" class="" data-type='{"name":"underline"}'> <i class="fa fa-list"></i></a>
        </div>

        <multiselect v-model="noteTagList" tag-placeholder="Add this as new tag"
                     placeholder="Search or add a tag"
                     label="tagName"
                     track-by="tagId"
                     :options="options"
                     :multiple="true"
                     :taggable="true"
                     :limit="3"
                     :max="10"
                     @tag="addTag"
                     @select="selectTag"
                     @remove="disconnectTagFromNote">
        </multiselect>

      </div>
      <div class="note--content">

        <div class="debug">
          <div class="socket-connect-status">
            Socket: {{connected}} -  $route.name : {{$route.name}} -  $route.path : {{$route.path}} -
            <br> selectedTagId: {{selectedTagId}} -  note.id}: {{note.id}}
          </div>

          <div class="test socket-area">
            <p>{{socketMessage}}</p>
            <p><a href="#" class="btn" @click="sendName">Send</a></p>
            <a href="#" @click="connect" class="btn">Connect</a>
          </div>

        </div>



        <div style="display: none">
          {{parentId}}
        </div>
        <div class="loading" v-if="isLoading">
          <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
        </div>
        <div class="area"
             v-bind:class="{ disable: !isInbox }">
          <editable class="title" v-if="isNoteCreatedStatus" :content="note.title" @update="note.title = $event"></editable>
          <editable class="text"  v-if="isNoteCreatedStatus" :content="note.text" @update="note.text = $event"></editable>
        </div>

      </div>
      <div class="note--footer">
        <div class="note-footer-deleting">
          <a href="#" class="note-delete-a" title="Delete" v-if="!isDeleting" @click="setDelete">
            <i class="icon icon-trash"></i> <span class="note-delete-hover"> {{moveToWhere}} </span>
          </a>
          <a  href="#" class="note-delete-a are-you" v-if="isDeleting"  @click="cancelDelete">
            <i class="icon icon-trash"></i> Move to:
          </a>
          <a href="#" class="note-delete-btn inbox" title="Move to inbox" v-if="isDeleting && $route.path == '/trash' " @click="moveTo">Inbox</a>
          <a href="#" class="note-delete-btn yes" title="Move to trash" v-if="isDeleting && $route.path != '/trash' " @click="moveTo">Trash</a>
          <a href="#" class="note-delete-btn yes" title="Delete" v-if="isDeleting && $route.path == '/trash' " @click="deleteNote">Delete</a>
          <a href="#" class="note-delete-btn no" title="Cancel" v-if="isDeleting" @click="cancelDelete">Cancel</a>
        </div>
        <div class="note-status">
          <a href="#" v-if="isUpdating" class="note-sync-status sync-started" title="Sync"><i class="icon icon-load"></i></a>
          <span title="Update Date">Last Update:  {{note.updatedDate}}  </span>
        </div>
    </div>
    </div>
  </div>
</template>
<script>

  import axios from 'axios';
  import editable from './Editable';
  import Multiselect from 'vue-multiselect';
  import allTags from '../mixins/allTags';


  export default {
    name: 'Note',
    components:  {editable, Multiselect},
    mixins: [allTags],
    props: ['id', 'selectedTagId'], // declare the props
    data() {
      return {
        note: {},
        isLoading: true,
        isDeleting: false,
        isInbox: false,
        isUpdating: false,
        isNoteCreatedStatus: false,
        isNoteCreating: false,
        isEmpty: false,
        moveToWhere: "What?: ",
        noteTagList: [],
        stompClient: null,
        connected: false,
        socketMessage: 'Socket default message',
      }
    },
    mounted() {

    },
    created() {
      if(this.$route.path == "/main" || this.$route.name == "Tags" ) {
        this.moveToWhere = "Delete"
        this.isInbox = true

        // Socket connection start

        setTimeout(function() {
          const token = JSON.parse(localStorage.getItem('token'))
          const socket = new SockJS('http://94.138.223.76:8080/ws?Authorization=' + token);
          this.connect(socket);
        }.bind(this),2000);

       // this.getAllTags();


      }
    },
    methods: {

      customLabel (option) {
        return option.length > 15
          ? option.substr(0, 15) + '...'
          : option
      },
      addTag (tagName) {
        tagName = this.customLabel(tagName)
        this.createTag(tagName, this.note.id)
        // this.getAllTags()
      },
      createTag(tagName, noteId) {
        let url = this.$serverURL +'/api/tags/save';
        const config = {
          headers: { 'Authorization': JSON.parse(localStorage.getItem('token'))},
        }
        let dataCreate = {
          name: tagName,
          noteId: noteId
        }
        axios.post(url, dataCreate, config)
          .then(response => this.createTagSuccessfull(response))
          .catch(() => this.createTagFailed())
      },

      createTagSuccessfull(response) {
        console.log("Tag save successfull", response)
        console.log(response.data.data.id, response.data.data.name)

        const tag = {
          tagName: response.data.data.name,
          tagId: response.data.data.id
        }

        this.options.push(tag)
        this.noteTagList.push(tag)

        this.getAllTags();

      },
      createTagFailed() {
        console.log("Tag create failed!")
      },
      disconnectTagFromNote(tag) {
        console.log("Disconnect: ", tag)
        let url = this.$serverURL +'/api/tags/deleteFromNote';
        const config = {
          headers: { 'Authorization': JSON.parse(localStorage.getItem('token'))},
        }
        let dataCreate = {
          id: tag.tagId,
          noteId: this.note.id
        }
        axios.post(url, dataCreate, config)
          .then(response => this.disconnectTagSuccessful(response))
          .catch(() => this.disconnectTagFailed())
      },
      disconnectTagSuccessful(response){
        console.log("Disconnect successful", response)

        this.getAllTags();

      },
      disconnectTagFailed(){
        console.log("Disconnect fail")
      },
      connectTagToNote(oldTag) {
        console.log("Connect: ", oldTag)
        let url = this.$serverURL +'/api/tags/addToNote';
        const config = {
          headers: { 'Authorization': JSON.parse(localStorage.getItem('token'))},
        }
        let dataCreate = {
          id: oldTag.tagId,
          noteId: this.note.id
        }
        axios.post(url, dataCreate, config)
          .then(response => this.connectTagSuccessful(response))
          .catch(() => this.connectTagFailed())
      },
      connectTagSuccessful(){
        console.log("Connect successful")
        this.getAllTags();
      },
      connectTagFailed(){
        console.log("Connect fail")
      },
      selectTag(oldTag){
        console.log("Selected: ", oldTag)

        // Eger seçilen tag, note'a ait tag listte yoksa
        // note ile tag i birleştiren fonksiyon çalışır.

        // myArray.filter(x => x.id === '45');

        console.log("Note tag list:", this.noteTagList)

        // console.log(this.noteTagList.filter(x => x.tagName === 'tagName') == 0)

        if(this.noteTagList.filter(x => x.tagName === 'tagName') == 0) {
          console.log("Bu tag, note a bağlanacak")
          this.connectTagToNote(oldTag)
        }

        //

      },
      getNote: function (id) {
        if(id > 0) {
          this.isLoading = true;
          this.isNoteCreatedStatus = false;

          const config = {
            headers: { 'Authorization': JSON.parse(localStorage.getItem('token'))},
          }

          let url = this.$serverURL +'/api/notes/' + id;

          axios.get(url, config)
            .then(response => this.noteGetSuccessfull(response))
            .then(response => this.isNoteCreatedStatus = true )
            .catch(error => this.noteGetFailed(error))
        } else if(id = -1) {
          console.log("EKRANA BİRŞEYLER YAZ ID -1")
          this.isLoading = false;
          this.isEmpty = true;
        }
      },

      noteGetSuccessfull(response) {
        this.isLoading = false;
        this.note = response.data.data;

        this.noteTagList = Object.keys(response.data.data.tagList).map((key) => {
          return {tagName: response.data.data.tagList[key].name, tagId: response.data.data.tagList[key].id }
        })

        // this.getAllTags();
        // this.updateOption();
        // console.log("Note başarı ile çekildi: ", this.note.title, this.note.text);
      },

      noteGetFailed (error) {
        console.log(error);
        console.log("Get failied, go to login...");
        // this.$router.push(this.$route.query.redirect || '/login');
      },

      createNote: function () {

        let url = this.$serverURL +'/api/notes/save';

        const config = {
          headers: { 'Authorization': JSON.parse(localStorage.getItem('token'))},
        }

        let dataCreate = {
          title: 'Untitled note',
          text: 'Sample note text here'
        }

        axios.post(url, dataCreate, config)
          .then(response => this.createNoteSuccessfull(response))
          .catch(() => this.createNoteFailed())

      },

      createNoteSuccessfull(response) {

        console.log("Yeni note oluşturuldu: ", response.data.data.id);

        // Notes list triggered
        this.$parent.getNotes(false, 'inbox');

        this.isNoteCreating = true;

        setTimeout(function() {
          console.log("Butonu aktif eder misin?");
          this.isNoteCreating = false;
        }.bind(this),2000);



        // note kısmı tekrar çekilecek.
        // hata var duruuyorum
        // this.id = response.data.data.id;

      },

      createNoteFailed() {
        console.log("New note create: Failed")
      },

      moveTo() {

        if(this.$route.path != "/trash" ) {

          // Eger toplam note sayısı 1 ise son notu'u silmemesi gerekiyor.
          if (this.$route.path == "/main" && this.$parent.getNotesCount() == 1 ) {
            console.log("Deleting operations stopped");
            alert("This is your last note, you cannot delete");
            this.cancelDelete();
            return false;
          }

          console.log("Silinen tag id:", this.selectedTagId)

          this.$parent.moveToNote("trash", this.note.id, this.selectedTagId)

          setTimeout(function() {
            // this.$parent.getNotes(true, 'inbox', this.selectedTagId);
          }.bind(this),100);


        }

        if (this.$route.path == "/trash") {
          this.$parent.moveToNote("inbox", this.note.id)
          this.$parent.getNotes(true, 'trash');
        }

        this.cancelDelete();

      },

      deleteNote() {
        // alert("Note deleted: " + this.id);

        this.$parent.setIsDeleting();

        let url = this.$serverURL +'/api/notes/' + this.id;

        const config = {
          headers: { 'Authorization': JSON.parse(localStorage.getItem('token'))},
        }

        axios.delete(url, config)
          .then(response => this.noteDeleteSuccessfull(response))
          .catch(() => this.noteDeleteFailed())

      },
      noteDeleteSuccessfull(){
        this.cancelDelete();
        alert("Note deleted!");
        // Notes list triggered
        this.$parent.getNotes(true, 'trash');
        this.$router.push(this.$route.query.redirect || '/trash');
      },
      noteDeleteFailed(){

      },
      setDelete(){
        this.isDeleting = true
      },
      cancelDelete(){
        this.isDeleting = false
      },
      updateNote(){

        this.isUpdating = true;

        let url = this.$serverURL +'/api/notes/update';

        const config = {
          headers: { 'Authorization': JSON.parse(localStorage.getItem('token'))},
        }

        const dataUpdate = {
          id: this.note.id,
          title: this.note.title,
          text: this.note.text
        }

        axios.post(url, dataUpdate, config)
          .then(response => this.updateNoteSuccessfull(response))
          .catch(() => this.updateNoteFailed())

      },
      updateNoteSuccessfull(){
        console.log("Updated!");

        // Notes list triggered
        this.$parent.getNotes(false, 'inbox');

        setTimeout(()=>{
          this.isUpdating = false
          this.$parent.disableNotes = false;
        },2000);

      },
      updateNoteFailed(){
        console.log("Failed!")
      },

      updateNoteSocket() {

        const dataUpdate = {
          id: this.note.id,
          title: this.note.title,
          text: this.note.text
        }

        console.log("Sokete gonderilecek veriler", dataUpdate)
        this.sendName() // socket send

        setTimeout(()=>{
          this.isUpdating = false
          this.$parent.disableNotes = false;
          this.$parent.getNotes(false, 'inbox', this.selectedTagId);
        },100);

      },

      triggerUpdate: function() {
        console.log("Update triggerd from editable");

        // Geçicçi olarak aşağı tarafı servis dışı bırakıyorum.
        // this.updateNote();

        // Socketi tetikliyoruz
        this.updateNoteSocket()

      },

      connect: function(socket) {

      this.stompClient = Stomp.over(socket);
      this.stompClient.connect({}, function(frame) {

        console.log('Connected: ' + frame);

        if(!this.connected) {

          this.stompClient.subscribe("/user/queue/errors", function(message) {
            alert("Error " + message.body);
          });

          this.stompClient.subscribe('/users/queue/reply', function(message) {
            this.socketMessage = message;
          }.bind(this));

          this.setConnected(true);

        }

      }.bind(this));
     },

      sendName: function() {
          this.stompClient.send("/app/sendNote", {}, JSON.stringify({
            'id' : this.note.id,
            'title' : this.note.title,
            'text' : this.note.text
          }))
      },

      setConnected: function(connect) {
        this.connected = connect;
      },

      triggerDisable: function() {
        this.$parent.disableNotes = true;
      },


    },
    computed: {
        parentId() {
          // console.log("Note Id changed, connect to axios and getId", this.id);
          if(this.id === null) {
            return false
          }
          this.getNote(this.id)
          console.log("parentid kontrol note");
          return this.id;
        }

    },

  };

</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style lang="scss">

  .multiselect {

    margin: 0 20px;


    .multiselect__select {
      height: 30px;
    }
    .multiselect__content-wrapper {

    }
  }
  .multiselect__tags {

    min-height: 30px;
    padding: 3px 40px 0 3px;

    .multiselect__single {
      font-size: 12px;
      line-height: 2;
      height: 24px;
      margin-bottom: 2px;
    }

    .multiselect__input {
      font-size: 12px;
      line-height: 1;
    }

    .multiselect__tag {
      background:#ececec;
      color:#999;
      margin: 0 2px 0 0;
      span {

      }
      .multiselect__tag-icon {
        &:hover {
          background: #e8e8e8;
        }
        &:after {
          color: #999;
        }
      }
    }
  }
  .multiselect__content-wrapper {
    .multiselect__content {

      .multiselect__element{

        .multiselect__option {
          font-size: 12px;
          min-height: 30px;
          line-height: 10px;

          &:after {
            min-height: 30px;
            line-height: 32px !important;
          }

          &.multiselect__option--highlight{
            background: #e8e8e8;
            color:#333;
            &:after {
              background: #e8e8e8;
              color:#333;
            }
          }
          &.multiselect__option--selected {

            &.multiselect__option--highlight{
              background: #e8e8e8;
              color:#333;

              &:after {
                background: #e8e8e8;
                color:#333;
              }
            }

          }

        }

      }

    }
  }




</style>

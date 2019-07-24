<template>
  <div class="main-right">



    <div class="note-list">

      <div class="no-content" v-if="notes.length == 0 && $route.path == '/trash' ">
        <div class="no-content-text">It's empty</div>
      </div>

      <div class="d" v-if="notes.length > 0">
        <div class="note-list-header">
          <a href="#" v-if="$route.path == '/main'" class="note-list-close" @click="setMainListVisible"></a>
          <div class="search">
            <div class="field">
              <input type="text" class="input-search" id="input-search" name="input-search" required="" v-model="search">
              <label for="input-search">{{searchTitle}}</label>
            </div>
            <!-- /field -->
          </div>
          <a href="#" v-if="$route.path == '/main'" class="new-note-btn" title="New note" @click="createNote"></a>
        </div>
        <div class="note-list-content"  v-bind:class="{ disable: disableNotes }">
          <ul class="note-list-ul" id="noteList">
            <div class="loading" v-if="isLoading">
              <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
            </div>
            <!-- @click="getNote(note)" -->
            <li class="note-list-info">
              <div class="alert danger" v-if="isDeleting">
                <p>Note is deleted...</p>
              </div>
              <div class="alert success" v-if="isMovingInbox">
                <p>Note is moved to inbox...</p>
              </div>
              <div class="alert success" v-if="isMovingTrash">
                <p>Note is moved to trash...</p>
              </div>
            </li>

            <li class="note-list-li"  v-for="note in filteredNotes" @click="getNote(note.id)" >
              <span class="note-list-title"> <span class="debug">{{ note.id }}  - </span>{{ note.title | textSlice(40) }} </span>
              <span class="note-list-prev"> {{ note.text }}  </span>
              <span class="note-list-date">{{ note.updatedDate }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <Note :id="selectedNoteId" :selectedTagId="tagId"></Note>
  </div>
</template>
<script>

  import axios from 'axios';
  import Note from "./Note";
  import { textSlice } from '../utils/filters';
  import allTags from '../mixins/allTags';

  export default {
    components: {Note},
    filters: { textSlice },
    mixins: [allTags],
    props: ['tagId', 'tagName'],
    name: 'Notes',
    data() {
      return {
        isLoading: true,
        isMovingInbox: false,
        isMovingTrash: false,
        isDeleting: false,
        notes: {},
        selectedNoteId: null, // default value
        search: '',
        disableNotes: false,
        isNoteCreating: false,
        title: ''
      }
    },

    mounted() {
      let sockjsScript = document.createElement('script')
      sockjsScript.setAttribute('src', 'https://cdnjs.cloudflare.com/ajax/libs/sockjs-client/1.1.5/sockjs.min.js')
      document.head.appendChild(sockjsScript)

      let stompScript = document.createElement('script')
      stompScript.setAttribute('src', 'https://cdnjs.cloudflare.com/ajax/libs/stomp.js/2.3.3/stomp.min.js')
      document.head.appendChild(stompScript)
    },
    created() {

      console.log("rn: ", this.$route.name);

      if(this.$route.path == "/main") {
        this.getNotes(true, 'inbox', null);
        this.title = "Notes"
      }

      else if (this.$route.path == "/trash") {
        this.getNotes(true, 'trash', null);
        this.title = "Trash"
      } else if (this.$route.name == "Tags") {
        this.getNotes(true, 'inbox', this.$route.params.id);
        console.log("Tags'e girdik: this.$route.params.id:", this.$route.params.id)
        console.log(this.$route);
        this.title = this.tagName
      } else {
        console.log("I am inside an another link", this.$route)
      }

    },
    methods: {

      getNotes: function(last, type, tagId) {

        const config = {
          headers: { 'Authorization': JSON.parse(localStorage.getItem('token'))},
          params: {
            'type': type,
            'page': 0,
            'size': 100,
            'sort': 'updatedDate,desc',
            'tagId': tagId
          }
        }

        let url = this.$serverURL +'/api/notes';

        axios.get(url, config)
          .then(response => {

            // console.log(response);
            this.isLoading = false;
            // console.log("notes: ", response.data);
            this.notes = response.data.data.content;

            if(this.notes.length < 1) {
              this.$router.push('/main')
              console.log(this.notes.length);
            }

            console.log("Başarılı bir şekilde notlar çekildi!:", this.notes )


            if(this.$route.name == "Tags") {
              this.title = this.tagName
            }

            if(last) {
              // this.selectedNoteId = this.lastAddedNote();
              this.selectedNoteId = this.lastUpdatedNote();
            }



          })
          .catch(error => this.getFailed(error));

      },

      getNote: function (noteId) {
        this.selectedNoteId = noteId
      },

      getFailed: function (error) {
        console.log("Get failied, go to login...")
        if (this.$route.path == "/trash") {
          this.$router.push(this.$route.query.redirect || '/main');
        } else {
          localStorage.removeItem('token');
          this.$router.push(this.$route.query.redirect || '/login');
        }
      },

      lastUpdatedNote() {
        // done: gelen ilk eleman.
        if(this.notes.length > 0) {
          return this.notes[0].id;
        } else {
          return -1;
        }
      },

      getNotesCount() {
        return this.notes.length
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
        this.getNotes(false, 'inbox');
        this.isNoteCreating = true;
        setTimeout(function() {
          console.log("Butonu aktif eder misin?");
          this.isNoteCreating = false;
        }.bind(this),2000);
        this.$router.push(this.$route.query.redirect || '/main');
      },

      createNoteFailed() {
        console.log("New note create: Failed")
      },

      moveToNote(to, id, selectedTagId) {
        console.log(to, id);
        let url = this.$serverURL +'/api/notes/move';
        const config = {
          headers: { 'Authorization': JSON.parse(localStorage.getItem('token'))},
          params:  {
            'type' : to,
            'id' : id
          }
        }

        axios.get(url, config)
          .then(response => this.moveNoteSuccessfull(response, selectedTagId))
          .catch(error => this.moveNoteFailed(error))
      },

      moveNoteSuccessfull(response, selectedTagId) {

        if(this.$route.path == "/main") {
          this.setIsMoving("trash");
          this.getNotes(true, 'inbox');
          this.$router.push(this.$route.query.redirect || '/main');
        }

        if (this.$route.path == "/trash") {
          this.setIsMoving("inbox");
          this.getNotes(true, 'trash');
          this.$router.push(this.$route.query.redirect || '/trash');
        }

        if(selectedTagId) {
          this.getNotes(true, 'inbox', selectedTagId);
        }


        setTimeout(function() {
          // this.$parent.getNotes(true, 'inbox', this.selectedTagId);
          this.getAllTags();
        }.bind(this),0);

      },

      moveNoteFailed(error) {
        console.log("error", error.response);
      },

      setIsMoving(name) {
        if(name === "inbox") {
          this.isMovingInbox = true;
        }
        if(name === "trash") {
          this.isMovingTrash = true;
        }
        setTimeout(function() {
          this.isMovingInbox = false;
          this.isMovingTrash = false;
        }.bind(this),4000);
      },

      setIsDeleting() {
        this.isDeleting = true;
        setTimeout(function() {
          this.isDeleting = false;
        }.bind(this),2000);
      },

      setMainListVisible() {
        console.log(this.$parent)
        return this.$parent.setMainListVisible();
      },

    },
    computed: {

      filteredNotes() {
        if(this.notes.length >= 1) {
          return this.notes.filter(post => {
            return post.title.toLowerCase().includes(this.search.toLowerCase())
          })
        }
      },

      searchTitle() {
        return this.title
      }
    },

    watch: {
      '$route' (to, from) {
       this.tagId = to.params.id;
       this.getNotes(true, 'inbox', to.params.id);
      }
    }

  }

</script>
<style lang="scss">

</style>

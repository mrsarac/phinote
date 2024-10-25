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
          </div>
          <a href="#" v-if="$route.path == '/main'" class="new-note-btn" title="New note" @click="createNote"></a>
        </div>
        <div class="note-list-content"  v-bind:class="{ disable: disableNotes }">
          <ul class="note-list-ul" id="noteList">
            <div class="loading" v-if="isLoading">
              <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
            </div>
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

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import axios from 'axios';
import Note from "./Note";
import { textSlice } from '../utils/filters';
import allTags from '../mixins/allTags';

export default defineComponent({
  components: { Note },
  filters: { textSlice },
  mixins: [allTags],
  props: ['tagId', 'tagName'],
  name: 'Notes',
  setup(props) {
    const isLoading = ref(true);
    const isMovingInbox = ref(false);
    const isMovingTrash = ref(false);
    const isDeleting = ref(false);
    const notes = ref([]);
    const selectedNoteId = ref(null);
    const search = ref('');
    const disableNotes = ref(false);
    const isNoteCreating = ref(false);
    const title = ref('');

    const getNotes = async (last: boolean, type: string, tagId: number | null) => {
      const config = {
        headers: { 'Authorization': JSON.parse(localStorage.getItem('token') || '') },
        params: {
          'type': type,
          'page': 0,
          'size': 100,
          'sort': 'updatedDate,desc',
          'tagId': tagId
        }
      };

      const url = `${import.meta.env.VITE_SERVER_URL}/api/notes`;

      try {
        const response = await axios.get(url, config);
        isLoading.value = false;
        notes.value = response.data.data.content;

        if (notes.value.length < 1) {
          this.$router.push('/main');
        }

        if (this.$route.name == "Tags") {
          title.value = props.tagName;
        }

        if (last) {
          selectedNoteId.value = lastUpdatedNote();
        }
      } catch (error) {
        getFailed(error);
      }
    };

    const getNote = (noteId: number) => {
      selectedNoteId.value = noteId;
    };

    const getFailed = (error: any) => {
      if (this.$route.path == "/trash") {
        this.$router.push(this.$route.query.redirect || '/main');
      } else {
        localStorage.removeItem('token');
        this.$router.push(this.$route.query.redirect || '/login');
      }
    };

    const lastUpdatedNote = () => {
      if (notes.value.length > 0) {
        return notes.value[0].id;
      } else {
        return -1;
      }
    };

    const createNote = async () => {
      const url = `${import.meta.env.VITE_SERVER_URL}/api/notes/save`;
      const config = {
        headers: { 'Authorization': JSON.parse(localStorage.getItem('token') || '') }
      };
      const dataCreate = {
        title: 'Untitled note',
        text: 'Sample note text here'
      };

      try {
        const response = await axios.post(url, dataCreate, config);
        createNoteSuccessfull(response);
      } catch (error) {
        createNoteFailed();
      }
    };

    const createNoteSuccessfull = (response: any) => {
      getNotes(false, 'inbox');
      isNoteCreating.value = true;
      setTimeout(() => {
        isNoteCreating.value = false;
      }, 2000);
      this.$router.push(this.$route.query.redirect || '/main');
    };

    const createNoteFailed = () => {
      console.log("New note create: Failed");
    };

    const moveToNote = async (to: string, id: number, selectedTagId: number | null) => {
      const url = `${import.meta.env.VITE_SERVER_URL}/api/notes/move`;
      const config = {
        headers: { 'Authorization': JSON.parse(localStorage.getItem('token') || '') },
        params: {
          'type': to,
          'id': id
        }
      };

      try {
        const response = await axios.get(url, config);
        moveNoteSuccessfull(response, selectedTagId);
      } catch (error) {
        moveNoteFailed(error);
      }
    };

    const moveNoteSuccessfull = (response: any, selectedTagId: number | null) => {
      if (this.$route.path == "/main") {
        setIsMoving("trash");
        getNotes(true, 'inbox');
        this.$router.push(this.$route.query.redirect || '/main');
      }

      if (this.$route.path == "/trash") {
        setIsMoving("inbox");
        getNotes(true, 'trash');
        this.$router.push(this.$route.query.redirect || '/trash');
      }

      if (selectedTagId) {
        getNotes(true, 'inbox', selectedTagId);
      }

      setTimeout(() => {
        getAllTags();
      }, 0);
    };

    const moveNoteFailed = (error: any) => {
      console.log("error", error.response);
    };

    const setIsMoving = (name: string) => {
      if (name === "inbox") {
        isMovingInbox.value = true;
      }
      if (name === "trash") {
        isMovingTrash.value = true;
      }
      setTimeout(() => {
        isMovingInbox.value = false;
        isMovingTrash.value = false;
      }, 4000);
    };

    const setIsDeleting = () => {
      isDeleting.value = true;
      setTimeout(() => {
        isDeleting.value = false;
      }, 2000);
    };

    const setMainListVisible = () => {
      return this.$parent.setMainListVisible();
    };

    onMounted(() => {
      if (this.$route.path == "/main") {
        getNotes(true, 'inbox', null);
        title.value = "Notes";
      } else if (this.$route.path == "/trash") {
        getNotes(true, 'trash', null);
        title.value = "Trash";
      } else if (this.$route.name == "Tags") {
        getNotes(true, 'inbox', this.$route.params.id);
        title.value = props.tagName;
      }
    });

    return {
      isLoading,
      isMovingInbox,
      isMovingTrash,
      isDeleting,
      notes,
      selectedNoteId,
      search,
      disableNotes,
      isNoteCreating,
      title,
      getNotes,
      getNote,
      getFailed,
      lastUpdatedNote,
      createNote,
      createNoteSuccessfull,
      createNoteFailed,
      moveToNote,
      moveNoteSuccessfull,
      moveNoteFailed,
      setIsMoving,
      setIsDeleting,
      setMainListVisible
    };
  },
  computed: {
    filteredNotes() {
      if (this.notes.length >= 1) {
        return this.notes.filter(post => {
          return post.title.toLowerCase().includes(this.search.toLowerCase());
        });
      }
    },
    searchTitle() {
      return this.title;
    }
  },
  watch: {
    '$route'(to, from) {
      this.tagId = to.params.id;
      this.getNotes(true, 'inbox', to.params.id);
    }
  }
});
</script>

<style lang="scss">
</style>

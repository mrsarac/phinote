<template>
  <div class="note">
    <div class="no-content" v-if="isEmpty">
      <div class="no-content-text">No content</div>
    </div>
    <div v-if="!isEmpty">
      <div class="note-control" :class="{ disable: !isInbox }">
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
        <div class="area" :class="{ disable: !isInbox }">
          <editable class="title" v-if="isNoteCreatedStatus" :content="note.title" @update="note.title = $event"></editable>
          <editable class="text" v-if="isNoteCreatedStatus" :content="note.text" @update="note.text = $event"></editable>
        </div>

      </div>
      <div class="note--footer">
        <div class="note-footer-deleting">
          <a href="#" class="note-delete-a" title="Delete" v-if="!isDeleting" @click="setDelete">
            <i class="icon icon-trash"></i> <span class="note-delete-hover"> {{moveToWhere}} </span>
          </a>
          <a href="#" class="note-delete-a are-you" v-if="isDeleting" @click="cancelDelete">
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

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import axios from 'axios';
import editable from './Editable';
import Multiselect from 'vue-multiselect';
import allTags from '../mixins/allTags';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

export default defineComponent({
  name: 'Note',
  components: { editable, Multiselect },
  mixins: [allTags],
  props: {
    id: {
      type: Number,
      required: true
    },
    selectedTagId: {
      type: Number,
      required: false
    }
  },
  setup(props) {
    const note = ref<any>({});
    const isLoading = ref<boolean>(true);
    const isDeleting = ref<boolean>(false);
    const isInbox = ref<boolean>(false);
    const isUpdating = ref<boolean>(false);
    const isNoteCreatedStatus = ref<boolean>(false);
    const isNoteCreating = ref<boolean>(false);
    const isEmpty = ref<boolean>(false);
    const moveToWhere = ref<string>("What?: ");
    const noteTagList = ref<any[]>([]);
    const stompClient = ref<any>(null);
    const connected = ref<boolean>(false);
    const socketMessage = ref<string>('Socket default message');

    const customLabel = (option: string) => {
      return option.length > 15 ? option.substr(0, 15) + '...' : option;
    };

    const addTag = (tagName: string) => {
      tagName = customLabel(tagName);
      createTag(tagName, note.value.id);
    };

    const createTag = async (tagName: string, noteId: number) => {
      const url = `${import.meta.env.VITE_SERVER_URL}/api/tags/save`;
      const config = {
        headers: { 'Authorization': JSON.parse(localStorage.getItem('token') || '') }
      };
      const dataCreate = {
        name: tagName,
        noteId: noteId
      };
      try {
        const response = await axios.post(url, dataCreate, config);
        createTagSuccessfull(response);
      } catch (error) {
        createTagFailed();
      }
    };

    const createTagSuccessfull = (response: any) => {
      const tag = {
        tagName: response.data.data.name,
        tagId: response.data.data.id
      };
      options.value.push(tag);
      noteTagList.value.push(tag);
      getAllTags();
    };

    const createTagFailed = () => {
      console.log("Tag create failed!");
    };

    const disconnectTagFromNote = async (tag: any) => {
      const url = `${import.meta.env.VITE_SERVER_URL}/api/tags/deleteFromNote`;
      const config = {
        headers: { 'Authorization': JSON.parse(localStorage.getItem('token') || '') }
      };
      const dataCreate = {
        id: tag.tagId,
        noteId: note.value.id
      };
      try {
        const response = await axios.post(url, dataCreate, config);
        disconnectTagSuccessful(response);
      } catch (error) {
        disconnectTagFailed();
      }
    };

    const disconnectTagSuccessful = (response: any) => {
      getAllTags();
    };

    const disconnectTagFailed = () => {
      console.log("Disconnect fail");
    };

    const connectTagToNote = async (oldTag: any) => {
      const url = `${import.meta.env.VITE_SERVER_URL}/api/tags/addToNote`;
      const config = {
        headers: { 'Authorization': JSON.parse(localStorage.getItem('token') || '') }
      };
      const dataCreate = {
        id: oldTag.tagId,
        noteId: note.value.id
      };
      try {
        const response = await axios.post(url, dataCreate, config);
        connectTagSuccessful(response);
      } catch (error) {
        connectTagFailed();
      }
    };

    const connectTagSuccessful = (response: any) => {
      getAllTags();
    };

    const connectTagFailed = () => {
      console.log("Connect fail");
    };

    const selectTag = (oldTag: any) => {
      if (noteTagList.value.filter(x => x.tagName === oldTag.tagName).length === 0) {
        connectTagToNote(oldTag);
      }
    };

    const getNote = async (id: number) => {
      if (id > 0) {
        isLoading.value = true;
        isNoteCreatedStatus.value = false;
        const config = {
          headers: { 'Authorization': JSON.parse(localStorage.getItem('token') || '') }
        };
        const url = `${import.meta.env.VITE_SERVER_URL}/api/notes/${id}`;
        try {
          const response = await axios.get(url, config);
          noteGetSuccessfull(response);
          isNoteCreatedStatus.value = true;
        } catch (error) {
          noteGetFailed(error);
        }
      } else if (id === -1) {
        isLoading.value = false;
        isEmpty.value = true;
      }
    };

    const noteGetSuccessfull = (response: any) => {
      isLoading.value = false;
      note.value = response.data.data;
      noteTagList.value = Object.keys(response.data.data.tagList).map((key) => {
        return { tagName: response.data.data.tagList[key].name, tagId: response.data.data.tagList[key].id };
      });
    };

    const noteGetFailed = (error: any) => {
      console.log("Get failed, go to login...");
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
    };

    const createNoteFailed = () => {
      console.log("New note create: Failed");
    };

    const moveTo = () => {
      if (props.selectedTagId !== undefined) {
        if (props.selectedTagId !== null) {
          moveToNote("trash", note.value.id, props.selectedTagId);
        } else {
          moveToNote("trash", note.value.id);
        }
      } else {
        moveToNote("trash", note.value.id);
      }
      cancelDelete();
    };

    const deleteNote = async () => {
      setIsDeleting();
      const url = `${import.meta.env.VITE_SERVER_URL}/api/notes/${props.id}`;
      const config = {
        headers: { 'Authorization': JSON.parse(localStorage.getItem('token') || '') }
      };
      try {
        const response = await axios.delete(url, config);
        noteDeleteSuccessfull(response);
      } catch (error) {
        noteDeleteFailed();
      }
    };

    const noteDeleteSuccessfull = (response: any) => {
      cancelDelete();
      alert("Note deleted!");
      getNotes(true, 'trash');
    };

    const noteDeleteFailed = () => {
      console.log("Note delete failed");
    };

    const setDelete = () => {
      isDeleting.value = true;
    };

    const cancelDelete = () => {
      isDeleting.value = false;
    };

    const updateNote = async () => {
      isUpdating.value = true;
      const url = `${import.meta.env.VITE_SERVER_URL}/api/notes/update`;
      const config = {
        headers: { 'Authorization': JSON.parse(localStorage.getItem('token') || '') }
      };
      const dataUpdate = {
        id: note.value.id,
        title: note.value.title,
        text: note.value.text
      };
      try {
        const response = await axios.post(url, dataUpdate, config);
        updateNoteSuccessfull(response);
      } catch (error) {
        updateNoteFailed();
      }
    };

    const updateNoteSuccessfull = (response: any) => {
      getNotes(false, 'inbox');
      setTimeout(() => {
        isUpdating.value = false;
        disableNotes.value = false;
      }, 2000);
    };

    const updateNoteFailed = () => {
      console.log("Update failed!");
    };

    const updateNoteSocket = () => {
      const dataUpdate = {
        id: note.value.id,
        title: note.value.title,
        text: note.value.text
      };
      sendName();
      setTimeout(() => {
        isUpdating.value = false;
        disableNotes.value = false;
        getNotes(false, 'inbox', props.selectedTagId);
      }, 100);
    };

    const triggerUpdate = () => {
      updateNoteSocket();
    };

    const connect = (socket: any) => {
      stompClient.value = Stomp.over(socket);
      stompClient.value.connect({}, (frame: any) => {
        if (!connected.value) {
          stompClient.value.subscribe("/user/queue/errors", (message: any) => {
            alert("Error " + message.body);
          });
          stompClient.value.subscribe('/users/queue/reply', (message: any) => {
            socketMessage.value = message.body;
          });
          setConnected(true);
        }
      });
    };

    const sendName = () => {
      stompClient.value.send("/app/sendNote", {}, JSON.stringify({
        'id': note.value.id,
        'title': note.value.title,
        'text': note.value.text
      }));
    };

    const setConnected = (connect: boolean) => {
      connected.value = connect;
    };

    const triggerDisable = () => {
      disableNotes.value = true;
    };

    onMounted(() => {
      if (props.id !== null) {
        getNote(props.id);
      }
      if (props.selectedTagId !== undefined) {
        if (props.selectedTagId !== null) {
          getNotes(true, 'inbox', props.selectedTagId);
        }
      }
    });

    return {
      note,
      isLoading,
      isDeleting,
      isInbox,
      isUpdating,
      isNoteCreatedStatus,
      isNoteCreating,
      isEmpty,
      moveToWhere,
      noteTagList,
      stompClient,
      connected,
      socketMessage,
      customLabel,
      addTag,
      createTag,
      createTagSuccessfull,
      createTagFailed,
      disconnectTagFromNote,
      disconnectTagSuccessful,
      disconnectTagFailed,
      connectTagToNote,
      connectTagSuccessful,
      connectTagFailed,
      selectTag,
      getNote,
      noteGetSuccessfull,
      noteGetFailed,
      createNote,
      createNoteSuccessfull,
      createNoteFailed,
      moveTo,
      deleteNote,
      noteDeleteSuccessfull,
      noteDeleteFailed,
      setDelete,
      cancelDelete,
      updateNote,
      updateNoteSuccessfull,
      updateNoteFailed,
      updateNoteSocket,
      triggerUpdate,
      connect,
      sendName,
      setConnected,
      triggerDisable
    };
  }
});
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
      background: #ececec;
      color: #999;
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
      .multiselect__element {
        .multiselect__option {
          font-size: 12px;
          min-height: 30px;
          line-height: 10px;

          &:after {
            min-height: 30px;
            line-height: 32px !important;
          }

          &.multiselect__option--highlight {
            background: #e8e8e8;
            color: #333;
            &:after {
              background: #e8e8e8;
              color: #333;
            }
          }
          &.multiselect__option--selected {
            &.multiselect__option--highlight {
              background: #e8e8e8;
              color: #333;

              &:after {
                background: #e8e8e8;
                color: #333;
              }
            }
          }
        }
      }
    }
  }
</style>

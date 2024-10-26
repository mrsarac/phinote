<template>
  <div class="main-right">
    <div class="todo-list">
      <div class="todo-list-header">
        <a href="#" class="todo-list-close" id="todo-list-close"></a>
        <div class="search">
          <div class="field">
            <input type="text" class="input-search" id="input-search" name="input-search" required="" v-model="search" >
            <label for="input-search" >Todo</label>
          </div>
          <!-- /field -->
        </div>
        <a href="#" class="new-todo-btn" @click="addTodo"><span class="icon icon-new-note"></span></a>
      </div>
      <div class="todo-list-content" v-bind:class="{ disable: isDisabled}">
        <ul class="todo-list-ul" id="noteList">
          <li class="todo-list-li"  v-for="(todo, index) in filteredTodos"  v-bind:class="{ completed: todo.completed }" @click="getTodo(todo)">
            <span class="check">
              <input v-bind:id="todo.id" type="checkbox" v-model="todo.completed" @click="saveTodo(todo.id)" />
              <label v-bind:for="todo.id" >
                <span class="box"><i class="icon icon-check"></i></span>
              </label>
            </span>
            <span class="todo-list-title">{{ todo.title | textSlice(34)}} </span>
            <span class="todo-delete" @click="deleteTodo(index)" title="Delete todo"><i class="icon icon-trash"></i></span>
          </li>
        </ul>
        <div class="todo-total-count">
          <span>Total: {{totalCount}}</span>


          <a href="#" class="completed" v-if="totalCompleted > 0" @click="clearCompleted">Clear Completed ({{totalCompleted}})</a>
        </div>
      </div>
    </div>
    <Todo :data="selectedTodo"></Todo>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import axios from 'axios';
import Todo from "./Todo";
import { textSlice } from '../utils/filters';

export default defineComponent({
  components: { Todo },
  filters: { textSlice },
  name: 'Todos',
  setup() {
    const isLoading = ref(true);
    const selectedTodoId = ref<number | null>(null);
    const selectedTodo = ref<any>({});
    const search = ref<string>('');
    const todos = ref<any[]>([]);
    const isDisabled = ref<boolean>(false);

    const getTodos = () => {
      isLoading.value = false;
      const url = '/static/todos.json';

      if (localStorage.getItem('todos')) {
        todosGetLocalStorage();
      } else {
        axios.get(url)
          .then(response => todosGetSuccessfull(response))
          .catch(() => todosGetFailed());
      }
    };

    const todosGetSuccessfull = (response: any) => {
      isLoading.value = false;
      todos.value = response.data.todos;
      localStorage.setItem('todos', JSON.stringify(response.data.todos));
    };

    const todosGetFailed = () => {
      console.log("Fail");
    };

    const todosGetLocalStorage = () => {
      todos.value = JSON.parse(localStorage.getItem('todos') || '[]');
    };

    const saveTodo = (id: number) => {
      setTimeout(() => {
        localStorage.setItem('todos', JSON.stringify(todos.value));
      }, 0);
    };

    const addTodo = () => {
      const todosIdArray = todos.value.length === 0 ? [0] : todos.value.map((todo: any) => todo.id);
      const largestId = Math.max(...todosIdArray);

      todos.value.push({
        id: largestId + 1,
        title: "New todo",
        text: "Awesome Todo detail",
        completed: false,
      });

      saveTodo();
    };

    const deleteTodo = (index: number) => {
      if (todos.value.length > 1) {
        todos.value.splice(index, 1);
        saveTodo();
        setTimeout(() => {
          getTodo(todos.value[0]);
        }, 0);
      } else {
        alert("You cannot delete the last todo item");
      }
    };

    const getTodo = (todo: any) => {
      selectedTodo.value = todo;
    };

    const getFailed = () => {
      console.log("Get failed, go to login...");
      localStorage.removeItem('token');
      localStorage.removeItem('todos');
    };

    const clearCompleted = () => {
      todos.value = todos.value.filter(todo => !todo.completed);

      if (todos.value.length === 0) {
        addTodo();
      }

      getTodo(todos.value[0]);
      saveTodo();
    };

    onMounted(() => {
      getTodos();
      setTimeout(() => {
        getTodo(todos.value[0]);
      }, 100);
    });

    const filteredTodos = computed(() => {
      return todos.value.filter(todo => todo.title.toLowerCase().includes(search.value.toLowerCase()));
    });

    const totalCount = computed(() => {
      return filteredTodos.value.length;
    });

    const totalCompleted = computed(() => {
      return todos.value.filter(todo => todo.completed).length;
    });

    return {
      isLoading,
      selectedTodoId,
      selectedTodo,
      search,
      todos,
      isDisabled,
      getTodos,
      todosGetSuccessfull,
      todosGetFailed,
      todosGetLocalStorage,
      saveTodo,
      addTodo,
      deleteTodo,
      getTodo,
      getFailed,
      clearCompleted,
      filteredTodos,
      totalCount,
      totalCompleted
    };
  }
});
</script>

<style lang="scss">
</style>

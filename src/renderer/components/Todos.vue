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
<script>

  import axios from 'axios';
  import Todo from "./Todo";
  import {textSlice} from '../utils/filters';

  export default {
    components: {Todo},
    filters: { textSlice },
    name: 'Todos',
    data() {
      return {
        isLoading: true,
        selectedTodoId: null, // default value
        selectedTodo: {}, // default value
        search: '',
        todos: {},
        isDisabled: false,
      }
    },
    mounted() {

    },
    created() {
      this.getTodos();

      setTimeout(function() {
        this.getTodo(this.todos[0]);
      }.bind(this),100);

    },
    methods: {

      getTodos: function() {

        this.isLoading = false;
        let url = '/static/todos.json';

        if ( localStorage.getItem('todos') ) {
          this.todosGetLocalStorage();
        } else {
          // localStorage has not todos, we are loading samples
          axios.get(url)
            .then(response => this.todosGetSuccessfull(response))
            .catch(() => this.todosGetFailed())
        }


      },
      todosGetSuccessfull(response) {
        // console.log("Success");
        this.isLoading = false;
        this.todos = response.data.todos;
        localStorage.setItem('todos', JSON.stringify(response.data.todos));
      },

      todosGetFailed() {
        console.log("Fail");
      },

      todosGetLocalStorage() {
        //  Using local storega
        this.todos = JSON.parse(localStorage.getItem('todos'));
      },

      saveTodo(id) {
        // writing new data
        setTimeout(function() {
          localStorage.setItem('todos', JSON.stringify(this.todos));
        }.bind(this),0);
      },

      addTodo() {
        // Creating an numbers array
        let todosIdArray = new Array;

        if(this.todos.length === 0) {
          todosIdArray = [0];
        }

        for(var o in this.todos) {
          todosIdArray.push(this.todos[o].id);
        }

        let largestId = Math.max.apply(Math, todosIdArray)

        this.todos.push({
          id: largestId+1,
          title: "New todo" ,
          text: "Awesome Todo detail",
          completed: false,
        });

        this.saveTodo();

      },

      deleteTodo(id) {
        if (this.todos.length > 1) {
          this.$delete(this.todos, id);
          this.saveTodo();

        setTimeout(function() {
            this.getTodo(this.todos[0]);
          }.bind(this),0);

        } else {
          alert("You connot delete last todo item");
        }
      },

      getTodo: function (todo) {
          this.selectedTodo = todo
      },

      getFailed: function () {
        console.log("Get failied, go to login...");
        localStorage.removeItem('token');
        localStorage.removeItem('todos');
        // localStorage.clear();
        // this.$router.push(this.$route.query.redirect || '/login');
      },

      clearCompleted: function () {

        this.todos = this.todos.filter(function (e){
          return e.completed !== true;
        })

        if(this.todos.length === 0) {
          this.addTodo();
        }

        this.getTodo(this.todos[0]);

        this.saveTodo();

      }

    },
    computed: {
      filteredTodos() {
        if(this.todos.length >= 1) {
          return this.todos.filter(post => {
            return post.title.toLowerCase().includes(this.search.toLowerCase())
          })
        }
      },
      totalCount() {
        if(this.todos.length >= 1) {
          return this.filteredTodos.length
        }
      },

      totalCompleted() {
        let todosComletedCount = 0;
        for(var o in this.todos) {
          if(this.todos[o].completed === true) {
            todosComletedCount++;
          }
        }
        return todosComletedCount
      }
    },

  }

</script>
<style lang="scss">

</style>

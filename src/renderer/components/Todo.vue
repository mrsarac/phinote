<template>
  <div class="note">
    <div class="note-control">
      <a href="javascript:;" class="note-list-open" id="note-list-open">Right</a>
    </div>
    <div class="note--content">
      <div class="area">
        <div style="display: none">{{parentTodo}}</div>
        <editable class="title" v-if="isTodoCreatedStatus" :content="todo.title" @update="todo.title = $event"></editable>
        <editable class="text" v-if="isTodoCreatedStatus" :content="todo.text" @update="todo.text = $event"></editable>
      </div>
    </div>
  </div>
</template>
<script>
  import editable from './Editable';

  export default {
    name: 'Todo',
    components: {editable},
    props: ['data'], // declare the props
    data() {
      return {
        todos: {},
        todo: {},
        isTodoCreatedStatus: false,
        todoId: null,
      }
    },
    created() {
       if(this.todo.length <= 0) {
         this.todo.title = "Hello";
         this.todo.text = "World";
       }
    },
    methods: {

      gtd: function() {
        this.isTodoCreatedStatus = false;
        this.todo = this.data;
        setTimeout(function() {
          // Activate editables
          this.isTodoCreatedStatus = true
        }.bind(this),0);

      },

      triggerUpdate: function() {
        // "Update triggerd from editable
        this.updateTodo();
      },

      triggerDisable: function() {
        this.$parent.isDisabled = true;
      },

      updateTodo: function () {
        this.todos = JSON.parse(localStorage.getItem('todos'));

        this.todos.find(v => v.id == this.todo.id).title = this.todo.title;
        this.todos.find(v => v.id == this.todo.id).text = this.todo.text;

        setTimeout(function() {
          localStorage.setItem('todos', JSON.stringify(this.todos));
          this.$parent.getTodos();
          this.$parent.isDisabled = false;
        }.bind(this),0);

      },

    },
    computed: {
      parentTodo() {
        if(this.data === null) {
          return false
        }
        // console.log("parent todo", this.data);
        this.gtd();
        return this.data;
      }
    },
  }

</script>

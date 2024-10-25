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

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import editable from './Editable';

export default defineComponent({
  name: 'Todo',
  components: { editable },
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const todos = ref<any[]>([]);
    const todo = ref<any>({});
    const isTodoCreatedStatus = ref<boolean>(false);
    const todoId = ref<number | null>(null);

    const gtd = () => {
      isTodoCreatedStatus.value = false;
      todo.value = props.data;
      setTimeout(() => {
        isTodoCreatedStatus.value = true;
      }, 0);
    };

    const triggerUpdate = () => {
      updateTodo();
    };

    const triggerDisable = () => {
      // @ts-ignore
      this.$parent.isDisabled = true;
    };

    const updateTodo = () => {
      todos.value = JSON.parse(localStorage.getItem('todos') || '[]');

      const todoToUpdate = todos.value.find((v) => v.id === todo.value.id);
      if (todoToUpdate) {
        todoToUpdate.title = todo.value.title;
        todoToUpdate.text = todo.value.text;
      }

      setTimeout(() => {
        localStorage.setItem('todos', JSON.stringify(todos.value));
        // @ts-ignore
        this.$parent.getTodos();
        // @ts-ignore
        this.$parent.isDisabled = false;
      }, 0);
    };

    const parentTodo = computed(() => {
      if (props.data === null) {
        return false;
      }
      gtd();
      return props.data;
    });

    onMounted(() => {
      if (todo.value.length <= 0) {
        todo.value.title = "Hello";
        todo.value.text = "World";
      }
    });

    return {
      todos,
      todo,
      isTodoCreatedStatus,
      todoId,
      gtd,
      triggerUpdate,
      triggerDisable,
      updateTodo,
      parentTodo
    };
  }
});
</script>

<template>
  <div contenteditable="true" @input="update"></div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';

export default defineComponent({
  name: 'editable',
  props: {
    content: {
      type: String,
      required: true
    }
  },
  setup(props, { emit }) {
    const timeout = ref<number | null>(null);
    const el = ref<HTMLElement | null>(null);

    const triggerNoteUpdate = () => {
      emit('triggerUpdate');
    };

    const triggerDisableStatus = () => {
      emit('triggerDisable');
    };

    const update = (event: Event) => {
      triggerDisableStatus();

      if (timeout.value) {
        clearTimeout(timeout.value);
      }

      timeout.value = setTimeout(() => {
        triggerNoteUpdate();
      }, 500);

      emit('update', (event.target as HTMLElement).innerText);
    };

    onMounted(() => {
      if (el.value) {
        el.value.innerText = props.content;
      }
    });

    return {
      el,
      update
    };
  }
});
</script>

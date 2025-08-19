<template>
  <div class="fg-copy" @click="handleCopy(text, $event)">
    <slot>複製</slot>
  </div>
</template>

<script>
import clipboard from './clipboard';

export default {
  name: 'GlobalCopy',
  props: {
    text: {
      type: String,
      default: 'fg-copy',
    },
  },
  methods: {
    handleCopy(text, event) {
      clipboard(text, event);
    },
  },
};
</script>

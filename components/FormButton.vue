<template>
  <button 
    :type="type" 
    :class="[
      variant === 'primary' ? 'btn-primary' : 
      variant === 'secondary' ? 'btn-secondary' : 
      variant === 'accent' ? 'btn-accent' : '',
      block ? 'w-full' : '',
      className
    ]"
    :disabled="disabled"
  >
    <slot></slot>
  </button>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: 'button'
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'accent'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  block: {
    type: Boolean,
    default: false
  },
  className: {
    type: String,
    default: ''
  }
});
</script>

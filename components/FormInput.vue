<template>
  <div>
    <label :for="id" class="form-label">{{ label }}</label>
    <input 
      :id="id" 
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :type="type" 
      :required="required"
      :placeholder="placeholder"
      class="form-input"
    >
    <p v-if="helpText" class="mt-1 text-xs text-secondary-500">{{ helpText }}</p>
  </div>
</template>

<script setup>
defineProps({
  id: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  modelValue: {
    type: [String, Number],
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  required: {
    type: Boolean,
    default: false
  },
  placeholder: {
    type: String,
    default: ''
  },
  helpText: {
    type: String,
    default: ''
  }
});

defineEmits(['update:modelValue']);
</script>

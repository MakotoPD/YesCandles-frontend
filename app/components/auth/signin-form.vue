<script lang="ts" setup>
import { z } from 'zod'
import { storeToRefs } from 'pinia'
import type { FormSubmitEvent } from '#ui/types'

const emit = defineEmits<{
  'switch-to-register': []
}>()

// Use Pinia store for auth actions and state
const authStore = useAuthStore()
const { actionPending, actionError } = storeToRefs(authStore)

// Validation schema
const formSchema = z.object({
  email: z.string().email('Wprowadź poprawny adres email'),
  password: z.string().min(1, 'Wprowadź hasło'),
})

type FormType = z.infer<typeof formSchema>

// Form initial state
const form = ref<FormType>({
  email: '',
  password: '',
})

// Form submission
const onSubmit = async (_event: FormSubmitEvent<FormType>) => {
  // The login action in the store will handle errors and navigation
  await authStore.login(form.value.email, form.value.password)
}

const switchToRegister = () => {
  emit('switch-to-register')
}
</script>

<template>
  <div class="w-full max-w-sm mx-auto">
    <AuthFormHeader
      title="ZALOGUJ SIĘ"
      description="Zaloguj się do swojego konta, aby kontynuować."
    />

    <AppFormError
      :message="actionError"
      :show="!!actionError"
      class="mb-4"
    />

    <UForm
      :schema="formSchema"
      :state="form"
      class="space-y-2"
      @submit="onSubmit"
    >
      <!-- Email input -->
      <UFormField
        name="email"
        required
        size="xl"
        class="w-full"
        :ui="{ error: 'text-xs' }"
      >
        <AppInput
          v-model="form.email"
          name="email"
          type="email"
          autocomplete="email"
          required
          label="Email"
          size="xl"
        />
      </UFormField>

      <!-- Password input with button to show/hide -->
      <UFormField
        name="password"
        required
        size="xl"
        class="w-full"
        :ui="{ error: 'text-xs' }"
      >
        <AppInputPassword
          v-model="form.password"
          name="password"
          autocomplete="current-password"
          required
          label="Hasło"
          size="xl"
        />
      </UFormField>

      <!-- Sign in button -->
      <AppButtonPrimary
        type="submit"
        block
        :loading="actionPending"
        class="btn-yescandles mt-4"
      >
        Zaloguj się
      </AppButtonPrimary>
    </UForm>

    <div class="mt-6 text-center text-xs">
      <p>
        Nie masz konta?
        <span
          class="underline cursor-pointer"
          @click="switchToRegister"
        >
          Dołącz do nas
        </span>
      </p>
    </div>
  </div>
</template>

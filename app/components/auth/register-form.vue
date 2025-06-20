<script lang="ts" setup>
import { z } from 'zod'
import { storeToRefs } from 'pinia'
import type { FormSubmitEvent } from '#ui/types'

const emit = defineEmits<{
  'switch-to-signin': []
}>()

// Use Pinia store for auth actions and state
const authStore = useAuthStore()
const { actionPending, actionError, successMessage } = storeToRefs(authStore)

// Validation schema
const formSchema = z.object({
  first_name: z.string().min(2, 'Imię musi zawierać co najmniej 2 znaki'),
  last_name: z.string().min(2, 'Nazwisko musi zawierać co najmniej 2 znaki'),
  email: z.string().email('Wprowadź poprawny adres email'),
  phone: z.string().optional(),
  password: z.string().min(6, 'Hasło musi zawierać co najmniej 6 znaków'),
})

type FormType = z.infer<typeof formSchema>

// Form initial state
const form = ref<FormType>({
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  password: '',
})

// Form submission
const onSubmit = async (_event: FormSubmitEvent<FormType>) => {
  const success = await authStore.register({
    ...form.value,
    phone: form.value.phone || undefined,
  })

  if (success) {
    // Clear form
    form.value = { first_name: '', last_name: '', email: '', phone: '', password: '' }

    // Automatically switch to login form after 3 seconds
    setTimeout(() => {
      switchToSignin()
    }, 3000)
  }
}

// Switch to sign in form
const switchToSignin = () => {
  emit('switch-to-signin')
}

// Clear any existing messages when the component is unmounted
onUnmounted(() => {
  authStore.clearError()
})
</script>

<template>
  <div class="w-full max-w-sm mx-auto">
    <AuthFormHeader
      title="Stwórz konto"
      description="Stwórz konto, aby korzystać z lepszych usług."
    />

    <!-- Success message from store -->
    <AppFormSuccess
      v-if="successMessage"
      :message="successMessage"
      class="mb-4"
    />

    <!-- Error message from store -->
    <AppFormError
      :message="actionError"
      :show="!!actionError && !successMessage"
      class="mb-4"
    />

    <UForm
      :schema="formSchema"
      :state="form"
      class="space-y-2"
      @submit="onSubmit"
    >
      <!-- First name input -->
      <UFormField
        name="first_name"
        required
        size="xl"
        class="w-full"
        :ui="{ error: 'text-xs' }"
      >
        <AppInput
          v-model="form.first_name"
          name="first_name"
          autocomplete="given-name"
          required
          label="Imię"
          size="xl"
        />
      </UFormField>

      <!-- Last name input -->
      <UFormField
        name="last_name"
        required
        size="xl"
        class="w-full"
        :ui="{ error: 'text-xs' }"
      >
        <AppInput
          v-model="form.last_name"
          name="last_name"
          autocomplete="family-name"
          required
          label="Nazwisko"
          size="xl"
        />
      </UFormField>

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

      <!-- Phone input -->
      <UFormField
        name="phone"
        size="xl"
        class="w-full"
        :ui="{ error: 'text-xs' }"
      >
        <AppInput
          v-model="form.phone"
          name="phone"
          type="tel"
          autocomplete="tel"
          label="Telefon"
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
          autocomplete="new-password"
          required
          label="Hasło"
          size="xl"
        />
      </UFormField>

      <div class="text-xs py-6">
        Przy tworzeniu konta, zgadzasz się z
        <AppLink
          class="underline"
          to="/polityka-prywatnosci"
        >
          Polityką prywatności
        </AppLink>
        i
        <AppLink
          class="underline"
          to="/regulamin"
        >
          Regulamin
        </AppLink>.
      </div>

      <!-- Join button -->
      <AppButtonPrimary
        type="submit"
        block
        class="btn-yescandles mt-4"
        :loading="actionPending"
      >
        Zarejestruj się
      </AppButtonPrimary>
    </UForm>

    <div class="mt-6 text-center text-xs">
      <p>
        Jesteś już zarejestrowany?
        <span
          class="underline cursor-pointer"
          @click="switchToSignin"
        >
          Zaloguj się
        </span>
      </p>
    </div>
  </div>
</template>

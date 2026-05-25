<template>
  <div class="border-border w-full max-w-sm rounded-2xl border p-6 shadow-md shadow-black/20">
    <h2 class="mb-5 text-[15px] font-semibold">Iniciar sesión</h2>

    <!-- Error message -->
    <Transition name="fade">
      <div
        v-if="error"
        class="border-error/20 bg-error/10 mb-4 flex items-start gap-2.5 rounded-lg border px-3 py-2.5"
      >
        <span class="bg-error mt-px h-2 w-2 shrink-0 rounded-full" />
        <p class="text-error text-[13px] leading-snug">{{ error }}</p>
      </div>
    </Transition>

    <form class="space-y-4" @submit.prevent="handleSubmit">
      <!-- Email -->
      <InputWrapper
        id="login-email"
        v-model="form.email"
        label="Correo electronio o usuario"
        type="text"
        placeholder="admin"
      />

      <!-- Password -->
      <InputWrapper
        id="login-password"
        v-model="form.password"
        label="Contraseña"
        placeholder="********"
        :type="showPassword ? 'text' : 'password'"
      >
        <template #content-right>
          <Eye v-if="showPassword" :size="20" @click="showPassword = !showPassword" />
          <EyeOff v-else :size="20" @click="showPassword = !showPassword" />
        </template>
      </InputWrapper>

      <!-- Submit -->
      <button
        type="submit"
        :disabled="loading || isOffline"
        class="btn btn-primary mt-1 w-full justify-center py-2.5 text-[13.5px]"
      >
        <Loader2 v-if="loading" :size="14" class="animate-spin" />
        <LogIn v-else :size="14" />
        {{ loading ? 'Ingresando...' : 'Iniciar sesión' }}
      </button>
    </form>
  </div>
</template>

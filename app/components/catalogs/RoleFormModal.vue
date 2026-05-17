<script setup lang="ts">
  import type { IUserRole } from '~/types/user.type'
  import CustomModal from '../common/Modal/CustomModal.vue'
  import InputWrapper from '../common/InputWrapper.vue'

  interface Props {
    role?: IUserRole
  }
  const props = defineProps<Props>()
  const { close } = useModal()

  const form = ref<Omit<IUserRole, 'id'>>({
    label: props.role?.label ?? '',
    role: props.role?.role ?? '',
    description: props.role?.description ?? '',
  })

  const isEdit = computed(() => !!props.role)
  const isValid = computed(() => !!form.value.label.trim() && !!form.value.role.trim())

  const onSave = () => {
    if (!isValid.value) return
    close(form.value)
  }
</script>

<template>
  <CustomModal :title="isEdit ? 'Editar Rol' : 'Nuevo Rol'">
    <div class="grid w-full grid-cols-2 gap-4 pb-5 md:w-125">
      <InputWrapper
        id="role-form-modal-label"
        v-model="form.label"
        label="Nombre del rol"
        type="text"
        placeholder="Ej. Administrador"
      />
      <InputWrapper
        id="role-form-modal-key"
        v-model="form.role"
        label="Clave"
        type="text"
        placeholder="Ej. admin"
      />
      <InputWrapper
        id="role-form-modal-description"
        v-model="form.description"
        label="Descripción"
        type="text"
        :is-text-area="true"
        :rows="3"
        placeholder="Describe las responsabilidades del rol"
        class="col-span-2"
      />
    </div>
    <template #footer>
      <div class="flex w-full justify-end gap-2">
        <button class="btn" @click="close(false)">Cancelar</button>
        <button class="btn btn-primary" :disabled="!isValid" @click="onSave">
          {{ isEdit ? 'Guardar cambios' : 'Crear rol' }}
        </button>
      </div>
    </template>
  </CustomModal>
</template>

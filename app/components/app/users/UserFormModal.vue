<script setup lang="ts">
  import type { IUser } from '~/types/user.type'
  import CustomModal from '../common/Modal/CustomModal.vue'
  import InputWrapper from '../common/InputWrapper.vue'
  import DropdownLabel from '../common/Dropdown/DropdownLabel.vue'

  interface Props {
    user?: IUser
  }
  const props = defineProps<Props>()

  const catalogService = useCatalog()
  const userRoles = computed(() =>
    catalogService.userRoles.value.map((role) => ({
      id: role.role,
      label: role.label,
    }))
  )
  const { close } = useModal()
  const selectedStatus = ref<number>(props.user?.active ? 1 : 2)
  const statusUser = [
    { id: 1, label: 'Activo' },
    { id: 2, label: 'Inactivo' },
  ]
  const userForm = ref<IUser>(
    props.user
      ? { ...props.user }
      : {
          id: 0,
          name: '',
          email: '',
          role: '',
          active: false,
          createdAt: new Date(),
        }
  )

  const onSave = () => {
    userForm.value.active = selectedStatus.value === 1
    close(userForm.value)
  }
</script>

<template>
  <CustomModal title="Nuevo Usuario">
    <div class="grid w-full grid-cols-2 gap-4 pb-5 md:w-125">
      <InputWrapper
        id="user-form-modal-user-name"
        v-model="userForm.name"
        label="Nombre completo"
        type="text"
      />
      <InputWrapper
        id="user-form-modal-user-email"
        v-model="userForm.email"
        label="Correo electrónico"
        type="email"
      />
      <DropdownLabel
        id="user-form-modal-role"
        v-model="userForm.role"
        label="Rol"
        :options="userRoles"
      />
      <DropdownLabel
        id="user-form-modal-active"
        v-model="selectedStatus"
        label="Estado"
        :options="statusUser"
      />
    </div>
    <template #footer>
      <div class="flex w-full justify-end gap-2">
        <div class="flex gap-2">
          <button class="btn" @click="close(false)">Cancelar</button>
          <button class="btn btn-primary" @click="onSave">Guardar</button>
        </div>
      </div>
    </template>
  </CustomModal>
</template>

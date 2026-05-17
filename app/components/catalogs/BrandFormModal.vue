<script setup lang="ts">
  import type { IMachineBrand } from '~/types/machine.type'
  import CustomModal from '../common/Modal/CustomModal.vue'
  import InputWrapper from '../common/InputWrapper.vue'

  interface Props {
    brand?: IMachineBrand
  }
  const props = defineProps<Props>()
  const { close } = useModal()

  const form = ref<Omit<IMachineBrand, 'id'>>({
    name: props.brand?.name ?? '',
  })

  const isEdit = computed(() => !!props.brand)

  const onSave = () => {
    if (!form.value.name.trim()) return
    close(form.value)
  }
</script>

<template>
  <CustomModal :title="isEdit ? 'Editar Marca' : 'Nueva Marca'">
    <div class="w-full pb-5 md:w-96">
      <InputWrapper
        id="brand-form-modal-name"
        v-model="form.name"
        label="Nombre de la marca"
        type="text"
        placeholder="Ej. Samsung"
      />
    </div>
    <template #footer>
      <div class="flex w-full justify-end gap-2">
        <button class="btn" @click="close(false)">Cancelar</button>
        <button class="btn btn-primary" :disabled="!form.name.trim()" @click="onSave">
          {{ isEdit ? 'Guardar cambios' : 'Crear marca' }}
        </button>
      </div>
    </template>
  </CustomModal>
</template>

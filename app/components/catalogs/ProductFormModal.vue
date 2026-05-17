<script setup lang="ts">
  import type { IProduct } from '~/types/products.type'
  import { useCatalogStore } from '~/store/catalog.store'
  import CustomModal from '../common/Modal/CustomModal.vue'
  import InputWrapper from '../common/InputWrapper.vue'
  import DropdownLabel from '../common/Dropdown/DropdownLabel.vue'

  interface Props {
    product?: IProduct
  }
  const props = defineProps<Props>()
  const { close } = useModal()

  const catalogStore = useCatalogStore()
  await useAsyncData('brands-modal', () => catalogStore.fetchBrands())

  const brandOptions = computed(() =>
    catalogStore.brands.map((b) => ({ id: b.name, label: b.name }))
  )

  const form = ref<Omit<IProduct, 'id'>>({
    name: props.product?.name ?? '',
    description: props.product?.description ?? '',
    category: props.product?.category ?? '',
    brand: props.product?.brand ?? '',
    unit: props.product?.unit ?? '',
    stock: props.product?.stock ?? 0,
    price: props.product?.price ?? 0,
  })

  const isEdit = computed(() => !!props.product?.id)
  const isValid = computed(() => !!form.value.name.trim() && !!form.value.brand)

  const onSave = () => {
    if (!isValid.value) return
    close(form.value)
  }
</script>

<template>
  <CustomModal :title="isEdit ? 'Editar Producto' : 'Nuevo Producto'">
    <div class="grid w-full grid-cols-2 gap-4 pb-5 md:w-150">
      <InputWrapper
        id="product-form-modal-name"
        v-model="form.name"
        label="Nombre del producto"
        type="text"
        placeholder="Ej. Detergente líquido"
      />
      <InputWrapper
        id="product-form-modal-category"
        v-model="form.category"
        label="Categoría"
        type="text"
        placeholder="Ej. Detergentes"
      />
      <DropdownLabel
        id="product-form-modal-brand"
        v-model="form.brand"
        label="Marca"
        :options="brandOptions"
        placeholder="Seleccionar marca"
      />
      <InputWrapper
        id="product-form-modal-unit"
        v-model="form.unit"
        label="Unidad"
        type="text"
        placeholder="Ej. Litros, Kg, Piezas"
      />
      <InputWrapper
        id="product-form-modal-stock"
        v-model="form.stock"
        label="Stock inicial"
        type="number"
      />
      <InputWrapper
        id="product-form-modal-price"
        v-model="form.price"
        label="Precio"
        type="number"
      />
      <InputWrapper
        id="product-form-modal-description"
        v-model="form.description"
        label="Descripción"
        type="text"
        :is-text-area="true"
        :rows="3"
        placeholder="Descripción del producto"
        class="col-span-2"
      />
    </div>
    <template #footer>
      <div class="flex w-full justify-end gap-2">
        <button class="btn" @click="close(false)">Cancelar</button>
        <button class="btn btn-primary" :disabled="!isValid" @click="onSave">
          {{ isEdit ? 'Guardar cambios' : 'Crear producto' }}
        </button>
      </div>
    </template>
  </CustomModal>
</template>

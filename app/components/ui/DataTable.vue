<script setup lang="ts" generic="T extends Record<string, unknown>">
  import type { TableColumn } from '~/types/table.type'

  interface Props {
    columns: TableColumn<T>[]
    rows: T[]
    emptyMessage?: string
  }

  defineProps<Props>()
</script>

<template>
  <div class="w-full overflow-x-auto rounded-b-md border border-gray-200 bg-white">
    <table class="w-full text-left text-sm">
      <thead class="border-b border-gray-200 bg-neutral-50">
        <tr>
          <th
            v-for="col in columns"
            :key="col.key"
            :style="col.width ? `width: ${col.width}` : ''"
            :class="[
              'px-4 py-3 font-semibold text-neutral-700',
              col.align === 'center'
                ? 'text-center'
                : col.align === 'right'
                  ? 'text-right'
                  : 'text-left',
            ]"
          >
            {{ col.label }}
          </th>
          <th class="px-4 py-3 text-right font-semibold text-neutral-700">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="!rows.length">
          <td :colspan="columns.length + 1" class="px-4 py-10 text-center text-neutral-400">
            {{ emptyMessage ?? 'Sin registros' }}
          </td>
        </tr>
        <tr
          v-for="(row, index) in rows"
          :key="index"
          class="border-b border-gray-100 transition-colors last:border-0 hover:bg-neutral-50"
        >
          <td
            v-for="col in columns"
            :key="col.key"
            :class="[
              'px-4 py-3 text-neutral-700',
              col.align === 'center'
                ? 'text-center'
                : col.align === 'right'
                  ? 'text-right'
                  : 'text-left',
            ]"
          >
            <slot :name="`cell-${col.key as any}`" :row="row" :value="row[col.key]">
              {{ row[col.key] ?? '—' }}
            </slot>
          </td>
          <td class="px-4 py-3">
            <div class="flex items-center justify-end gap-1">
              <slot name="actions" :row="row" />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

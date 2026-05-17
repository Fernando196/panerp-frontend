import { defineStore } from 'pinia'
import { MACHINE_STATUS_CATALOG } from '~/const/machine.const'
import { MachineService } from '~/services/machine'
import type { IMachine } from '~/types/machine.type'

export const useMachineStore = defineStore('machine', () => {
  const machineService = MachineService()
  const machines = ref<IMachine[]>([])
  const peding = ref<boolean>(false)

  async function fetchMachines() {
    if (machines.value.length > 0) return machines.value
    peding.value = true
    try {
      const data: IMachine[] = await machineService.getMachines()
      machines.value = data.map((machine: IMachine) => ({
        ...machine,
        Status: MACHINE_STATUS_CATALOG[machine.status] || null,
      }))
      return data
    } catch (error) {
      console.error('Error fetching machines:', error)
      throw error
    } finally {
      peding.value = false
    }
  }

  async function addMachine(machine: Omit<IMachine, 'id'>) {
    const newMachine = await machineService.postMachine(machine)
    machines.value.push(newMachine)
  }

  async function updateMachine(updated: IMachine) {
    const updatedMachine = await machineService.putMachine(updated.id, updated)
    const idx = machines.value.findIndex((m) => m.id === updatedMachine.id)
    if (idx === -1) return
    machines.value[idx] = updatedMachine
    machines.value[idx].Status = MACHINE_STATUS_CATALOG[updatedMachine.status] || null
  }

  async function deleteMachine(id: number) {
    await machineService.deleteMachine(id)
    machines.value = machines.value.filter((m) => m.id !== id)
  }

  return { machines, fetchMachines, addMachine, updateMachine, deleteMachine }
})

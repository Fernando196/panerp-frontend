import type { IMachine } from '~/types/machine.type'

export const MachineService = () => {
  const { $api } = useNuxtApp()

  return {
    async getMachines(): Promise<IMachine[]> {
      return await $api<IMachine[]>('/machines', {
        method: 'GET',
      })
    },
    async postMachine(machine: Omit<IMachine, 'id'>): Promise<IMachine> {
      return await $api<IMachine>('/machines', {
        method: 'POST',
        body: machine,
      })
    },
    async putMachine(machineId: number, machine: Partial<IMachine>): Promise<IMachine> {
      return await $api<IMachine>(`/machines/${machineId}`, {
        method: 'PUT',
        body: machine,
      })
    },
    async deleteMachine(machineId: number): Promise<void> {
      await $api(`/machines/${machineId}`, {
        method: 'DELETE',
      })
    },
  }
}

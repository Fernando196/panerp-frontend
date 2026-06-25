/* eslint-disable @typescript-eslint/no-explicit-any */
import { shallowRef, type Component } from 'vue'

interface ModalInstance {
  component: Component
  props: any
  resolveFn: (value: any) => void
}

const modalStack = shallowRef<ModalInstance[]>([])

export function useModal() {
  function open<TResult = any, TProps = any>(
    component: any,
    props?: TProps
  ): Promise<TResult | undefined> {
    return new Promise<TResult | undefined>((resolve) => {
      modalStack.value = [
        ...modalStack.value,
        {
          component,
          props: props || {},
          resolveFn: resolve,
        },
      ]
    })
  }

  function close<T = any>(data?: T) {
    const modal = modalStack.value[modalStack.value.length - 1]
    modalStack.value = modalStack.value.slice(0, -1)
    modal?.resolveFn(data)
  }

  return {
    modalStack,
    openModal: open,
    close,
  }
}

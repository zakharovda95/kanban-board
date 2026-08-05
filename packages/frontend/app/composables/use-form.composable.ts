/* eslint-disable @typescript-eslint/no-explicit-any */

import { computed, type Ref, ref, toRaw, unref } from 'vue';
import type { TValidationErrors } from '@kanban-board/common';

export function useForm<T extends Record<string, any>>(initial: T) {
  const cloneSafe = <T>(value: T): T => {
    return structuredClone(toRaw(unref(value)));
  };

  const initialValue = ref<T>(cloneSafe(initial));
  const formData = ref<T>(cloneSafe(initial)) as Ref<T>;
  const formErrors = ref<TValidationErrors<T>>({});

  const isDirty = computed(() => {
    return JSON.stringify(formData.value) !== JSON.stringify(initialValue.value);
  });

  const setByPath = (obj: Record<string, any>, path: string, value: any) => {
    const keys = path.split('.');
    let current = obj;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i]!;
      if (current[key] == null || typeof current[key] !== 'object') current[key] = {};
      current = current[key];
    }

    current[keys[keys.length - 1]!] = value;
  };

  const clearErrorByPath = (errors: Record<string, any>, path: string) => {
    const keys = path.split('.');
    let current = errors;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i]!;
      current = current?.[key];
      if (!current) return;
    }

    const lastKey = keys[keys.length - 1]!;
    current[lastKey] = undefined;
  };

  const update = (key: string, newValue: any): void => {
    setByPath(formData.value as Record<string, any>, key, newValue);
    clearErrorByPath(formErrors.value as Record<string, any>, key);
  };

  const set = (data: T, options?: { setAsInitial?: boolean; clearErrors?: boolean }): void => {
    const cloned = cloneSafe(data);
    formData.value = cloned;
    if (options?.setAsInitial) initialValue.value = cloneSafe(cloned);
    if (options?.clearErrors) formErrors.value = {};
  };

  const reset = (): void => {
    formData.value = cloneSafe(initialValue.value);
    formErrors.value = {};
  };

  return {
    formData,
    formErrors,
    isDirty,
    update,
    set,
    reset,
  };
}

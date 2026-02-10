import type { StorageKey, StorageSchema } from '@/consts'

export const getStorageItem = <K extends StorageKey>(key: K): StorageSchema[K] | null => {
    const raw = window.localStorage.getItem(key)
    if (raw === null) return null
    return raw as StorageSchema[K]
}

export const setStorageItem = <K extends StorageKey>(key: K, value: StorageSchema[K]): void => {
    window.localStorage.setItem(key, value)
}

export const removeStorageItem = <K extends StorageKey>(key: K): void => {
    window.localStorage.removeItem(key)
}

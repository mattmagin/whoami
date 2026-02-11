import { useMutation } from '@tanstack/react-query'
import { createContact } from '@/api'
import type { ContactPayload } from '@/api'

export const useCreateContact = () => {
    return useMutation({
        mutationFn: (payload: ContactPayload) => createContact(payload),
    })
}

export type { ContactPayload }

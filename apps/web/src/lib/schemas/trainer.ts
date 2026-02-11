import { z } from 'zod'

export const inviteEmailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

export type InviteEmailValues = z.infer<typeof inviteEmailSchema>

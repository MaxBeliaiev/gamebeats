import * as z from 'zod'

export const ufcStaminaUpdateSchema = z.object({
  stamina: z.coerce
    .number()
    .gte(0, 'Stamina must be minimum 0.')
    .lte(100, 'Stamina must be maximum 100.'),
})

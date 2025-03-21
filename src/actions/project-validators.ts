import { z } from 'zod'

export const projectRoleValidator = z.enum(['methodology_manager', 'product_manager', 'developer'])

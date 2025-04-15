import { z } from 'zod'

export const projectRoleValidator = z.enum(['scrum_master', 'product_owner', 'developer'])

import { z } from 'zod';
import { ActionSchema } from './action.js';

/**
 * Intent IDs are also directory names, so we keep them filesystem-friendly.
 * Give detailed messages for UI hints.
 */
const intentIdChars = /^[a-zA-Z0-9_-]+$/;
const intentIdStartsOk = /^[a-zA-Z0-9]/;

export const IntentIdSchema = z
  .string()
  .min(1, { message: 'Must be non-empty.' })
  .refine((value) => intentIdStartsOk.test(value), {
    message: 'Must start with a letter or number.',
  })
  .refine((value) => intentIdChars.test(value), {
    message: 'May contain only letters, numbers, dashes, and underscores.',
  });

/**
 * The schema of the object actually saved to `intent.json`.
 * This is the on-disk body.
 */
export const IntentBodySchema = z.object({
  shortDesc: z.string().min(1, { message: 'Must be non-empty.' }),
  longDesc: z.string().min(1, { message: 'Must be non-empty.' }),
  actions: z.array(ActionSchema).min(1)
});
export type IntentBody = z.infer<typeof IntentBodySchema>;

/**
 * The full internal `Intent` type used by the application.
 * This is the on-disk body plus the filesystem-derived id.
 */
export const IntentSchema = IntentBodySchema.extend({
  id: IntentIdSchema,
});
export type Intent = z.infer<typeof IntentSchema>;

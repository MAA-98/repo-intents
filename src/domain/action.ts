import { z } from 'zod';

const shellVarName = /^[A-Za-z_][A-Za-z0-9_]*$/;

/**
 * A prompt is a question asked before running a shell command.
 * The answer is stored under `varName` and can be interpolated into the command.
 */
export const PromptSchema = z.object({
  varName: z.string().min(1).regex(shellVarName, {
    message: 'Must be a valid shell variable name (letters, numbers, underscores; cannot start with a digit).',
  }),
  prompt: z.string().min(1),
});
export type Prompt = z.infer<typeof PromptSchema>;

/**
 * Every action step is a shell step.
 * Each shell step owns its own prompts, making the step self-contained.
 */
export const ShellStepSchema = z.object({
  prompts: z.array(PromptSchema).default([]),
  command: z.string().min(1),
});
export type ShellStep = z.infer<typeof ShellStepSchema>;

/**
 * An action is a description and a shell step.
 */
export const ActionSchema = z.object({
  desc: z.string().optional(),
  step: ShellStepSchema,
});
export type Action = z.infer<typeof ActionSchema>;
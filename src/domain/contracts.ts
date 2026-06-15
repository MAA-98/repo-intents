import type { Workspace, Intent, IntentBody, IntentId} from "./types.js";
import type { Validator } from './validation.js';

// ---*--- VALIDATION ---*---
export type ValidateIntentBody = Validator<IntentBody>;
export type ValidateIntent = Validator<Intent>;

// ---*--- WORKSPACE ---*---
export type CreateWorkspace = (baseDir: string) => void;
export type ResolveWorkspaces = (startDir: string) => Workspace[]; // Workspaces are returned in array, prioritizing intents from earlier workspaces.

export type LoadIntentFromWorkspace = (workspace: Workspace, id: string) => Intent | undefined;
export type LoadIntentFromWorkspaceFactory = (
  validateIntentBody: ValidateIntentBody
) => LoadIntentFromWorkspace;
export type LoadIntentsFromWorkspace = (workspace: Workspace) => Intent[];
export type LoadIntentsFromWorkspaceFactory = (
  loadIntentFromWorkspace: (workspace: Workspace, id: IntentId) => Intent | undefined
) => LoadIntentsFromWorkspace;

export type SaveIntentToWorkspace = (workspace: Workspace, intent: Intent) => void;

// ---*--- OTHER ---*---
export type CollectPromptValues = (prompts: { varName: string; prompt: string }[]) => Promise<Record<string, string>>;
export type RunShellCommand = (command: string, env?: Record<string, string>) => Promise<number>;
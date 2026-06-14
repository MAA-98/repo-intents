import { type Workspace, type Intent, type IntentBody } from "./types.js";
import type { Validator } from './validation.js';

export type ValidateIntentBody = Validator<IntentBody>;
export type ValidateIntent = Validator<Intent>;

export type CreateWorkspace = (baseDir: string) => void;
/*
 * Workspaces are returned in array, prioritizing intents from earlier workspaces.
 */
export type ResolveWorkspaces = (startDir: string) => Workspace[];

export type LoadIntentsFromWorkspace = (workspace: Workspace) => Intent[];
export type SaveIntentToWorkspace = (workspace: Workspace, intent: Intent) => void;
import type { Workspace, Intent, IntentBody, IntentId} from "./types.js";
import type { Validator } from './validation.js';

export type ValidateIntentBody = Validator<IntentBody>;
export type ValidateIntent = Validator<Intent>;

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

export type SearchIntents = (query: string, intents: Intent[]) => Intent[];
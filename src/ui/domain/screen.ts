import type { Workspace, Intent } from '../../domain/types.js';
import type { SaveIntentToWorkspace, ValidateIntent } from '../../domain/contracts.js';

export type EditIntentScreen = {
  kind: 'editIntent';
  workspace: Workspace;
  saveIntentToWorkspace: SaveIntentToWorkspace;
  validateIntent: ValidateIntent;
  draft?: Intent;
};

export type SearchIntentsScreen = {
  kind: 'searchIntents';
  intents: Intent[];
  initialQuery?: string;
};

export type Screen = EditIntentScreen | SearchIntentsScreen;
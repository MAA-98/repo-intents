import { SaveIntentToWorkspace, ValidateIntent } from '../../domain/contracts.js';

export type AppDeps = {
  saveIntentToWorkspace: SaveIntentToWorkspace;
  validateIntent: ValidateIntent;
};
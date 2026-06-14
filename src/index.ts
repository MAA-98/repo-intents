#!/usr/bin/env node
import { Command } from 'commander';
import { registerInitCommand } from './commands/init.js';
import { registerAddCommand } from "./commands/add.js";
import { registerEditCommand } from "./commands/edit.js";
import { registerRunCommand } from "./commands/run.js";
import { registerSearchCommand } from "./commands/search.js";

import type {
  CreateWorkspace,
  LoadIntentFromWorkspace, LoadIntentsFromWorkspace,
  ResolveWorkspaces,
  SaveIntentToWorkspace, SearchIntents
} from "./domain/contracts.js";
import {
  createWorkspace,
  loadIntentFromWorkspaceFactory, loadIntentsFromWorkspaceFactory,
  resolveWorkspaces,
  saveIntentToWorkspace
} from "./infrastructure/node-workspace-methods.js";

import type { ValidateIntent, ValidateIntentBody } from "./domain/contracts.js";
import { validateIntent, validateIntentBody } from "./infrastructure/zod-validators.js";

/**
 * Create CLI program
 */
const program = new Command();

program
  .name('repo-intents')
  .description('Create, search and run defined intents')
  .version('0.1.0');

/**
 * Composition root for dependencies.
 */
createWorkspace satisfies CreateWorkspace;
resolveWorkspaces satisfies ResolveWorkspaces;
saveIntentToWorkspace satisfies SaveIntentToWorkspace;
validateIntent satisfies ValidateIntent;
validateIntentBody satisfies ValidateIntentBody;
const loadIntentFromWorkspace: LoadIntentFromWorkspace = loadIntentFromWorkspaceFactory(validateIntentBody);
const loadIntentsFromWorkspace: LoadIntentsFromWorkspace = loadIntentsFromWorkspaceFactory(loadIntentFromWorkspace);

/**
 *
 */


/**
 * Command registration with dependencies.
 */
registerInitCommand(program, createWorkspace);
registerAddCommand(program, resolveWorkspaces, saveIntentToWorkspace, validateIntent);
registerEditCommand(program, resolveWorkspaces, loadIntentFromWorkspace, saveIntentToWorkspace, validateIntent);
registerRunCommand(program, resolveWorkspaces, loadIntentFromWorkspace);
registerSearchCommand(program, resolveWorkspaces, loadIntentsFromWorkspace);

program.parseAsync(process.argv);
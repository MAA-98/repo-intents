#!/usr/bin/env node
import { Command } from 'commander';
import { registerInitCommand } from './commands/init.js';
import { registerAddCommand } from "./commands/add.js";
// import { registerRunCommand } from "./commands/run.js";
// import { registerSearchCommand } from "./commands/search.js";

import type { CreateWorkspace, ResolveWorkspaces, SaveIntentToWorkspace } from "./domain/contracts.js";
import { createWorkspace, resolveWorkspaces, saveIntentToWorkspace } from "./infrastructure/workspace-methods.js";

import type { ValidateIntent } from "./domain/contracts.js";
import { validateIntent } from "./infrastructure/zod-validators.js";

/**
 * Create CLI program
 */
const program = new Command();

program
  .name('repo-intents')
  .description('Create, search and run defined intents')
  .version('0.1.0');

/**
 * Composition Root
 */
createWorkspace satisfies CreateWorkspace;
resolveWorkspaces satisfies ResolveWorkspaces;
saveIntentToWorkspace satisfies SaveIntentToWorkspace;
validateIntent satisfies ValidateIntent;

/**
 * Command registration with dependencies.
 */
registerInitCommand(program, createWorkspace);
registerAddCommand(program, resolveWorkspaces, saveIntentToWorkspace, validateIntent);
//registerRunCommand(program);
//registerSearchCommand(program);

program.parseAsync(process.argv);
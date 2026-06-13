#!/usr/bin/env node
import { Command } from 'commander';
import { registerInitCommand } from './commands/init.js';
import { registerListCommand } from './commands/list.js';
import {registerAddCommand} from "./commands/add.js";
import {registerRunCommand} from "./commands/run.js";

/**
 * Create CLI program
 */
const program = new Command();

program
  .name('repo-intents')
  .description('Discover and run repo-defined intents')
  .version('0.1.0');

registerInitCommand(program);
registerListCommand(program);
registerAddCommand(program);
registerRunCommand(program);

program.parseAsync(process.argv);
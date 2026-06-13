import type { Command } from 'commander';
import { resolveWorkspaces, loadIntents } from '../domain/workspace.js';

/**
 * list
 * Prints all available intents in the current repo-intents workspace,
 * including parent workspaces.
 */
export function registerListCommand(program: Command) {
  program
    .command('list')
    .description('List available actions')
    .action(() => {
      const workspace = resolveWorkspaces(process.cwd());
      const intents = loadIntents(workspace);
      
      for (const intent of intents) {
        console.log(`${intent.id}\t${intent.shortDesc}`);
      }
    });
}
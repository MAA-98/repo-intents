import type { Command } from 'commander';
import type {
  CollectPromptValues,
  LoadIntentFromWorkspace,
  ResolveWorkspaces,
  RunShellCommand
} from "../domain/contracts.js";
import { resolveIntentById } from "../application/resolve-intent.js";
import {runIntent} from "../application/run-intent.js";

export function registerRunCommand(
  program: Command,
  resolveWorkspaces: ResolveWorkspaces,
  loadIntentFromWorkspace: LoadIntentFromWorkspace,
  collectPromptValues: CollectPromptValues,
  runShellCommand: RunShellCommand,
) {
  program
    .command('run <id>')
    .description('Run an intent by id')
    .action(async (id: string) => {
      const workspaces = resolveWorkspaces(process.cwd());
      if (workspaces.length === 0) {
        console.error('No .repo-intents workspace found. Run `init` or `init --global` first.');
        process.exit(1);
      }
      
      const resolvedResult = resolveIntentById(workspaces, id, loadIntentFromWorkspace);
      if (!resolvedResult) {
        console.error(`No intent found with id "${id}".`);
        process.exit(1);
      }
      const { workspace, intent } = resolvedResult;
      console.log(`Intent ${intent.id} found in ${workspace.rootDir}`);
      console.log(intent.shortDesc);
      console.log('');

      await runIntent(intent, collectPromptValues, runShellCommand);
    });
}
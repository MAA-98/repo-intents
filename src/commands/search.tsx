import type { Command } from 'commander';
import { render } from 'ink';
import type {Intent} from "../domain/types.js";
import type {
  CollectPromptValues,
  LoadIntentsFromWorkspace,
  ResolveWorkspaces,
  RunShellCommand
} from "../domain/contracts.js";
import { SearchIntentsApp } from '../ui/SearchIntentsApp.js';
import {runIntent} from "../application/run-intent.js";

export function registerSearchCommand(
  program: Command,
  resolveWorkspaces: ResolveWorkspaces,
  loadIntentsFromWorkspace: LoadIntentsFromWorkspace,
  collectPromptValues: CollectPromptValues,
  runShellCommand: RunShellCommand,
) {
  program
    .command('search [query]')
    .description('Interactively search available intents')
    .action(async (query?: string) => {
      const workspaces = resolveWorkspaces(process.cwd());

      if (workspaces.length === 0) {
        console.error('No .repo-intents workspaces found. Run `init` or `init --global` first.');
        process.exit(1);
      }
      
      const intents = workspaces.flatMap((workspace) => loadIntentsFromWorkspace(workspace));
      
      let selectedIntent: Intent | undefined;
      
      const app = render(
        <SearchIntentsApp
          intents={intents}
          initialQuery={query ?? ''}
          onSelect={(intent) => {
            selectedIntent = intent;
          }}
        />
      );
      
      await app.waitUntilExit();
      
      if (selectedIntent) {
        await runIntent(selectedIntent, collectPromptValues, runShellCommand);
      }
    });
}
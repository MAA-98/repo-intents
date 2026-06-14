import type { Command } from 'commander';
import { render } from 'ink';
import {LoadIntentsFromWorkspace, ResolveWorkspaces, SearchIntents} from "../domain/contracts.js";
import { SearchIntentsApp } from '../ui/SearchIntentsApp.js';

export function registerSearchCommand(
  program: Command,
  resolveWorkspaces: ResolveWorkspaces,
  loadIntentsFromWorkspace: LoadIntentsFromWorkspace,
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

      const app = render(
        <SearchIntentsApp
          intents={intents}
          initialQuery={query ?? ''}
          onSelect={(intent) => {
            console.log(intent.id);
            app.unmount();
          }}
        />
      );

      await app.waitUntilExit();
    });
}
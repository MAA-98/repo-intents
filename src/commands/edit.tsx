import type { Command } from 'commander';
import { render } from 'ink';
import { EditIntentApp } from '../ui/EditIntentApp.js';
import type {
  LoadIntentFromWorkspace,
  ResolveWorkspaces,
  SaveIntentToWorkspace,
  ValidateIntent
} from "../domain/contracts.js";

export function registerEditCommand(
  program: Command,
  resolveWorkspaces: ResolveWorkspaces,
  loadIntentFromWorkspace: LoadIntentFromWorkspace,
  saveIntentToWorkspace: SaveIntentToWorkspace,
  validateIntent: ValidateIntent,
) {
  program
    .command('edit <id>')
    .description('Edit an intent in the current workspace')
    .action(async (id: string) => {
      // --- FIND INTENT ---
      const workspaces = resolveWorkspaces(process.cwd());
      
      if (workspaces.length === 0) {
        console.error('No .repo-intents workspace found. Run `init` or `init --global` first.');
        process.exit(1);
      }
      
      let workspace = undefined;
      let draft = undefined;
      
      for (const candidate of workspaces) {
        const intent = loadIntentFromWorkspace(candidate, id);
        if (intent) {
          workspace = candidate;
          draft = intent;
          break;
        }
      }
      
      if (!workspace || !draft) {
        console.error(`No intent found with id "${id}".`);
        process.exit(1);
      }
      
      // --- EDITOR ---
      const app = render(
        <EditIntentApp
          workspace={workspace}
          saveIntentToWorkspace={saveIntentToWorkspace}
          validateIntent={validateIntent}
          draft={draft}
        />
      );
      await app.waitUntilExit();
    });
}

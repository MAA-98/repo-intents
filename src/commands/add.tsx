import type { Command } from 'commander';
import { render } from 'ink';
import type {ResolveWorkspaces, SaveIntentToWorkspace, ValidateIntent} from '../domain/contracts.js';
import { EditIntentApp } from '../ui/EditIntentApp.js';

export function registerAddCommand(
  program: Command,
  resolveWorkspaces: ResolveWorkspaces,
  saveIntentToWorkspace: SaveIntentToWorkspace,
  validateIntent: ValidateIntent,
) {
  program
    .command('add')
    .description('Create a new intent in the current workspace')
    .action(async () => {
      const workspaces = resolveWorkspaces(process.cwd());
      const workspace = workspaces[0];
      
      if (!workspace) {
        console.error('No .repo-intents workspace found. Run `init` or `init --global` first.');
        process.exit(1);
      }
      
      const app = render(
        <EditIntentApp
          workspace={workspace}
          saveIntentToWorkspace={saveIntentToWorkspace}
          validateIntent={validateIntent}
        />
      );
      await app.waitUntilExit();
    });
}

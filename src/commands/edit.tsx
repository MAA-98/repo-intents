// import type { Command } from 'commander';
// import { render } from 'ink';
// import { resolveWorkspaces } from '../domain/workspace.js';
// import { EditIntentApp } from '../ui/EditIntentApp.js';
//
// export function registerEditCommand(program: Command) {
//   program
//     .command('edit ')
//     .description('Edit an intent in the current workspace')
//     .action(async () => {
//       const workspaces = resolveWorkspaces(process.cwd());
//       const workspace = workspaces[0];
//
//       if (!workspace) {
//         console.error('No .repo-intents workspace found. Run `init` or `init --global` first.');
//         process.exit(1);
//       }
//
//       const app = render(<EditIntentApp workspace={workspace} draft={} />);
//       await app.waitUntilExit();
//     });
// }

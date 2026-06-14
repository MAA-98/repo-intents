// import type { Command } from 'commander';
// import { render } from 'ink';
// import { resolveWorkspaces, loadIntents } from '../domain/workspace.js';
// import { SearchIntentsApp } from '../ui/SearchIntentsApp.js';
//
// export function registerSearchCommand(program: Command) {
//   program
//     .command('search [query]')
//     .description('Interactively search available intents')
//     .action(async (query?: string) => {
//       const workspaces = resolveWorkspaces(process.cwd());
//
//       if (workspaces.length === 0) {
//         console.error('No .repo-intents workspaces found. Run `init` or `init --global` first.');
//         process.exit(1);
//       }
//
//       const intents = loadIntents(workspaces);
//
//       const app = render(
//         <SearchIntentsApp
//           intents={intents}
//           initialQuery={query ?? ''}
//           onSelect={(intent) => {
//             console.log(intent.id);
//             app.unmount();
//           }}
//         />
//       );
//
//       await app.waitUntilExit();
//     });
// }
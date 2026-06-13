import type { Command } from 'commander';
import { spawn } from 'node:child_process';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { resolveWorkspaces, loadIntentsFromWorkspace } from '../domain/workspace.js';

async function collectPromptValues(prompts: { varName: string; prompt: string }[]) {
  const rl = createInterface({ input, output });
  const values: Record<string, string> = {};
  
  try {
    for (const item of prompts) {
      const answer = await rl.question(`${item.prompt} `);
      values[item.varName] = answer;
    }
  } finally {
    rl.close();
  }
  
  return values;
}

function runShellCommand(command: string, env: Record<string, string> = {}) {
  return new Promise<number>((resolve, reject) => {
    const child = spawn('sh', ['-lc', command], {
      stdio: 'inherit',
      env: {
        ...process.env,
        ...env,
      },
    });
    
    child.on('error', reject);
    child.on('close', (code) => resolve(code ?? 1));
  });
}

export function registerRunCommand(program: Command) {
  program
    .command('run <intentId>')
    .description('Run an intent by id')
    .action(async (intentId: string) => {
      // ----- FIND INTENT AND WORKSPACE -----
      const workspaces = resolveWorkspaces(process.cwd());
      
      if (workspaces.length === 0) {
        console.error('No .repo-intents workspace found. Run `init` or `init --global` first.');
        process.exit(1);
      }
      
      let intentWorkspace = null;
      let intent = null;
      for (const workspace of workspaces) {
        const intents = loadIntentsFromWorkspace(workspace);
        intent = intents.find((intent) => intent.id === intentId);
        if (intent) {
          intentWorkspace = workspace;
          break;
        }
      }
      
      if (!intent || !intentWorkspace) {
        console.error(`Intent not found: ${intentId}`);
        process.exit(1);
      }
      
      console.log(`Intent ${intent.id} found in ${intentWorkspace.rootDir}`);
      console.log(intent.shortDesc);
      console.log('');
      
      // ----- RUN ACTIONS IN INTENT -----
      for (let i = 0; i < intent.actions.length; i++) {
        const action = intent.actions[i];
        const command = action.step.command;
        const variables =
          action.step.prompts.length > 0
            ? await collectPromptValues(action.step.prompts)
            : {};
        
        console.log(`\x1b[32mRunning:\x1b[0m ${command}`); // Green 'Running: ' text
        const code = await runShellCommand(command, variables);
        
        if (code !== 0) {
          console.error(`Command failed with exit code ${code}`);
          process.exit(code);
        }
      }
    });
}
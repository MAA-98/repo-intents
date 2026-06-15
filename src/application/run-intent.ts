import {Intent} from "../domain/types.js";
import {CollectPromptValues, CreateTerminalSession, RunShellCommand} from "./contracts.js";

export async function runIntent(
  intent: Intent,
  createTerminalSession: CreateTerminalSession,
  collectPromptValues: CollectPromptValues,
  runShellCommand: RunShellCommand,
) {
  const terminalSession = createTerminalSession();
  try {
    for (let i = 0; i < intent.actions.length; i++) {
      const action = intent.actions[i];
      const command = action.step.command;
      let variables = {};
      if (action.step.prompts.length > 0) {
        terminalSession.enterPromptMode();
        try {
          variables = await collectPromptValues(action.step.prompts);
        } finally {
          terminalSession.leavePromptMode();
        }
      }
      
      console.log(`\x1b[32mRunning:\x1b[0m ${command}`); // Green 'Running: ' text
      const code = await runShellCommand(command, variables);
      
      if (code !== 0) {
        console.error(`Command failed with exit code ${code}`);
        process.exit(code);
      }
    }
  } finally {
    terminalSession.close();
  }
}
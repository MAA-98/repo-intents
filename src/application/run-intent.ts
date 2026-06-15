import {Intent} from "../domain/types.js";
import {CollectPromptValues, RunShellCommand} from "../domain/contracts.js";

export async function runIntent(
  intent: Intent,
  collectPromptValues: CollectPromptValues,
  runShellCommand: RunShellCommand,
) {
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
}
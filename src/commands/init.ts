import type { Command } from 'commander';
import { existsSync, mkdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

/**
 * init
 * Initializes a .repo-intents workspace in the current working directory
 * or in the user's home directory.
 */
export function registerInitCommand(program: Command) {
  program
    .command('init')
    .description('Initialize a .repo-intents workspace')
    .option('--global', 'Initialize ~/.repo-intents instead of the current directory')
    .action((opts: { global?: boolean }) => {
      const baseDir = opts.global ? homedir() : process.cwd();
      const repoIntentsDir = join(baseDir, '.repo-intents');
      const intentsDir = join(repoIntentsDir, 'intents');
      
      if (!existsSync(repoIntentsDir)) {
        mkdirSync(repoIntentsDir, { recursive: true });
      } else {
        console.warn(`${repoIntentsDir} already exists`);
        return
      }
      
      if (!existsSync(intentsDir)) {
        mkdirSync(intentsDir, { recursive: true });
      } else {
        console.warn(`${intentsDir} already exists`);
        return
      }
      
      console.log('Created repo-intents in the current directory');
    });
}
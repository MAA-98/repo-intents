import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';

export function debugStdinState(label: string) {
  console.error(`[stdin] ${label}`, {
    isTTY: stdin.isTTY,
    isRaw: typeof stdin.setRawMode === 'function' ? (stdin as { isRaw?: boolean }).isRaw : undefined,
    destroyed: stdin.destroyed,
    readableEnded: stdin.readableEnded,
    readableFlowing: stdin.readableFlowing,
    paused: typeof stdin.isPaused === 'function' ? stdin.isPaused() : undefined,
    listeners: {
      data: stdin.listenerCount('data'),
      end: stdin.listenerCount('end'),
      close: stdin.listenerCount('close'),
      error: stdin.listenerCount('error'),
    },
  });
}

export async function collectPromptValues(prompts: { varName: string; prompt: string }[]) {
  // debugStdinState('collectPromptValues')
  // console.error('[stdin] ref methods', {
  //   ref: typeof stdin.ref,
  //   unref: typeof stdin.unref,
  // });
  const keepAlive = setInterval(() => {}, 1000);
  const rl = createInterface({ input: stdin, output: stdout });
  // rl.on('close', () => console.error('[readline] close'));
  // rl.on('line', (line) => console.error('[readline] line', JSON.stringify(line)));
  // rl.on('pause', () => console.error('[readline] pause'));
  // rl.on('resume', () => console.error('[readline] resume'));
  // rl.on('SIGINT', () => console.error('[readline] SIGINT'));
  // stdin.on('data', (chunk) => {
  //   console.error('[stdin] data', JSON.stringify(chunk.toString()));
  // });
  // stdin.on('end', () => console.error('[stdin] end'));
  // stdin.on('close', () => console.error('[stdin] close'));
  // stdin.on('readable', () => console.error('[stdin] readable'));
  const values: Record<string, string> = {};
  
  try {
    for (const item of prompts) {
      const startedAt = Date.now();
      console.error('[collectPromptValues] asking', item.varName, item.prompt);
      const answer = await rl.question(`\x1b[32m${item.prompt}\x1b[0m `);
      console.error('[collectPromptValues] answer', item.varName, JSON.stringify(answer));
      console.error('[collectPromptValues] elapsed', Date.now() - startedAt, 'ms');
      
      values[item.varName] = answer;
    }
  } finally {
    clearInterval(keepAlive);
    rl.close();
  }
  
  return values;
}
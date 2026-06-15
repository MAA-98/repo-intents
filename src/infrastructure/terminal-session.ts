import { stdin, stdout } from 'node:process';
import type { CreateTerminalSession } from '../application/contracts.js';

export const createTerminalSession: CreateTerminalSession = () => {
  let keepAlive: ReturnType<typeof setInterval> | undefined;
  let isPromptMode = false;
  
  function startKeepAlive() {
    if (!keepAlive) {
      keepAlive = setInterval(() => {}, 1000);
    }
  }
  
  function stopKeepAlive() {
    if (keepAlive) {
      clearInterval(keepAlive);
      keepAlive = undefined;
    }
  }
  
  return {
    enterPromptMode() {
      if (isPromptMode) return;
      isPromptMode = true;
      
      if (typeof stdin.ref === 'function') stdin.ref();
      if (typeof stdout.ref === 'function') stdout.ref();
      if (typeof stdin.setRawMode === 'function') stdin.setRawMode(false);
      
      stdin.resume();
      startKeepAlive();
    },
    
    leavePromptMode() {
      if (!isPromptMode) return;
      isPromptMode = false;
      
      stopKeepAlive();
      
      if (typeof stdin.unref === 'function') stdin.unref();
      if (typeof stdout.unref === 'function') stdout.unref();
    },
    
    close() {
      this.leavePromptMode();
    },
  };
};
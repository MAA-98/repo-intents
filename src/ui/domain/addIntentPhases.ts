import type { $ZodIssue } from 'zod/v4/core';

export const phases = ['id', 'shortDesc', 'longDesc', 'actions'] as const;
export type Phase = (typeof phases)[number];

export function nextPhase(phase: Phase): Phase {
  const index = phases.indexOf(phase);
  return phases[(index + 1) % phases.length];
}

export function prevPhase(phase: Phase): Phase {
  const index = phases.indexOf(phase);
  return phases[(index - 1 + phases.length) % phases.length];
}

const phaseRoots: Record<Phase, readonly string[]> = {
  id: ['id'],
  shortDesc: ['shortDesc'],
  longDesc: ['longDesc'],
  actions: ['actions'],
};

export function issueIsRelevant(issue: $ZodIssue, phase: Phase) {
  // Root-level issues can be shown for the active screen.
  if (issue.path.length === 0) return true;
  
  const root = String(issue.path[0]);
  return phaseRoots[phase].includes(root);
}
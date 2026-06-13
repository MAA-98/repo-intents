import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { IntentBodySchema, type Intent, type IntentBody } from './intent.js';

export type Workspace = {
  rootDir: string;
  repoIntentsDir: string;
  intentsDir: string;
};

/**
 * Walks upward from startDir to the filesystem root and collects every
 * directory that contains a `.repo-intents/` folder.
 *
 * Workspaces are returned in nearest-first order, so more specific nested
 * repo-intents directories can override or supplement parent definitions.
 */
export function resolveWorkspaces(startDir: string): Workspace[] {
  const workspaces: Workspace[] = [];
  let current = resolve(startDir);
  
  while (true) {
    const candidate = join(current, '.repo-intents');
    
    if (existsSync(candidate)) {
      const pathMetadata = statSync(candidate);
      
      if (pathMetadata.isDirectory()) {
        workspaces.push({
          rootDir: current,
          repoIntentsDir: candidate,
          intentsDir: join(candidate, 'intents')
        });
      }
    }
    
    const parent = dirname(current);
    if (parent === current) break;
    current = parent;
  }
  
  // Nearest-first is usually best for overrides.
  return workspaces;
}


/**
 * Loads all repo intents from a workspace.
 *
 * Expected layout:
 *   .repo-intents/
 *     intents/
 *       {some-intent-id}/
 *         intent.json
 *
 * The directory name is used as the intent id.
 */
export function loadIntentsFromWorkspace(workspace: Workspace): Intent[] {
  const intentsDir = join(workspace.repoIntentsDir, 'intents');
  
  if (!existsSync(intentsDir)) {
    return [];
  }
  
  const dirContents = readdirSync(intentsDir, { withFileTypes: true });
  const intents: Intent[] = [];
  
  for (const entry of dirContents.filter((entry) => entry.isDirectory())) {
    const id = entry.name;
    const intentPath = join(intentsDir, id, 'intent.json');
    if (!existsSync(intentPath)) { continue; }
    
    try {
      const raw = readFileSync(intentPath, 'utf8');
      const parsed = JSON.parse(raw);
      const result = IntentBodySchema.safeParse(parsed);
      
      if (!result.success) {
        console.warn(`Invalid intent "${id}" in ${intentPath}:`);
        for (const issue of result.error.issues) {
          console.warn(`  - ${issue.path.join('.')}: ${issue.message}`);
        }
        continue;
      }
      
      const body: IntentBody = result.data;
      intents.push({
        id,
        ...body
      });
    } catch (err) {
      console.warn(`Failed to load intent "${id}":`, err);
    }
  }
  return intents;
}

/**
 * Loads all repo intents from all discovered workspaces.
 *
 * If multiple workspaces define the same intent id, the nearest workspace
 * wins because workspaces are expected to be passed in nearest-first order.
 */
export function loadIntents(workspaces: Workspace[]): Intent[] {
  const intentsById = new Map<string, Intent>();
  
  for (const workspace of workspaces) {
    const intents = loadIntentsFromWorkspace(workspace);
    
    for (const intent of intents) {
      if (!intentsById.has(intent.id)) {
        intentsById.set(intent.id, intent);
      }
    }
  }
  return [...intentsById.values()];
}

export function saveIntentToWorkspace(workspace: Workspace, id: string, body: IntentBody) {
  const intentDir = join(workspace.intentsDir, id);
  const intentPath = join(intentDir, 'intent.json');
  
  mkdirSync(intentDir, { recursive: true });
  writeFileSync(intentPath, JSON.stringify(body, null, 2) + '\n', 'utf8');
  
  return intentPath;
}

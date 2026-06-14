import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { type Workspace, type Intent, type IntentBody } from '../domain/types.js';
import type { CreateWorkspace, ResolveWorkspaces } from "../domain/contracts.js";

export const createWorkspace: CreateWorkspace = (baseDir) => {
  const repoIntentsDir = join(baseDir, '.repo-intents');
  const intentsDir = join(repoIntentsDir, 'intents');
  
  if (!existsSync(repoIntentsDir)) {
    mkdirSync(repoIntentsDir, { recursive: true });
    mkdirSync(intentsDir, { recursive: true });
  } else {
    console.warn(`${repoIntentsDir} already exists`);
    if (!existsSync(intentsDir)) {
      mkdirSync(intentsDir, { recursive: true });
      console.warn(`Added ${intentsDir}`);
    }
    return
  }
  
  console.log(`Created repo-intents workspace in ${baseDir}`);
};

/**
 * Walks upward from startDir to the filesystem root and collects every
 * directory that contains a `.repo-intents/` folder.
 *
 * Workspaces are returned in nearest-first order, so more specific nested
 * repo-intents directories can override or supplement parent definitions.
 */
export const resolveWorkspaces: ResolveWorkspaces = (startDir: string) => {
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

export function saveIntentToWorkspace(workspace: Workspace, intent: Intent) {
  const { id, ...body } = intent;
  const intentDir = join(workspace.intentsDir, id);
  const intentPath = join(intentDir, 'intent.json');
  
  mkdirSync(intentDir, { recursive: true });
  writeFileSync(intentPath, JSON.stringify(body, null, 2) + '\n', 'utf8');
  
  return intentPath;
}

// /**
//  * Loads all repo intents from a workspace.
//  *
//  * Expected layout:
//  *   .repo-intents/
//  *     intents/
//  *       {some-intent-id}/
//  *         intent.json
//  *
//  * The directory name is used as the intent id.
//  */
// export function loadIntentsFromWorkspace(workspace: Workspace): Intent[] {
//   const intentsDir = join(workspace.repoIntentsDir, 'intents');
//
//   if (!existsSync(intentsDir)) {
//     return [];
//   }
//
//   const dirContents = readdirSync(intentsDir, { withFileTypes: true });
//   const intents: Intent[] = [];
//
//   for (const entry of dirContents.filter((entry) => entry.isDirectory())) {
//     const id = entry.name;
//     const intentPath = join(intentsDir, id, 'intent.json');
//     if (!existsSync(intentPath)) { continue; }
//
//     try {
//       const raw = readFileSync(intentPath, 'utf8');
//       const parsed = JSON.parse(raw);
//       const result = IntentBodySchema.safeParse(parsed);
//
//       if (!result.success) {
//         console.warn(`Invalid intent "${id}" in ${intentPath}:`);
//         for (const issue of result.error.issues) {
//           console.warn(`  - ${issue.path.join('.')}: ${issue.message}`);
//         }
//         continue;
//       }
//
//       const body: IntentBody = result.data;
//       intents.push({
//         id,
//         ...body
//       });
//     } catch (err) {
//       console.warn(`Failed to load intent "${id}":`, err);
//     }
//   }
//   return intents;
// }
//
// /**
//  * Loads all repo intents from all discovered workspaces.
//  *
//  * If multiple workspaces define the same intent id, the nearest workspace
//  * wins because workspaces are expected to be passed in nearest-first order.
//  */
// export function loadIntents(workspaces: Workspace[]): Intent[] {
//   const intentsById = new Map<string, Intent>();
//
//   for (const workspace of workspaces) {
//     const intents = loadIntentsFromWorkspace(workspace);
//
//     for (const intent of intents) {
//       if (!intentsById.has(intent.id)) {
//         intentsById.set(intent.id, intent);
//       }
//     }
//   }
//   return [...intentsById.values()];
// }
//


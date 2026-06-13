import {useMemo, useState, useEffect, type Dispatch, type SetStateAction} from "react";
import { Box, Text, useApp } from 'ink';
import type { Workspace } from '../domain/workspace.js';
import {Intent, IntentSchema} from '../domain/intent.js';
import { createIntentDraft } from "./domain/intentDraft.js";
import { Panel } from './Panel.js';
import { SingleLineEditor } from "./components/SingleLineEditor.js";
import { LongDescEditor } from "./components/LongDescEditor.js";
import { AddActions } from "./AddActions.js";
import {nextPhase, prevPhase, issueIsRelevant, type Phase, formatIssueContext} from './domain/addIntentPhases.js';

type Props = {
  workspace: Workspace;
};

function bindStringField(
  setDraft: Dispatch<SetStateAction<Intent>>,
  field: 'id' | 'shortDesc' | 'longDesc',
): Dispatch<SetStateAction<string>> {
  return (next) => {
    setDraft((prev) => {
      const value =
        typeof next === 'function'
          ? next(prev[field])
          : next;
      
      return {
        ...prev,
        [field]: value,
      };
    });
  };
}

export function AddIntentApp({ workspace }: Props) {
  // ----- Editing Steps -----
  const [phase, setPhase] = useState<Phase>('id');
  const { exit } = useApp();
  const [shouldExit, setShouldExit] = useState(false);
  useEffect(() => {
    if (shouldExit) {
      exit();
    }
  }, [shouldExit, exit]);
  
  // ----- Draft and Validation ----
  const [draft, setDraft] = useState<Intent>(() => createIntentDraft());
  const parsed = useMemo(
    () => IntentSchema.safeParse(draft),
    [draft]
  );
  const validationErr = parsed.success ? [] : parsed.error.issues;
  const relevantErr = validationErr.filter((issue) => issueIsRelevant(issue, phase));
  const errExists = relevantErr.length > 0;
  const compiledIntent = parsed.success ? parsed.data : null;
  
  // Clear screen before exiting:
  if (shouldExit) {
    return null;
  }
  
  return (
    <Box flexDirection="column">
      {/* Header */}
      <Box marginTop={1}>
        <Text bold>New Intent </Text>
        <Text>in {workspace.rootDir}</Text>
      </Box>
      
      <Panel flexGrow={1} borderColor={errExists ? 'red' : 'blue'}>
        {phase === 'id' && (
          <SingleLineEditor
            label='1/4: ID'
            hint={errExists ? 'Esc:Quit' : '⏎:Continue | Esc:Quit' }
            value={draft.id}
            setValue={bindStringField(setDraft, 'id')}
            onNext={() => !errExists && setPhase(nextPhase)}
            onBack={() => setShouldExit(true)}
          />
        )}
        
        {phase === 'shortDesc' && (
          <SingleLineEditor
            label='2/4: One Line Description'
            hint={errExists ? 'Esc:Quit' : '⏎:Continue | Esc:Back' }
            value={draft.shortDesc}
            setValue={bindStringField(setDraft, 'shortDesc')}
            onNext={() => !errExists && setPhase(nextPhase)}
            onBack={()=> setPhase(prevPhase)}
          />
        )}
        
        {phase === 'longDesc' && (
          <LongDescEditor
            label="3/4: Long Description"
            hint={errExists ? '⏎:New line | Esc:Back' : 'Ctrl+N: Next | ⏎:New line | Esc:Back' }
            text={draft.longDesc}
            setText={bindStringField(setDraft, 'longDesc')}
            onSubmit={() => !errExists && setPhase(nextPhase)}
            onEsc={() => setPhase(prevPhase)}
          />
        )}
        
        {phase === 'actions' && (
          <AddActions
            label="4/4: Actions"
            hint={errExists ? 'Ctrl+A:Add Prompt Above | ⏎:Next Field | Esc:Back' : 'Ctrl+S:Submit | Ctrl+A:Add Prompt Above | ⏎:Next Field | Esc:Back' }
            actions={draft.actions}
            setActions={(next) =>
              setDraft((prev) => ({
                ...prev,
                actions: typeof next === 'function' ? next(prev.actions) : next,
              }))
            }
            onBack={() => setPhase(prevPhase)}
            onDone={() => {
              console.log('done');
            }}
          />
        )}
      </Panel>
      
      {/* Validation Errors */}
      <Box>
        {errExists ? (
          <Box flexDirection="column">
            <Text color="red" bold>Validation errors</Text>
            {relevantErr.map((issue, i) => (
              <Text key={`${issue.path.join('.')}-${i}`} color="red">
                - {formatIssueContext(issue, phase)} {issue.message}
              </Text>
            ))}
          </Box>
          ) : compiledIntent ? (
          <Text color="green">Intent is valid and ready to save</Text>
        ) : (
          <Text dimColor>Intent is incomplete</Text>
        )}
      </Box>
    </Box>
  );
}
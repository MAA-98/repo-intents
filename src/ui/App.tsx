import { useEffect, useState } from 'react';
import { Text, useApp } from 'ink';

import { Screen } from './domain/screen.js';
import { EditIntentScreen } from './EditIntentScreen.js';
import { SearchIntentsApp } from './SearchIntentsApp.js';

type Props = {
  initial: Screen;
};

type ExitState = {
  shouldExit: boolean;
  message?: string;
};

export function App({ initial }: Props) {
  const [screen, setScreen] = useState<Screen>(initial);
  const { exit } = useApp();
  // Need exit state to have a single step to render before quiting app:
  const [exitState, setExitState] = useState<ExitState>({
    shouldExit: false,
  });
  useEffect(() => {
    if (exitState.shouldExit) {
      exit();
    }
  }, [exitState, exit]);

  // Screen before exiting:
  if (exitState.shouldExit) {
    if (!exitState.message) {
      return null;
    }
    return <Text>{exitState.message}</Text>;
  }

  if (screen.kind === 'editIntent') {
    return (
      <EditIntentScreen
        workspace={screen.workspace}
        saveIntentToWorkspace={screen.saveIntentToWorkspace}
        validateIntent={screen.validateIntent}
        draft={screen.draft}
        onExit={(message) => setExitState({ shouldExit: true, message })}
      />
    );
  }

  if (screen.kind === 'searchIntents') {
    return null;
    //   <SearchIntentsApp
    //     intents={screen.intents}
    //     initialQuery={screen.initialQuery}
    //     onExit={setExitState({ shouldExit: true })}
    //   />
    // );
  }
}

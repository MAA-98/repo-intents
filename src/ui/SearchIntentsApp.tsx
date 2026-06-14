import React, { useEffect, useMemo, useState } from 'react';
import { Box, Text, useApp, useInput } from 'ink';
import type { Intent } from '../domain/types.js';
import {SearchIntents} from "../domain/contracts.js";

type Props = {
  intents: Intent[];
  initialQuery?: string;
  search: SearchIntents;
  onSelect?: (intent: Intent) => void;
  onExit?: () => void;
};

export function SearchIntentsApp({ intents, initialQuery = '', search, onSelect, onExit }: Props) {
  const { exit } = useApp();
  const [query, setQuery] = useState(initialQuery);
  const [activeIndex, setActiveIndex] = useState(0);

  const matches = useMemo(
    () => search(query, intents),
    [query, intents, search]
  );

  useEffect(() => {
    setActiveIndex((i) => Math.max(0, Math.min(i, Math.max(0, matches.length - 1))));
  }, [matches.length]);

  useInput((input, key) => {
    if (key.escape) {
      if (onExit) {
        onExit();
      } else {
        exit();
      }
      return;
    }

    if (key.upArrow) {
      setActiveIndex((i) => Math.max(0, i - 1));
      return;
    }

    if (key.downArrow) {
      setActiveIndex((i) => Math.min(matches.length - 1, i + 1));
      return;
    }

    if (key.return) {
      const selected = matches[activeIndex];
      if (selected && onSelect) {
        onSelect(selected);
      }
      return;
    }

    if (key.backspace || key.delete) {
      setQuery((value) => value.slice(0, -1));
      return;
    }

    if (!key.ctrl && input) {
      setQuery((value) => value + input);
    }
  });

  const selected = matches[activeIndex];

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Text bold>Search intents</Text>
      </Box>

      <Box marginBottom={1}>
        <Text color="cyan">Query: </Text>
        <Text>{query}</Text>
        <Text inverse> </Text>
      </Box>

      <Box flexDirection="column">
        {matches.length === 0 ? (
          <Text dimColor>No matches</Text>
        ) : (
          matches.map((intent, index) => (
            <Box key={intent.id} flexDirection="column" marginBottom={1}>
              <Text color={index === activeIndex ? 'green' : undefined}>
                {index === activeIndex ? '> ' : '  '}
                {intent.id} — {intent.shortDesc}
              </Text>

              {index === activeIndex && (
                <Box marginLeft={2} flexDirection="column">
                  <Text dimColor>{intent.longDesc}</Text>
                </Box>
              )}
            </Box>
          ))
        )}
      </Box>

      <Box marginTop={1}>
        <Text dimColor>
          {selected
            ? 'Enter: select | Esc: exit | ↑/↓: navigate'
            : 'Esc: exit'}
        </Text>
      </Box>
    </Box>
  );
}
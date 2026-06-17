import React from 'react';
import { Box, Text } from 'ink';
import type { Intent } from '../../domain/types.js';

type Props = {
  intent: Intent;
  isSelected?: boolean;
};

export function SearchIntentResultItem({ intent, isSelected = false }: Props) {
  return (
    <Box
      flexDirection="column"
      borderStyle={isSelected ? 'round' : undefined}
      paddingX={isSelected ? 1 : 0}
      paddingY={isSelected ? 0 : 0}
      marginBottom={1}
    >
      <Text color={isSelected ? 'green' : undefined} bold={isSelected}>
        {isSelected ? '▶ ' : '  '}
        {intent.id} : {intent.shortDesc}
      </Text>

      {isSelected && (
        <Box marginTop={0} marginLeft={2} flexDirection="column">
          <Text dimColor>{intent.longDesc}</Text>
        </Box>
      )}
    </Box>
  );
}

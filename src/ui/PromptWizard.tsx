// import React, { useMemo, useState } from 'react';
// import {Box, Text, useInput} from 'ink';
//
// type PromptStep = {
//   varName: string;
//   prompt: string;
//   required?: boolean;
//   default?: string;
// };
//
// type PromptAnswer = {
//   prompt: string;
//   answer: string;
// };
//
// type Props = {
//   steps: PromptStep[];
//   onDone: (answers: Record<string, string>) => void;
// };
//
// export function PromptWizard({steps, onDone}: Props) {
//   const [stepIndex, setStepIndex] = useState(0);
//   const [currentValue, setCurrentValue] = useState('');
//   const [history, setHistory] = useState<PromptAnswer[]>([]);
//   const [answers, setAnswers] = useState<Record<string, string>>({});
//
//   const step = steps[stepIndex];
//
//   useInput((input, key) => {
//     if (!step) return;
//
//     if (key.return) {
//       const trimmed = currentValue.trim();
//       const value = trimmed || step.default || '';
//
//       if (step.required && !value) {
//         return;
//       }
//
//       const nextAnswers = {...answers, [step.varName]: value};
//
//       setAnswers(nextAnswers);
//       setHistory([...history, {prompt: step.prompt, answer: value}]);
//       setCurrentValue('');
//
//       if (stepIndex + 1 >= steps.length) {
//         onDone(nextAnswers);
//       } else {
//         setStepIndex(stepIndex + 1);
//       }
//
//       return;
//     }
//
//     if (key.backspace || key.delete) {
//       setCurrentValue((v) => v.slice(0, -1));
//       return;
//     }
//
//     if (input) {
//       setCurrentValue((v) => v + input);
//     }
//   });
//
//   if (!step) {
//     return null;
//   }
//
//   return (
//     <Box flexDirection="column">
//       {history.map((item, index) => (
//         <Box key={index} flexDirection="column" marginBottom={1}>
//           <Text>{item.prompt}</Text>
//           <Text color="green">{'> '}{item.answer}</Text>
//         </Box>
//       ))}
//
//       <Box flexDirection="column">
//         <Text>{step.prompt}{step.default ? ` (${step.default})` : ''}</Text>
//         <Text>
//           <Text color="cyan">{'> '}</Text>
//           {currentValue}
//           <Text inverse> </Text>
//         </Text>
//       </Box>
//     </Box>
//   );
// }
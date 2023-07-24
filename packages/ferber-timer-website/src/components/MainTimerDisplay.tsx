import React from "react";
import { State } from "../constants/constants";
import { MainTimerDisplayProps } from "../types/types";

import { Box, Heading, VStack, Text } from "@chakra-ui/react";

export default function MainTimerDisplay(props: MainTimerDisplayProps) {
  return (
    <div>
      <Box backgroundColor="#CBD5E0" color="black" w="100vw">
        {props.state === State.Victory ? (
          <VStack p={[8, 8, 16]} spacing={8}>
            <Text color="gray.600">
              It took {props.roundIndex + 1} round(s) to achieve this
            </Text>
            <Heading as="h2" fontSize="95px" color="orange.500">
              Victory!
            </Heading>
          </VStack>
        ) : (
          <VStack p={[8, 8, 16]} spacing={8}>
            <Text color="gray.600">Round {props.roundIndex + 1}</Text>
            <Heading as="h2" fontSize="95px">
              {Math.floor(props.timerRemainingSeconds / 60)
                .toString()
                .padStart(2, "0")}
              :{(props.timerRemainingSeconds % 60).toString().padStart(2, "0")}
            </Heading>
          </VStack>
        )}
      </Box>
    </div>
  );
}

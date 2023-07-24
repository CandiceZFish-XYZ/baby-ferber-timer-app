import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Button,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  Center,
  Grid,
  useDisclosure,
  Icon,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import { FaRegClock } from "@react-icons/all-files/fa/FaRegClock";
import { FaRegTired } from "@react-icons/all-files/fa/FaRegTired";
import { FaRegMeh } from "@react-icons/all-files/fa/FaRegMeh";
import { FaRegThumbsUp } from "@react-icons/all-files/fa/FaRegThumbsUp";
import { FaPlay } from "@react-icons/all-files/fa/FaPlay";

import { MainControlsProps } from "../types/types";
import { State } from "../constants/constants";

export default function MainControls(props: MainControlsProps) {
  const {
    isOpen: isDialogOpen,
    onOpen: onDialogOpen,
    onClose: onDialogClose,
  } = useDisclosure();
  const nextRef = useRef();

  const [initialStartTime, setInitialStartTime] = useState<number | undefined>(
    undefined
  );
  const [totalTimeSeconds, setTotalTimeSeconds] = useState<number | undefined>(
    undefined
  );
  const [totalCrySeconds, setTotalCrySeconds] = useState<number | undefined>(
    undefined
  );

  const isStartButtonEnabled =
    props.state === State.Initial ||
    props.state === State.RoundInitial ||
    props.state === State.Paused;
  const isPauseButtonEnabled = props.state === State.Started;
  const isVictoryButtonEnabled = props.state !== State.Initial;
  const isRestartButtonEnabled = props.state === State.Victory;

  const updateTimeStats = (additionalCrySeconds: number) => {
    setTotalCrySeconds((prev) => additionalCrySeconds + (prev ?? 0));
    setTotalTimeSeconds(props.timeSeconds - (initialStartTime ?? 0));
  };

  useEffect(() => {
    const handleTimerUp = () => {
      let addTime = props.timerStart
        ? props.timeSeconds - props.timerStart
        : props.timeSeconds;

      if (props.state === State.Started) {
        props.setTimerTotalSeconds(props.ferberCheckInSeconds);
        props.setState(State.CheckInInitial);
        updateTimeStats(addTime);
      } else if (props.state === State.CheckInStarted) {
        props.setRoundIndex((prev) => prev + 1);
        props.setState(State.RoundInitial);
        updateTimeStats(0);
      }
      onDialogOpen();
    };

    if (props.timerRemainingSeconds <= 0) {
      handleTimerUp();
    }
  }, [props.timerRemainingSeconds]);

  const startHandler = () => {
    props.setTimerStart(props.timeSeconds);
    setInitialStartTime((prev) => prev ?? props.timeSeconds);
    props.setState(State.Started);
  };

  const pauseHandler = () => {
    props.setTimerTotalSeconds(props.timerRemainingSeconds);
    let addTime = props.timerStart
      ? props.timeSeconds - props.timerStart
      : props.timeSeconds;
    updateTimeStats(addTime);
    props.setState(State.Paused);
  };

  const handleDialogClose = () => {
    if (props.state === State.RoundInitial) {
      props.setState(State.Started);
    } else if (props.state === State.CheckInInitial) {
      props.setState(State.CheckInStarted);
    }

    props.setTimerStart(props.timeSeconds);
    onDialogClose();
  };

  const victoryHandler = () => {
    let addTime = props.timerStart
      ? props.timeSeconds - props.timerStart
      : props.timeSeconds;
    if (props.state === State.Started) {
      updateTimeStats(addTime);
    } else {
      updateTimeStats(0);
    }

    props.setState(State.Victory);
  };

  const restartHandler = () => {
    props.setRoundIndex(0);
    props.setState(State.Initial);
    setTotalTimeSeconds(undefined);
    setTotalCrySeconds(undefined);
    setInitialStartTime(undefined);
  };

  const checkInMsg = (
    <>
      <Text>Check in time! </Text>
      <Text>
        Now you should check on your baby briefly for
        {props.usingSeconds
          ? ` ${props.ferberCheckInSeconds} seconds`
          : ` ${Math.floor(props.ferberCheckInSeconds / 60)} minutes!`}
      </Text>
    </>
  );
  const nextRndMsg = (
    <>
      <Text> Next round! </Text>
      <Text>
        Let's start round {props.roundIndex + 1} for
        {props.usingSeconds
          ? ` ${props.timerTotalSeconds} seconds`
          : ` ${Math.floor(props.timerTotalSeconds / 60)} minutes!`}
      </Text>
    </>
  );

  return (
    <div>
      <Box w={[300, 300, 768]}>
        <Center>
          <StatGroup w="250px">
            <Stat>
              <StatLabel>
                <Icon as={FaRegTired} mr={1} />
                Total Cry
              </StatLabel>
              <StatNumber>
                {totalCrySeconds
                  ? props.usingSeconds
                    ? `${totalCrySeconds} s`
                    : `${Math.floor(totalCrySeconds / 60)} mins`
                  : "---"}
              </StatNumber>
            </Stat>
            <Stat>
              <StatLabel>
                <Icon as={FaRegClock} mr={1} />
                Total Time
              </StatLabel>
              <StatNumber>
                {totalTimeSeconds
                  ? props.usingSeconds
                    ? `${totalTimeSeconds} s`
                    : `${Math.floor(totalTimeSeconds / 60)} mins`
                  : "---"}
              </StatNumber>
            </Stat>
          </StatGroup>
        </Center>
        <Grid templateColumns={{ md: "repeat(2, 1fr)" }} gap={[2, 2, 4]} p={4}>
          {isStartButtonEnabled ? (
            <Button
              colorScheme="blue"
              onClick={startHandler}
              leftIcon={<FaRegTired />}
              size="lg"
            >
              Crying Started
            </Button>
          ) : (
            <Button
              colorScheme="blue"
              isDisabled={!isPauseButtonEnabled}
              onClick={pauseHandler}
              leftIcon={<FaRegMeh />}
              size="lg"
            >
              Crying Pause
            </Button>
          )}
          {isRestartButtonEnabled ? (
            <Button
              colorScheme="orange"
              onClick={restartHandler}
              leftIcon={<FaPlay />}
              size="lg"
            >
              Start New Training
            </Button>
          ) : (
            <Button
              colorScheme="orange"
              isDisabled={!isVictoryButtonEnabled}
              onClick={victoryHandler}
              leftIcon={<FaRegThumbsUp />}
              size="lg"
            >
              Victory!
            </Button>
          )}
        </Grid>
      </Box>
      <AlertDialog
        isOpen={isDialogOpen}
        leastDestructiveRef={nextRef}
        onClose={handleDialogClose}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent bg="gray.100">
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Time's Up!
            </AlertDialogHeader>

            <AlertDialogBody>
              {props.state === State.CheckInInitial && checkInMsg}
              {props.state === State.RoundInitial && nextRndMsg}
            </AlertDialogBody>

            <AlertDialogFooter justifyContent="center">
              {props.state === State.CheckInInitial && (
                <Button
                  ref={nextRef}
                  colorScheme="blue"
                  onClick={handleDialogClose}
                  flex="1"
                >
                  Check In
                </Button>
              )}
              {props.state === State.RoundInitial && (
                <Button
                  ref={nextRef}
                  colorScheme="blue"
                  onClick={handleDialogClose}
                  flex="1"
                >
                  Start
                </Button>
              )}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </div>
  );
}

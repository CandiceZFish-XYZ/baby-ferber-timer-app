import React, { useEffect, useState } from "react";
import FullScreenSection from "./components/FullScreenSection";
import HeaderSettings from "./components/HeaderSettings";
import MainTimerDisplay from "./components/MainTimerDisplay";
import MainControls from "./components/MainControls";

import {
  TOAST_MSG,
  TOAST_MSG_LENGTH,
  FERBER_DEFAULT_PLAN_SECONDS,
  FERBER_DEFAULT_CHECK_IN_SECONDS,
  State,
} from "./constants/constants";

import { getTimeSeconds } from "./helper/helper";

import { useToast } from "@chakra-ui/react";

export default function App() {
  const toast = useToast();

  const [state, setState] = useState<State>(State.Initial);

  const [ferberDayIndex, setFerberDayIndex] = useState<number>(0);
  const [currentDayPlanSeconds, setCurrentDayPlanSeconds] = useState<number[]>(
    FERBER_DEFAULT_PLAN_SECONDS[ferberDayIndex]
  );
  const [ferberCheckInSeconds, setFerberCheckInSeconds] = useState<number>(
    FERBER_DEFAULT_CHECK_IN_SECONDS
  );

  const [usingSeconds, setUsingSeconds] = useState<boolean>(false);
  const [roundIndex, setRoundIndex] = useState<number>(0);

  const [timeSeconds, setTimeSeconds] = useState(getTimeSeconds());
  const [timerStart, setTimerStart] = useState<number | undefined>(undefined);
  const [timerTotalSeconds, setTimerTotalSeconds] = useState<number>(
    currentDayPlanSeconds[0]
  );
  const [timerRemainingSeconds, setTimerRemainingSeconds] =
    useState<number>(timerTotalSeconds);

  //update timerTotalSeconds when change plan
  useEffect(() => {
    setTimerTotalSeconds(currentDayPlanSeconds[0]);
  }, [currentDayPlanSeconds]);

  // update Round number(index)
  useEffect(() => {
    let roundNum = roundIndex < 3 ? roundIndex : 2;
    setTimerTotalSeconds(currentDayPlanSeconds[roundNum]);
  }, [roundIndex]);

  const updateTimer = (
    currentState,
    currentTimerStart,
    currentTimerTotalSeconds
  ) => {
    const currTime = getTimeSeconds();
    setTimeSeconds(currTime);

    if (
      (currentState === State.Started ||
        currentState === State.CheckInStarted) &&
      currentTimerStart
    ) {
      setTimerRemainingSeconds(
        Math.max(
          0,
          Math.round(currentTimerTotalSeconds - (currTime - currentTimerStart))
        )
      );
    } else {
      setTimerRemainingSeconds(currentTimerTotalSeconds);
    }

    if (
      currentState !== State.Initial &&
      currentState !== State.Victory &&
      currTime % 20 === 0
    ) {
      showRandomToast();
    }
  };

  const showRandomToast = () => {
    const randomMsg = Math.floor(Math.random() * TOAST_MSG_LENGTH);
    toast({
      description: TOAST_MSG[randomMsg],
      status: "success",
      duration: 5000,
      variant: "subtle",
      isClosable: true,
    });
  };

  useEffect(() => {
    const timeout = setTimeout(
      () => updateTimer(state, timerStart, timerTotalSeconds),
      1000
    );
    return () => clearTimeout(timeout);
  });

  return (
    <div id="ferber-timer">
      <FullScreenSection
        backgroundColor="gray.900"
        isDarkBackground
        py={16}
        spacing={8}
        color="blue.50"
      >
        <HeaderSettings
          state={state}
          ferberDayIndex={ferberDayIndex}
          setFerberDayIndex={setFerberDayIndex}
          usingSeconds={usingSeconds}
          setUsingSeconds={setUsingSeconds}
          ferberCheckInSeconds={ferberCheckInSeconds}
          setFerberCheckInSeconds={setFerberCheckInSeconds}
          currentDayPlanSeconds={currentDayPlanSeconds}
          setCurrentDayPlanSeconds={setCurrentDayPlanSeconds}
        />
        <MainTimerDisplay
          state={state}
          roundIndex={roundIndex}
          timerRemainingSeconds={timerRemainingSeconds}
        />
        <MainControls
          state={state}
          setState={setState}
          usingSeconds={usingSeconds}
          ferberCheckInSeconds={ferberCheckInSeconds}
          currentDayPlanSeconds={currentDayPlanSeconds}
          roundIndex={roundIndex}
          setRoundIndex={setRoundIndex}
          timeSeconds={timeSeconds}
          timerRemainingSeconds={timerRemainingSeconds}
          timerStart={timerStart}
          setTimerStart={setTimerStart}
          timerTotalSeconds={timerTotalSeconds}
          setTimerTotalSeconds={setTimerTotalSeconds}
        />
      </FullScreenSection>
    </div>
  );
}

import React, { useEffect, useState, useRef } from "react";
import {
  Flex,
  Spacer,
  Box,
  Heading,
  VStack,
  Button,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  Center,
  Grid,
  Show,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  InputLeftElement,
  InputRightElement,
  Select,
  FormControl,
  FormLabel,
  Icon,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  HStack,
  Switch,
  Badge,
} from "@chakra-ui/react";
import { FaCog } from "@react-icons/all-files/fa/FaCog";
import { FaSadCry } from "@react-icons/all-files/fa/FaSadCry";
import { FaHeart } from "@react-icons/all-files/fa/FaHeart";
import { FaRegClock } from "@react-icons/all-files/fa/FaRegClock";
import { FaRegTired } from "@react-icons/all-files/fa/FaRegTired";
import { FaRegMeh } from "@react-icons/all-files/fa/FaRegMeh";
import { FaRegThumbsUp } from "@react-icons/all-files/fa/FaRegThumbsUp";
import { FaPlay } from "@react-icons/all-files/fa/FaPlay";
import FullScreenSection from "./components/FullScreenSection";
import { useToast } from "@chakra-ui/react";

const TOAST_MSG = [
  "Consistency is the key! ",
  "Soon enough your baby will be sleeping peacefully through the night!",
  "You're doing a great job helping your baby to learn and grow!",
  "Almost there! Stay strong and trust your baby!",
  "Keep in mind that this temporary discomfort leads to long-term benefits for both of you and your baby!",
  "You are not alone! Stay consistent and stick with the plan!",
  "Remember that every baby is different, and progress may come at different speeds - stay patient and trust the process.",
  "Believe in yourself and your baby - you are both capable of achieving healthy sleep habits.",
  "It's essential to take breaks and practice self-care during this process -- a well-rested caregiver leads to a well-rested baby!",
  "Celebrate even the smallest victories along the way - each step forward is progress.",
  "A good night's sleep is important for your baby's growth and development!",
];
const TOAST_MSG_LENGTH = TOAST_MSG.length;
const FERBER_DEFAULT_PLAN_SECONDS = [
  [3 * 60, 5 * 60, 10 * 60],
  [5 * 60, 10 * 60, 12 * 60],
  [10 * 60, 12 * 60, 15 * 60],
  [12 * 60, 15 * 60, 17 * 60],
  [15 * 60, 17 * 60, 20 * 60],
  [17 * 60, 20 * 60, 25 * 60],
  [20 * 60, 25 * 60, 30 * 60],
];

const FERBER_DEFAULT_CHECK_IN_SECONDS = 60;

const enum State {
  Initial,
  RoundInitial,
  Started,
  Paused,
  CheckInInitial,
  CheckInStarted,
  Victory,
}

const getTimeSeconds = () => Math.floor(Date.now() / 1000);

export default function App() {
  const {
    isOpen: isSettingOpen,
    onOpen: onSettingOpen,
    onClose: onSettingClose,
  } = useDisclosure();
  const {
    isOpen: isDialogOpen,
    onOpen: onDialogOpen,
    onClose: onDialogClose,
  } = useDisclosure();
  const nextRef = useRef();
  const toast = useToast();

  const [ferberDayIndex, setFerberDayIndex] = useState<number>(0);
  const [ferberCheckInSeconds, setFerberCheckInSeconds] = useState<number>(
    FERBER_DEFAULT_CHECK_IN_SECONDS
  );
  const [currentDayPlanSeconds, setCurrentDayPlanSeconds] = useState<number[]>(
    FERBER_DEFAULT_PLAN_SECONDS[ferberDayIndex]
  );

  const [usingSeconds, setUsingSeconds] = useState<boolean>(false);
  const [roundIndex, setRoundIndex] = useState<number>(0);
  const [timeSeconds, setTimeSeconds] = useState(getTimeSeconds());
  const [state, setState] = useState<State>(State.Initial);
  const [initialStartTime, setInitialStartTime] = useState<number | undefined>(
    undefined
  );
  const [totalTimeSeconds, setTotalTimeSeconds] = useState<number | undefined>(
    undefined
  );
  const [totalCrySeconds, setTotalCrySeconds] = useState<number | undefined>(
    undefined
  );
  const [timerStart, setTimerStart] = useState<number | undefined>(undefined);
  const [timerTotalSeconds, setTimerTotalSeconds] = useState<number>(
    currentDayPlanSeconds[0]
  );

  const isStartButtonEnabled =
    state === State.Initial ||
    state === State.RoundInitial ||
    state === State.Paused;
  const isPauseButtonEnabled = state === State.Started;
  const isVictoryButtonEnabled = state !== State.Initial;
  const isRestartButtonEnabled = state === State.Victory;

  const timerRemainingSeconds = Math.round(
    timerTotalSeconds -
      ((state === State.Started || state === State.CheckInStarted) && timerStart
        ? timeSeconds - timerStart
        : 0)
  );

  useEffect(() => {
    setTimerTotalSeconds(currentDayPlanSeconds[0]);
  }, [currentDayPlanSeconds]);

  useEffect(() => {
    let roundNum = roundIndex < 3 ? roundIndex : 2;
    setTimerTotalSeconds(currentDayPlanSeconds[roundNum]);
  }, [roundIndex]);

  const updateTimeStats = (additionalCrySeconds: number) => {
    setTotalCrySeconds((prev) => additionalCrySeconds + (prev ?? 0));
    setTotalTimeSeconds(timeSeconds - (initialStartTime ?? 0));
  };

  const handleTimerUp = () => {
    let addTime = timerStart ? timeSeconds - timerStart : timeSeconds;

    if (state === State.Started) {
      setTimerTotalSeconds(ferberCheckInSeconds);
      setState(State.CheckInInitial);
      updateTimeStats(addTime);
    } else if (state === State.CheckInStarted) {
      setRoundIndex((prev) => prev + 1);
      setState(State.RoundInitial);
      updateTimeStats(0);
    }
    onDialogOpen();
  };

  if (timerRemainingSeconds <= 0) {
    handleTimerUp();
  }

  const startHandler = () => {
    setTimerStart(timeSeconds);
    setInitialStartTime((prev) => prev ?? timeSeconds);
    setState(State.Started);
  };

  const pauseHandler = () => {
    setTimerTotalSeconds(timerRemainingSeconds);
    let addTime = timerStart ? timeSeconds - timerStart : timeSeconds;
    updateTimeStats(addTime);
    setState(State.Paused);
  };

  const handleDialogClose = () => {
    if (state === State.RoundInitial) {
      setState(State.Started);
    } else if (state === State.CheckInInitial) {
      setState(State.CheckInStarted);
    }

    setTimerStart(timeSeconds);
    onDialogClose();
  };

  const victoryHandler = () => {
    let addTime = timerStart ? timeSeconds - timerStart : timeSeconds;
    if (state === State.Started) {
      updateTimeStats(addTime);
    } else {
      updateTimeStats(0);
    }

    setState(State.Victory);
  };

  const restartHandler = () => {
    setRoundIndex(0);
    setState(State.Initial);
    setTotalTimeSeconds(undefined);
    setTotalCrySeconds(undefined);
    setInitialStartTime(undefined);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      let currTime = getTimeSeconds();
      setTimeSeconds(currTime);

      if (
        state !== State.Initial &&
        state !== State.Victory &&
        currTime % 20 === 0
      ) {
        let randomMsg = Math.floor(Math.random() * TOAST_MSG_LENGTH);
        toast({
          description: TOAST_MSG[randomMsg],
          status: "success",
          duration: 5000,
          variant: "subtle",
          isClosable: true,
        });
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  });

  const checkInMsg = (
    <>
      <Text>Check in time! </Text>
      <Text>
        Now you should check on your baby briefly for
        {usingSeconds
          ? ` ${ferberCheckInSeconds} seconds`
          : ` ${Math.floor(ferberCheckInSeconds / 60)} minutes!`}
      </Text>
    </>
  );
  const nextRndMsg = (
    <>
      <Text> Next round! </Text>
      <Text>
        Let's start round {roundIndex + 1} for
        {usingSeconds
          ? ` ${timerTotalSeconds} seconds`
          : ` ${Math.floor(timerTotalSeconds / 60)} minutes!`}
      </Text>
    </>
  );

  const [formDataSeconds, setFormDataSeconds] = useState({
    day: (ferberDayIndex + 1).toString(),
    round_1: currentDayPlanSeconds[0].toString(),
    round_2: currentDayPlanSeconds[1].toString(),
    round_3: currentDayPlanSeconds[2].toString(),
    check_in: ferberCheckInSeconds.toString(),
  });

  const [isCustomizedPlan, setIsCustomizedPlan] = useState(false);
  const [isUserTyped, setIsUserTyped] = useState(false);

  const handleSettingFormOpen = () => {
    setIsUserTyped(false);
    let newFormData = {
      day: (ferberDayIndex + 1).toString(),
      round_1: currentDayPlanSeconds[0].toString(),
      round_2: currentDayPlanSeconds[1].toString(),
      round_3: currentDayPlanSeconds[2].toString(),
      check_in: ferberCheckInSeconds.toString(),
    };

    setFormDataSeconds(newFormData);
    onSettingOpen();
  };

  const setToDefault = (val: number) => {
    setIsUserTyped(false);
    setIsCustomizedPlan(false);
    let dayIndex = val - 1;
    let newFormData = {
      day: val.toString(),
      round_1: FERBER_DEFAULT_PLAN_SECONDS[dayIndex][0].toString(),
      round_2: FERBER_DEFAULT_PLAN_SECONDS[dayIndex][1].toString(),
      round_3: FERBER_DEFAULT_PLAN_SECONDS[dayIndex][2].toString(),
      check_in: FERBER_DEFAULT_CHECK_IN_SECONDS.toString(),
    };

    setFormDataSeconds(newFormData);
  };

  const savePlan = () => {
    setIsCustomizedPlan(true);
    setFerberDayIndex(Number(formDataSeconds.day) - 1);
    setFerberCheckInSeconds(Number(formDataSeconds.check_in));
    let newPlanSeconds = [
      Number(formDataSeconds.round_1),
      Number(formDataSeconds.round_2),
      Number(formDataSeconds.round_3),
    ];
    setCurrentDayPlanSeconds(newPlanSeconds);
    onSettingClose();
  };

  return (
    <div id="ferber-timer">
      <FullScreenSection
        backgroundColor="gray.900"
        isDarkBackground
        py={16}
        spacing={8}
        color="blue.50"
      >
        <Flex w={[300, 300, 768]} pb={6}>
          <Heading as="h1">Ferber Timer Day {ferberDayIndex + 1}</Heading>
          <Spacer />
          <Show above="md">
            <Button
              rightIcon={<FaCog />}
              colorScheme="blue"
              onClick={handleSettingFormOpen}
              isDisabled={state !== State.Initial}
            >
              Show Plan
            </Button>
          </Show>
          <Show below="md">
            <Button
              rightIcon={<FaCog />}
              colorScheme="blue"
              pr={6}
              alignSelf="center"
              onClick={handleSettingFormOpen}
              isDisabled={state !== State.Initial}
            ></Button>
          </Show>
        </Flex>
        <Box backgroundColor="#CBD5E0" color="black" w="100vw">
          {state === State.Victory ? (
            <VStack p={[8, 8, 16]} spacing={8}>
              <Text color="gray.600">
                It took {roundIndex + 1} round(s) to achieve this
              </Text>
              <Heading as="h2" fontSize="95px" color="orange.500">
                Victory!
              </Heading>
            </VStack>
          ) : (
            <VStack p={[8, 8, 16]} spacing={8}>
              <Text color="gray.600">Round {roundIndex + 1}</Text>
              <Heading as="h2" fontSize="95px">
                {Math.floor(timerRemainingSeconds / 60)
                  .toString()
                  .padStart(2, "0")}
                :{(timerRemainingSeconds % 60).toString().padStart(2, "0")}
              </Heading>
            </VStack>
          )}
        </Box>
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
                    ? usingSeconds
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
                    ? usingSeconds
                      ? `${totalTimeSeconds} s`
                      : `${Math.floor(totalTimeSeconds / 60)} mins`
                    : "---"}
                </StatNumber>
              </Stat>
            </StatGroup>
          </Center>
          <Grid
            templateColumns={{ md: "repeat(2, 1fr)" }}
            gap={[2, 2, 4]}
            p={4}
          >
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
                {state === State.CheckInInitial && checkInMsg}
                {state === State.RoundInitial && nextRndMsg}
              </AlertDialogBody>

              <AlertDialogFooter justifyContent="center">
                {state === State.CheckInInitial && (
                  <Button
                    ref={nextRef}
                    colorScheme="blue"
                    onClick={handleDialogClose}
                    flex="1"
                  >
                    Check In
                  </Button>
                )}
                {state === State.RoundInitial && (
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
        <Modal
          isOpen={isSettingOpen}
          onClose={() => {
            onSettingClose();
          }}
        >
          <ModalOverlay />
          <ModalContent p={[1, 1, 0]}>
            <ModalHeader>Ferber Sleep training Plan</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl display="flex" justifyContent="flex-end">
                <FormLabel htmlFor="switchToSeconds" mb="0" as="i">
                  Use seconds?
                </FormLabel>
                <Switch
                  id="switchToSeconds"
                  isChecked={usingSeconds}
                  onChange={() => {
                    setUsingSeconds((prev) => !prev);
                  }}
                />
              </FormControl>
              <FormControl>
                <FormLabel>
                  Day
                  {isCustomizedPlan || isUserTyped ? (
                    <Badge colorScheme="purple" as="i" ml={2}>
                      customized plan
                    </Badge>
                  ) : (
                    ""
                  )}
                </FormLabel>
                <Select
                  name="day"
                  defaultValue={formDataSeconds.day}
                  onChange={(e) => {
                    setToDefault(Number(e.target.value));
                  }}
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>
                  Round 1 <Icon as={FaSadCry} ml={2} />
                </FormLabel>
                <InputGroup>
                  <Input
                    type="number"
                    name="round_1"
                    value={
                      formDataSeconds.round_1
                        ? usingSeconds
                          ? formDataSeconds.round_1
                          : Math.floor(Number(formDataSeconds.round_1) / 60)
                        : ""
                    }
                    onChange={(e) => {
                      setIsUserTyped(true);
                      let val = e.target.value;
                      if (!usingSeconds) {
                        val = (Number(e.target.value) * 60).toString();
                      }
                      setFormDataSeconds({
                        ...formDataSeconds,
                        round_1: val,
                      });
                    }}
                    onBlur={(e) => {
                      e.target.reportValidity();
                    }}
                    required
                  />
                  {usingSeconds ? (
                    <InputRightAddon children="seconds" />
                  ) : (
                    <InputRightAddon children="mins" />
                  )}
                </InputGroup>
              </FormControl>
              <FormControl>
                <FormLabel>
                  Round 2 <Icon as={FaSadCry} ml={2} />
                </FormLabel>
                <InputGroup>
                  <Input
                    type="number"
                    name="round_2"
                    value={
                      formDataSeconds.round_2
                        ? usingSeconds
                          ? formDataSeconds.round_2
                          : Math.floor(Number(formDataSeconds.round_2) / 60)
                        : ""
                    }
                    onChange={(e) => {
                      setIsUserTyped(true);
                      let val = e.target.value;
                      if (!usingSeconds) {
                        val = (Number(e.target.value) * 60).toString();
                      }
                      setFormDataSeconds({
                        ...formDataSeconds,
                        round_2: val,
                      });
                    }}
                    onBlur={(e) => {
                      e.target.reportValidity();
                    }}
                    required
                  />
                  {usingSeconds ? (
                    <InputRightAddon children="seconds" />
                  ) : (
                    <InputRightAddon children="mins" />
                  )}
                </InputGroup>
              </FormControl>
              <FormControl>
                <FormLabel>
                  Round 3+ <Icon as={FaSadCry} ml={2} />
                </FormLabel>
                <InputGroup>
                  <Input
                    type="number"
                    name="round_3"
                    value={
                      formDataSeconds.round_3
                        ? usingSeconds
                          ? formDataSeconds.round_3
                          : Math.floor(Number(formDataSeconds.round_3) / 60)
                        : ""
                    }
                    onChange={(e) => {
                      setIsUserTyped(true);
                      let val = e.target.value;
                      if (!usingSeconds) {
                        val = (Number(e.target.value) * 60).toString();
                      }
                      setFormDataSeconds({
                        ...formDataSeconds,
                        round_3: val,
                      });
                    }}
                    onBlur={(e) => {
                      e.target.reportValidity();
                    }}
                    required
                  />
                  {usingSeconds ? (
                    <InputRightAddon children="seconds" />
                  ) : (
                    <InputRightAddon children="mins" />
                  )}
                </InputGroup>
              </FormControl>
              <FormControl>
                <FormLabel>
                  Check In <Icon as={FaHeart} ml={2} />
                </FormLabel>
                <InputGroup>
                  <Input
                    type="number"
                    name="check_in"
                    value={
                      formDataSeconds.check_in
                        ? usingSeconds
                          ? formDataSeconds.check_in
                          : Math.floor(Number(formDataSeconds.check_in) / 60)
                        : ""
                    }
                    onChange={(e) => {
                      setIsUserTyped(true);
                      let val = e.target.value;
                      if (!usingSeconds) {
                        val = (Number(e.target.value) * 60).toString();
                      }
                      setFormDataSeconds({
                        ...formDataSeconds,
                        check_in: val,
                      });
                    }}
                    onBlur={(e) => {
                      e.target.reportValidity();
                    }}
                    required
                  />
                  {usingSeconds ? (
                    <InputRightAddon children="seconds" />
                  ) : (
                    <InputRightAddon children="mins" />
                  )}
                </InputGroup>
              </FormControl>
            </ModalBody>
            <ModalFooter justifyContent="flex-start" p={[1, 1, 2]}>
              <Button
                colorScheme="blue"
                variant="outline"
                m={[1, 1, 2]}
                onClick={() => {
                  setToDefault(Number(formDataSeconds.day));
                }}
              >
                Reset
              </Button>
              <Spacer />
              <Button colorScheme="blue" m={[1, 1, 2]} onClick={savePlan}>
                Save
              </Button>
              <Button
                colorScheme="blue"
                variant="outline"
                onClick={() => {
                  onSettingClose();
                }}
                m={[1, 1, 2]}
              >
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </FullScreenSection>
    </div>
  );
}

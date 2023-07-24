import React, { useState } from "react";
import {
  Flex,
  Heading,
  Spacer,
  Show,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Switch,
  Badge,
  Select,
  Icon,
  InputGroup,
  Input,
  InputRightAddon,
  ModalFooter,
  useDisclosure,
} from "@chakra-ui/react";
import { FaCog } from "@react-icons/all-files/fa/FaCog";
import { FaHeart } from "@react-icons/all-files/fa/FaHeart";
import { FaSadCry } from "@react-icons/all-files/fa/FaSadCry";

import {
  FERBER_DEFAULT_CHECK_IN_SECONDS,
  FERBER_DEFAULT_PLAN_SECONDS,
  State,
} from "../constants/constants";
import { HeaderSettingsProps } from "../types/types";

export default function HeaderSettings(props: HeaderSettingsProps) {
  const {
    isOpen: isSettingOpen,
    onOpen: onSettingOpen,
    onClose: onSettingClose,
  } = useDisclosure();

  const [isUserTyped, setIsUserTyped] = useState(false);

  const [formDataSeconds, setFormDataSeconds] = useState({
    day: (props.ferberDayIndex + 1).toString(),
    round_1: props.currentDayPlanSeconds[0].toString(),
    round_2: props.currentDayPlanSeconds[1].toString(),
    round_3: props.currentDayPlanSeconds[2].toString(),
    check_in: props.ferberCheckInSeconds.toString(),
  });

  const [isCustomizedPlan, setIsCustomizedPlan] = useState(false);

  const handleSettingFormOpen = () => {
    setIsUserTyped(false);
    let newFormData = {
      day: (props.ferberDayIndex + 1).toString(),
      round_1: props.currentDayPlanSeconds[0].toString(),
      round_2: props.currentDayPlanSeconds[1].toString(),
      round_3: props.currentDayPlanSeconds[2].toString(),
      check_in: props.ferberCheckInSeconds.toString(),
    };

    setFormDataSeconds(newFormData);
    onSettingOpen();
  };

  const savePlan = () => {
    setIsCustomizedPlan(true);
    props.setFerberDayIndex(Number(formDataSeconds.day) - 1);
    props.setFerberCheckInSeconds(Number(formDataSeconds.check_in));
    let newPlanSeconds = [
      Number(formDataSeconds.round_1),
      Number(formDataSeconds.round_2),
      Number(formDataSeconds.round_3),
    ];
    props.setCurrentDayPlanSeconds(newPlanSeconds);
    onSettingClose();
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

  return (
    <div>
      <Flex w={[300, 300, 768]} pb={6}>
        <Heading as="h1">Ferber Timer Day {props.ferberDayIndex + 1}</Heading>
        <Spacer />
        <Show above="md">
          <Button
            rightIcon={<FaCog />}
            colorScheme="blue"
            onClick={handleSettingFormOpen}
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
          ></Button>
        </Show>
      </Flex>
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
                isChecked={props.usingSeconds}
                onChange={() => {
                  props.setUsingSeconds((prev) => !prev);
                }}
                isDisabled={props.state !== State.Initial}
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
                isDisabled={props.state !== State.Initial}
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
                      ? props.usingSeconds
                        ? formDataSeconds.round_1
                        : Math.floor(Number(formDataSeconds.round_1) / 60)
                      : ""
                  }
                  onChange={(e) => {
                    setIsUserTyped(true);
                    let val = e.target.value;
                    if (!props.usingSeconds) {
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
                  isDisabled={props.state !== State.Initial}
                />
                {props.usingSeconds ? (
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
                      ? props.usingSeconds
                        ? formDataSeconds.round_2
                        : Math.floor(Number(formDataSeconds.round_2) / 60)
                      : ""
                  }
                  onChange={(e) => {
                    setIsUserTyped(true);
                    let val = e.target.value;
                    if (!props.usingSeconds) {
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
                  isDisabled={props.state !== State.Initial}
                />
                {props.usingSeconds ? (
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
                      ? props.usingSeconds
                        ? formDataSeconds.round_3
                        : Math.floor(Number(formDataSeconds.round_3) / 60)
                      : ""
                  }
                  onChange={(e) => {
                    setIsUserTyped(true);
                    let val = e.target.value;
                    if (!props.usingSeconds) {
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
                  isDisabled={props.state !== State.Initial}
                />
                {props.usingSeconds ? (
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
                      ? props.usingSeconds
                        ? formDataSeconds.check_in
                        : Math.floor(Number(formDataSeconds.check_in) / 60)
                      : ""
                  }
                  onChange={(e) => {
                    setIsUserTyped(true);
                    let val = e.target.value;
                    if (!props.usingSeconds) {
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
                  isDisabled={props.state !== State.Initial}
                />
                {props.usingSeconds ? (
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
              isDisabled={props.state !== State.Initial}
            >
              Reset
            </Button>
            <Spacer />
            <Button
              colorScheme="blue"
              m={[1, 1, 2]}
              onClick={savePlan}
              isDisabled={props.state !== State.Initial}
            >
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
    </div>
  );
}

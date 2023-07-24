import { State } from "../constants/constants";

export interface HeaderSettingsProps {
  state: State;
  ferberDayIndex: number;
  setFerberDayIndex: Function;
  usingSeconds: boolean;
  setUsingSeconds: Function;
  ferberCheckInSeconds: number;
  setFerberCheckInSeconds: Function;
  currentDayPlanSeconds: number;
  setCurrentDayPlanSeconds: Function;
}

export interface MainTimerDisplayProps {
  state: State;
  roundIndex: number;
  timerRemainingSeconds: number;
}

export interface MainControlsProps {
  state: State;
  setState: Function;
  usingSeconds: boolean;
  ferberCheckInSeconds: number;
  currentDayPlanSeconds: number;
  roundIndex: number;
  setRoundIndex: Function;
  timeSeconds: number;
  timerRemainingSeconds: number;
  timerStart: number | undefined;
  setTimerStart: Function;
  timerTotalSeconds: number;
  setTimerTotalSeconds: Function;
}

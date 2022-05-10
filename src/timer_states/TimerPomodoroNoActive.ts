import { TimerBreakRunning } from "./TimerBreakRunning";
import { TimerPomodoroRunning } from "./TimerPomodoroRunning";
import {
  timerFrequencyLongBreak,
  timerLongBreakTimeGoal,
  timerPomodoroTimeGoal,
  timerShortBreakTimeGoal,
} from "./timerSettings";
import { TimerState } from "./TimerState";

export class TimerPomodoroNoActive implements TimerState {
  setState: (state: TimerState) => void;
  setTime: (time: number) => void;
  setPrimaryButtonText: (text: string) => void;
  setSecondaryButtonText: (text: string) => void;
  setPmodoroCount: (text: string) => void;
  setTitileText: (text: string) => void;
  numPomodoro: number;
  restart: (time: number) => void;
  reset: () => void;
  pause: () => void;
  resume: () => void;
notify: (mes: string) => void;
  
  constructor(
    setState: (state: TimerState) => void,
    setTime: (time: number) => void,
    setPrimaryButtonText: (text: string) => void,
    setSecondaryButtonText: (text: string) => void,
    setTitileText: (text: string) => void,
    setPmodoroCount: (text: string) => void,
    restart: (time: number) => void,
    reset: () => void,
    pause: () => void,
    resume: () => void,
notify: (mes: string) => void,
    numPomodoro: number
  ) {
    this.setState = setState;
    this.setTime = setTime;
    this.setPrimaryButtonText = setPrimaryButtonText;
    this.setSecondaryButtonText = setSecondaryButtonText;
    this.setTitileText = setTitileText;
    this.setPmodoroCount = setPmodoroCount;
    this.restart = restart
    this.reset = reset
    this.pause = pause
    this.resume = resume
    this.numPomodoro = numPomodoro;
this.notify= notify;

    this.setTime(timerPomodoroTimeGoal);
    this.setTitileText("Pomodoro");
    this.setPmodoroCount("#" + numPomodoro);
    this.setPrimaryButtonText("Start");
    this.setSecondaryButtonText("LET'S GO!");
  }

  primaryButtonClicked() {
    this.setState(
      new TimerPomodoroRunning(
        this.setState,
        this.setTime,
        this.setPrimaryButtonText,
        this.setSecondaryButtonText,
        this.setTitileText,
        this.setPmodoroCount,
        this.restart,
        this.reset,
        this.pause,
        this.resume,
        this.notify,
this.numPomodoro,
        false
      )
    );
  }

  secondaryButtonClicked() {
    //nothing
  }

  timerFinished() {
    //nothing
  }
}

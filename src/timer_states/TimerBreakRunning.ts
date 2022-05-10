import { TimerPomodoroNoActive } from "./TimerPomodoroNoActive";
import { TimerBreakPause } from "./TimerBreakPause";
import {
  timerFrequencyLongBreak,
  timerLongBreakTimeGoal,
  timerPomodoroTimeGoal,
  timerShortBreakTimeGoal,
} from "./timerSettings";
import { TimerState } from "./TimerState";

export class TimerBreakRunning implements TimerState {
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
    numPomodoro: number,
    isResume: boolean
  ) {
    this.setState = setState;
    this.setTime = setTime;
    this.setPrimaryButtonText = setPrimaryButtonText;
    this.setSecondaryButtonText = setSecondaryButtonText;
    this.setTitileText = setTitileText;
    this.setPmodoroCount = setPmodoroCount;
    this.restart = restart;
    this.reset = reset;
    this.pause = pause;
    this.resume = resume;
    this.numPomodoro = numPomodoro;
this.notify= notify;

    if (isResume) {
      this.resume();
    } else {
      if ((this.numPomodoro - 1) % timerFrequencyLongBreak == 0) {
        this.restart(timerLongBreakTimeGoal);
      } else {
        this.restart(timerShortBreakTimeGoal);
      }
    }

    this.setPrimaryButtonText("Pause");
    this.setSecondaryButtonText("Skip");
  }

  primaryButtonClicked() {
    this.pause();
    this.setState(
      new TimerBreakPause(
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
        this.numPomodoro
      )
    );
  }

  secondaryButtonClicked() {
    this.reset();
    this.setState(
      new TimerPomodoroNoActive(
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
        this.numPomodoro
      )
    );
  }

  timerFinished() {
    this.reset()
    this.notify("Break has ended, it's time to work!")
    this.setState(
      new TimerPomodoroNoActive(
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
        this.numPomodoro
      )
    );
  }
}

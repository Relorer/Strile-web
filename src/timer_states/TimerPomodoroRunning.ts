import { TimerPomodoroPause } from './TimerPomodoroPause';
import { TimerPomodoroNoActive } from "./TimerPomodoroNoActive";
import { TimerBreakRunning } from "./TimerBreakRunning";
import {
  timerFrequencyLongBreak,
  timerLongBreakTimeGoal,
  timerPomodoroTimeGoal,
  timerShortBreakTimeGoal,
} from "./timerSettings";
import { TimerState } from "./TimerState";
import { TimerBreakNoActive } from './TimerBreakNoActive';

export class TimerPomodoroRunning implements TimerState {
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
    this.restart = restart
    this.reset = reset
    this.pause = pause
    this.resume = resume
    this.numPomodoro = numPomodoro;
this.notify= notify;

    if (isResume) this.resume()
    else this.restart(timerPomodoroTimeGoal)
    this.setPmodoroCount("#" + numPomodoro);
    this.setPrimaryButtonText("Pause");
    this.setSecondaryButtonText("Stop");
  }

  primaryButtonClicked() {
    this.pause()
    this.setState(
      new TimerPomodoroPause(
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
    this.reset()
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
    this.notify("Pomodoro has finished, let's take a break!")
    this.setState(
      new TimerBreakNoActive(
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
        this.numPomodoro + 1
      )
    );
  }
}

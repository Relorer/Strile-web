import { TimerRunning } from "./TimerRunning";
import {
  timerFrequencyLongBreak,
  timerLongBreakTimeGoal,
  timerPomodoroTimeGoal,
  timerShortBreakTimeGoal,
} from "../timer_states/timerSettings";
import { TimerState } from "../timer_states/TimerState";

export class TimerNoActive implements TimerState {
  setState: (state: TimerState) => void;
  setPrimaryButtonText: (text: string) => void;
  setSecondaryButtonText: (text: string) => void;
  restart: () => void;
  reset: () => void;
  pause: () => void;
  resume: () => void;
  notify: (mes: string) => void;

  constructor(
    setState: (state: TimerState) => void,
    setPrimaryButtonText: (text: string) => void,
    setSecondaryButtonText: (text: string) => void,
    restart: () => void,
    reset: () => void,
    pause: () => void,
    resume: () => void,
    notify: (mes: string) => void,
  ) {
    this.setState = setState;
    this.setPrimaryButtonText = setPrimaryButtonText;
    this.setSecondaryButtonText = setSecondaryButtonText;
    this.restart = restart;
    this.reset = reset;
    this.pause = pause;
    this.resume = resume;
    this.notify = notify;

    this.setPrimaryButtonText("Start");
    this.setSecondaryButtonText("LET'S GO!");
  }

  primaryButtonClicked() {
    this.setState(
      new TimerRunning(
        this.setState,
        this.setPrimaryButtonText,
        this.setSecondaryButtonText,
        this.restart,
        this.reset,
        this.pause,
        this.resume,
        this.notify,
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

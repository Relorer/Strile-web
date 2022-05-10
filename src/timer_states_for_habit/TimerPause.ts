import { TimerRunning } from "./TimerRunning";
import { TimerNoActive } from "./TimerNoActive";
import {
  timerFrequencyLongBreak,
  timerLongBreakTimeGoal,
  timerPomodoroTimeGoal,
  timerShortBreakTimeGoal,
} from "../timer_states/timerSettings";
import { TimerState } from "../timer_states/TimerState";

export class TimerPause implements TimerState {
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
    notify: (mes: string) => void
  ) {
    this.setState = setState;
    this.setPrimaryButtonText = setPrimaryButtonText;
    this.setSecondaryButtonText = setSecondaryButtonText;
    this.restart = restart;
    this.reset = reset;
    this.pause = pause;
    this.resume = resume;
    this.notify = notify;

    this.setPrimaryButtonText("Resume");
    this.setSecondaryButtonText("Done");
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
        true
      )
    );
  }

  secondaryButtonClicked() {
    this.notify("")
  }

  timerFinished() {
    //nothing
  }
}

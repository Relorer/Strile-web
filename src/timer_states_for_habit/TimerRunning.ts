import { TimerPause } from "./TimerPause";
import { TimerNoActive } from "./TimerNoActive";
import {
  timerFrequencyLongBreak,
  timerLongBreakTimeGoal,
  timerPomodoroTimeGoal,
  timerShortBreakTimeGoal,
} from "../timer_states/timerSettings";
import { TimerState } from "../timer_states/TimerState";

export class TimerRunning implements TimerState {
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
    isResume: boolean
  ) {
    this.setState = setState;
    this.setPrimaryButtonText = setPrimaryButtonText;
    this.setSecondaryButtonText = setSecondaryButtonText;
    this.restart = restart;
    this.reset = reset;
    this.pause = pause;
    this.resume = resume;
    this.notify = notify;

    if (isResume) this.resume();
    else this.restart();
    this.setPrimaryButtonText("Pause");
    this.setSecondaryButtonText("Done");
  }

  primaryButtonClicked() {
    this.pause();
    this.setState(
      new TimerPause(
        this.setState,
        this.setPrimaryButtonText,
        this.setSecondaryButtonText,
        this.restart,
        this.reset,
        this.pause,
        this.resume,
        this.notify
      )
    );
  }

  secondaryButtonClicked() {
    this.notify("")
  }

  timerFinished() {
    this.notify("That's enough for today")
  }
}

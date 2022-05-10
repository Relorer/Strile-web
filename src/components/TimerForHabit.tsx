import { Box, Button, Stack, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { SnackBarContext } from "../services/SnackBarProvider";
import TimerAnimation from "./TimerAnimation";
import { TimerState } from "../timer_states/TimerState";
import useCountDown from "react-countdown-hook";
import { TimerNoActive } from "../timer_states_for_habit/TimerNoActive";

interface TimerForHabitProps {
  onTick: (time: number) => void;
  name: string;
  time: number;
}

const TimerForHabit = ({ onTick, name, time }: TimerForHabitProps) => {
  const snackBar = useContext(SnackBarContext);
  const { notify } = snackBar || { notify: () => {} };

  const [startButtonText, setStartButtonText] = useState("START");
  const [secondButtonText, setSecondButtonText] = useState("LET'S GO!");

  const [timerTime, setTimerTime] = useState(0);
  const [timerState, setTimerState] = useState<TimerState | null>(null);

  const [timeLeft, { start, pause, resume, reset }] = useCountDown(1000, 30);

  let _timeLeft = timeLeft === 0 ? timerTime : timeLeft;

  useEffect(() => {
    if (timeLeft) onTick(timeLeft);
  }, [timeLeft]);

  if (timeLeft == 0) {
    timerState?.timerFinished();
  }

  useEffect(() => {
    setTimerTime(time);
    setTimerState(
      new TimerNoActive(
        setTimerState,
        setStartButtonText,
        setSecondButtonText,
        () => start(time),
        reset,
        pause,
        resume,
        (mes) => {
          if (mes != "") notify(mes, "info");
          onTick(0);
        }
      )
    );
  }, []);

  const startButtonHandler = () => {
    timerState?.primaryButtonClicked();
  };

  const seconButtonHandler = () => {
    timerState?.secondaryButtonClicked();
  };

  return (
    <Box width={350} sx={{ ml: 4 }}>
      <Stack spacing={2} height="auto" sx={{ mb: 5 }}>
        <Box sx={{ background: "#fff", p: 3 }}>
          <Typography
            variant="body1"
            sx={{ textOverflow: "ellipsis", overflow: "hidden" }}
          >
            {name}
          </Typography>
        </Box>

        <TimerAnimation
          key="focusTimer-animation"
          width="100%"
          height="60vh"
          total={timerTime}
          now={_timeLeft}
        ></TimerAnimation>
        <Typography
          key="focusTimer-time"
          variant="h1"
          color={"primary"}
          sx={{ textAlign: "center" }}
        >
          <Box sx={{ fontWeight: "normal" }}>
            {Math.trunc(_timeLeft / 1000 / 60).toLocaleString("en-US", {
              minimumIntegerDigits: 2,
              useGrouping: false,
            })}
            :
            {Math.trunc((_timeLeft % (1000 * 60)) / 1000).toLocaleString(
              "en-US",
              {
                minimumIntegerDigits: 2,
                useGrouping: false,
              }
            )}
          </Box>
        </Typography>

        <Button
          key="focusTimer-primaryButton"
          fullWidth
          onClick={startButtonHandler}
          style={{ textTransform: "uppercase", background: "white" }}
        >
          <Typography variant="h6">{startButtonText}</Typography>
        </Button>
        <Typography
          key="focusTimer-secondaryButton"
          variant="body2"
          onClick={seconButtonHandler}
          sx={{ textAlign: "center", cursor: "pointer" }}
        >
          <Box style={{ textTransform: "uppercase" }}>{secondButtonText}</Box>
        </Typography>
      </Stack>
    </Box>
  );
};

export default TimerForHabit;

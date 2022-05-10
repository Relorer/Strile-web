import { useAuthState } from "react-firebase-hooks/auth";

import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useContext, useMemo, useRef, useState } from "react";
import { Context } from "..";
import { SnackBarContext } from "../services/SnackBarProvider";
import { useNavigate } from "react-router";
import TimerAnimation from "./TimerAnimation";
import { TimerState } from "../timer_states/TimerState";
import { TimerBreakNoActive } from "../timer_states/TimerBreakNoActive";
import useCountDown from "react-countdown-hook";
import { TimerPomodoroNoActive } from "../timer_states/TimerPomodoroNoActive";

const FocusTimer = () => {
  const mainContext = useContext(Context);
  const snackBar = useContext(SnackBarContext);
  const { notify } = snackBar || { notify: () => {} };

  const [user, loading] = useAuthState(mainContext.auth);
  const navigate = useNavigate();

  const [startButtonText, setStartButtonText] = useState("START");
  const [secondButtonText, setSecondButtonText] = useState("LET'S GO!");
  const [titleText, setTitleText] = useState("Pomodoro");
  const [pomodoroCount, setPomodoroCount] = useState("#1");

  const [timerTime, setTimerTime] = useState(0);
  const [timerState, setTimerState] = useState<TimerState | null>(null);

  const [timeLeft, { start, pause, resume, reset }] = useCountDown(1000, 30);

  let _timeLeft = timeLeft === 0 ? timerTime : timeLeft;

  if (timeLeft == 0) {
    timerState?.timerFinished();
  }

  useMemo(() => {
    setTimerState(
      new TimerPomodoroNoActive(
        setTimerState,
        setTimerTime,
        setStartButtonText,
        setSecondButtonText,
        setTitleText,
        setPomodoroCount,
        start,
        reset,
        pause,
        resume,
        (mes) => notify(mes, "info"),
        1
      )
    );
  }, []);

  if (!user && !loading) navigate("/auth");

  const startButtonHandler = () => {
    timerState?.primaryButtonClicked();
  };

  const seconButtonHandler = () => {
    timerState?.secondaryButtonClicked();
  };

  return (
    <Box maxWidth={800} minWidth={300} sx={{ ml: 4 }}>
      <Stack spacing={2} height="auto" sx={{ mb: 5 }}>
        <Grid
          key="focusTimer-titleblock"
          container
          justifyContent="space-between"
          sx={{ background: "#fff", p: 3 }}
        >
          <Grid item key="focusTimer-title">
            <Typography variant="body1">{titleText}</Typography>
          </Grid>
          <Grid item key="focusTimer-pomodoroCount">
            <Typography variant="body1">{pomodoroCount}</Typography>
          </Grid>
        </Grid>

        <TimerAnimation
          key="focusTimer-animation"
          width="100%"
          height="60vh"
          total={timerTime}
          now={_timeLeft}
        ></TimerAnimation>
        <Typography variant="h1" color={"primary"} sx={{ textAlign: "center" }}>
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
          fullWidth
          onClick={startButtonHandler}
          style={{ textTransform: "uppercase", background: "white" }}
        >
          <Typography variant="h6">{startButtonText}</Typography>
        </Button>
        <Typography
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

export default FocusTimer;

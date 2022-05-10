import {
  Box,
  Divider,
  Grid,
  IconButton,
  Slider,
  TextField,
  Typography,
  LinearProgress,
  styled,
  Select,
  MenuItem,
  ToggleButtonGroup,
  ToggleButton,
  FormControl,
  InputLabel,
  Drawer,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { removeHabit, updateHabit } from "../db/db";
import { debounce } from "ts-debounce";
import { getWeekDays, nowWithoutTime } from "../utils/date";
import {
  arrayRepeatToInt,
  getDaysRepeatAsArray,
  streakByDay,
} from "../utils/habitUtils";
import TimerForHabit from "./TimerForHabit";

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 4,
  borderRadius: 10,
}));

interface HabitProps {
  habit: any;
}

const debouncedUpdate = debounce((update: () => void) => {
  update();
}, 2000);

const Habit = ({ habit }: HabitProps) => {
  const [name, setName] = useState(habit.name);
  const [difficulty, setDifficulty] = useState(habit.difficulty);
  const [goalTime, setGoalTime] = useState(habit.goalTime);
  const [elapsedTime, setElapsedTime] = useState<number>(habit.elapsedTime);
  const [daysRepeat, setDaysRepeat] = useState(
    getDaysRepeatAsArray(habit)
      .map((v, i) => (v ? i : -1))
      .filter((v) => v != -1)
  );

  const bottomBarRef = useRef<HTMLElement>();
  const [height, setHeight] = useState(window.innerHeight);
  const updateDimensions = () => {
    if (bottomBarRef.current?.clientHeight) {
      setHeight(window.innerHeight - bottomBarRef.current?.clientHeight - 50);
    }
  };

  const [timerIsOpen, setTimerIsOpen] = useState(false);

  const [weekDays, _] = useState(getWeekDays("Us-us", "short"));

  useEffect(() => {
    if (elapsedTime <= 0) setTimerIsOpen(false);
  }, [elapsedTime]);

  useEffect(() => {
    debouncedUpdate(() => {
      habit.name = name;
      habit.difficulty = difficulty;
      habit.goalTime = goalTime;
      habit.elapsedTime = elapsedTime;

      let repeat = [false, false, false, false, false, false, false];
      console.log(daysRepeat);
      daysRepeat.forEach((r) => {
        if (r > -1) repeat[r] = true;
      });
      console.log(repeat);
      console.log(arrayRepeatToInt(repeat));
      habit.daysRepeat = arrayRepeatToInt(repeat);

      updateHabit(habit);
    });
  }, [name, difficulty, daysRepeat, goalTime, elapsedTime]);

  useEffect(() => {
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    setName(habit.name);
    setDifficulty(habit.difficulty);
    setGoalTime(habit.goalTime);
    setElapsedTime(habit.elapsedTime);
    setDaysRepeat(
      getDaysRepeatAsArray(habit)
        .map((v, i) => (v ? i : -1))
        .filter((v) => v != -1)
    );
  }, [habit]);

  let streak = streakByDay(habit, new Date(nowWithoutTime()));

  let startWeek = 6;

  let tempElapsedTime = 0;

  return (
    <>
      <Box
        height="100vh"
        overflow={"hidden"}
        position="relative"
        sx={{ ml: 4, background: "white", p: 3 }}
      >
        <Box height={height} style={{ overflowY: "auto" }}>
          <Box style={{ width: "100%" }}>
            <TextField
              id="standard-name"
              label="Name"
              variant="standard"
              fullWidth
              value={name}
              onChange={(event) => setName(event.target.value)}
              sx={{ my: 2 }}
            />
            {habit.goalTime != 0 && elapsedTime < habit.goalTime ? (
              <Box
                onClick={() => setTimerIsOpen(true)}
                style={{ cursor: "pointer" }}
              >
                <Grid
                  container
                  justifyContent="space-between"
                  sx={{ my: 2, mb: 4 }}
                >
                  <Grid item>
                    <Typography variant="body1">Today</Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="body1">
                      {Math.floor(elapsedTime / 60_000)}/
                      {Math.floor(habit.goalTime / 60_000)} minutes
                    </Typography>
                  </Grid>
                </Grid>
                <BorderLinearProgress
                  variant="determinate"
                  value={(elapsedTime / habit.goalTime) * 100}
                />
              </Box>
            ) : (
              <></>
            )}
            <Grid
              container
              justifyContent="space-between"
              sx={{ my: 2, mt: 4 }}
            >
              <Grid item>
                <Typography variant="body1">Current streak</Typography>
              </Grid>
              <Grid item>
                <Typography variant="body1">
                  {streak}
                  {streak < 2 ? " day" : " days"}
                </Typography>
              </Grid>
            </Grid>

            <FormControl variant="standard" fullWidth sx={{ my: 2 }}>
              <InputLabel id="time-goal-select-standard-label">
                Time goal
              </InputLabel>

              <Select
                labelId="time-goal-select-standard-label"
                value={goalTime}
                onChange={(e) => {
                  setGoalTime(e.target.value);
                }}
                label="Time goal"
              >
                <MenuItem value={0}>No time goal</MenuItem>
                <MenuItem value={5 * 60_000}>For 5 minutes</MenuItem>
                <MenuItem value={15 * 60_000}>For 15 minutes</MenuItem>
                <MenuItem value={30 * 60_000}>For 30 minutes</MenuItem>
                <MenuItem value={45 * 60_000}>For 45 minutes</MenuItem>
                <MenuItem value={60 * 60_000}>For 1 hour</MenuItem>
              </Select>
            </FormControl>

            <ToggleButtonGroup
              value={daysRepeat}
              sx={{ my: 2 }}
              onChange={(e, newFormats) => {
                setDaysRepeat((old) => newFormats);
              }}
              aria-label="text formatting"
              color="primary"
              fullWidth
            >
              {weekDays.map((d: string, i: number) => {
                let index = startWeek + i;
                index %= 7;
                return (
                  <ToggleButton
                    key={weekDays[index]}
                    value={i}
                    aria-label="bold"
                  >
                    {weekDays[index]}
                  </ToggleButton>
                );
              })}
            </ToggleButtonGroup>

            <Grid
              container
              justifyContent="space-between"
              sx={{ background: "#fff", p: 3, my: 2, mt: 2 }}
            >
              <Grid item>
                <Typography variant="body1">Difficulty</Typography>
              </Grid>
              <Grid item>
                <Typography variant="body1">
                  {difficulty > (100 / 4) * 3
                    ? "Very Hard"
                    : difficulty > (100 / 4) * 2
                    ? "Hard"
                    : difficulty > (100 / 4) * 1
                    ? "Normal"
                    : "Simple"}
                </Typography>
              </Grid>
            </Grid>
            <Slider
              key={"slider-" + habit.id}
              value={difficulty}
              onChange={(event: Event, value: number | Array<number>) =>
                setDifficulty(value ?? 30)
              }
              aria-label="difficulty"
              valueLabelDisplay="auto"
            />
          </Box>
        </Box>

        <Box
          ref={bottomBarRef}
          sx={{ position: "absolute", bottom: 0, left: 0, right: 0, m: 2 }}
        >
          <Divider />
          <Grid
            container
            justifyContent="space-between"
            alignItems={"center"}
            sx={{ mt: 1, mx: 1, color: "#c5c4c4" }}
          >
            <Grid item>
              <Typography variant="body1">
                {habit.goalTime != 0 && elapsedTime < habit.goalTime
                  ? "Try to click on the goal (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧"
                  : "Keep it up!"}
              </Typography>
            </Grid>
            <Grid item>
              <IconButton
                aria-label="delete"
                onClick={() => {
                  removeHabit(habit);
                  debouncedUpdate.cancel();
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Drawer
        anchor={"right"}
        open={timerIsOpen}
        onClose={() => {
          setTimerIsOpen(false);
          setElapsedTime((_) => tempElapsedTime);
        }}
      >
        <Box sx={{ pl: 4, pr: 6 }}>
          <TimerForHabit
            onTick={(left) => {
              if (left === 0) {
                setTimerIsOpen(false);
                setElapsedTime((_) => tempElapsedTime);
              }
              tempElapsedTime = habit.goalTime - left;
            }}
            name={habit.name}
            time={habit.goalTime - elapsedTime}
          ></TimerForHabit>
        </Box>
      </Drawer>
    </>
  );
};

export default Habit;

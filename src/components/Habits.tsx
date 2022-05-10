import {
  AccountCircle,
  Cloud,
  ContentCopy,
  ContentCut,
  ContentPaste,
} from "@mui/icons-material";
import LockIcon from "@mui/icons-material/Lock";
import GoogleIcon from "@mui/icons-material/Google";
import { useAuthState } from "react-firebase-hooks/auth";

import {
  Box,
  Checkbox,
  Grid,
  Stack,
  Typography,
  Button,
  TextField,
  InputAdornment,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Context } from "..";
import {
  GoogleAuthProvider,
  signInWithCredential,
  signInWithPopup,
} from "firebase/auth";
import { SnackBarContext } from "../services/SnackBarProvider";
import { useNavigate } from "react-router";
import { useObject } from "react-firebase-hooks/database";
import { ref } from "firebase/database";
import { dateWithoutTime, nowWithoutTime } from "../utils/date";
import ScrollMenu from "react-horizontal-scroll-menu";
import DaysMenu from "./DaysMenu";
import RadioButtonUncheckedRoundedIcon from "@mui/icons-material/RadioButtonUncheckedRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import Habit from "./Habit";
import AddIcon from "@mui/icons-material/Add";
import { calcExecutedForHabit, removeHabit, updateHabit } from "../db/db";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import TimelapseIcon from "@mui/icons-material/Timelapse";
import {
  isCompleteOnDay,
  plannedForDay,
  setStateForDay,
  streakByDay,
} from "../utils/habitUtils";

interface HabitsProps {
  userInfo: any;
}

const Habits = ({ userInfo }: HabitsProps) => {
  const mainContext = useContext(Context);
  const snackBar = useContext(SnackBarContext);
  const { notify } = snackBar || { notify: () => {} };

  const [user, loading] = useAuthState(mainContext.auth);
  const navigate = useNavigate();

  const [selectedDay, setSelectedDay] = useState<string>(
    nowWithoutTime().toString()
  );

  const daysListRef = useRef<HTMLElement>(null);
  const addHabitFieldRef = useRef<HTMLElement>(null);

  const [habitStackHight, setHabitStackHight] = useState(0);

  const [selectedHabitKey, setSelectedHabit] = useState("");

  const [nameNewHabit, setNameNewHabit] = useState("");

  const [showCompletedHabits, setShowCompletedHabits] = useState<boolean>(
    (localStorage.getItem("showCompletedCases") &&
      localStorage.getItem("showCompletedCases") == "true") ||
      false
  );

  useEffect(() => {
    localStorage.setItem("showCompletedCases", showCompletedHabits?.toString());
  }, [showCompletedHabits]);

  const updateDimensions = () => {
    if (
      daysListRef?.current?.clientHeight &&
      addHabitFieldRef.current?.clientHeight
    ) {
      setHabitStackHight(
        window.innerHeight -
          daysListRef?.current?.clientHeight -
          addHabitFieldRef.current?.clientHeight
      );
    }
  };

  useEffect(() => {
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    updateDimensions();
  });

  useMemo(() => {}, []);

  if (!user && !loading) navigate("/auth");

  const days = Array.from({ length: 30 }, (_, i) => {
    let date = new Date();
    date.setDate(new Date().getDate() - (29 - i));
    return new Date(dateWithoutTime(date));
  });

  let menuItems = DaysMenu(days, 29);

  let selectedHabit = userInfo?.habits[selectedHabitKey];

  let completedHabitsList: any[] = [];
  let habitsList: any[] = [];

  if (userInfo?.habits) {
    Object.keys(userInfo?.habits).map((key, index) => {
      let habit = userInfo?.habits[key];

      console.log(habit);

      let today = new Date(parseInt(selectedDay));

      let streak = streakByDay(habit, today);
      let streakText = streak + " day streak";
      let streakColor = "#c5c4c4";

      let isCompleteToday = isCompleteOnDay(habit, today);

      if (plannedForDay(habit, today)) {
        let t = (
          <>
            <Box
              sx={{ background: "white", px: 1, py: 2 }}
              style={{ cursor: "pointer" }}
              onClick={() => {
                let k = key;
                setSelectedHabit(k);
              }}
              key={key}
            >
              <Grid
                container
                alignItems="center"
                justifyContent="space-between"
              >
                <Grid item xs={2} lg={1} sx={{textAlign: "center",}}>
                  <Checkbox
                    checked={isCompleteToday}
                    sx={{
                      
                      "& .MuiSvgIcon-root": { fontSize: 30 },
                    }}
                    icon={<RadioButtonUncheckedRoundedIcon />}
                    checkedIcon={<CheckCircleRoundedIcon />}
                    onChange={(e) => {
                      setStateForDay(habit, !isCompleteToday, today);
                      if (parseInt(selectedDay) === nowWithoutTime()) {
                        calcExecutedForHabit(userInfo, habit, !isCompleteToday);
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={8} lg={10}>
                  <Typography
                    sx={{ textOverflow: "ellipsis", overflow: "hidden" }}
                  >
                    {habit.name}
                  </Typography>
                  <Typography sx={{ color: streakColor, fontSize: 14 }}>
                    {streakText}
                  </Typography>
                </Grid>
                <Grid item xs={2} lg={1}>
                  {habit.goalTime != 0 ? (
                    <Box sx={{ textAlign: "center", opacity: 0.7 }}>
                      <TimelapseIcon></TimelapseIcon>
                    </Box>
                  ) : (
                    <></>
                  )}
                </Grid>
              </Grid>
            </Box>
          </>
        );

        if (isCompleteToday) {
          completedHabitsList.push(t);
        } else {
          habitsList.push(t);
        }
      }
    });
  }

  return (
    <Box
      height="100vh"
      minWidth={900}
      overflow={"hidden"}
      position="relative"
      sx={{ ml: 4 }}
    >
      <Grid container>
        <Grid item xs={6}>
          <Box sx={{ pb: 2 }} ref={daysListRef}>
            <Box sx={{ px: 2, py: 1, background: "white" }}>
              <ScrollMenu
                data={menuItems}
                hideArrows={true}
                scrollToSelected={true}
                selected={selectedDay}
                useButtonRole={false}
                onSelect={(key) => {
                  if (key !== null && typeof key === "string") {
                    setSelectedDay(key);
                  }
                }}
              ></ScrollMenu>
            </Box>
          </Box>
          <Box ref={addHabitFieldRef}>
            <TextField
              placeholder="Add habit, press Enter to save"
              fullWidth
              sx={{ background: "white", p: 3, mb: 2 }}
              value={nameNewHabit}
              onChange={(event) => setNameNewHabit(event.target.value)}
              onKeyPress={(ev) => {
                if (ev.key === "Enter") {
                  if (nameNewHabit) {
                    let t = {
                      name: nameNewHabit,
                      daysRepeat: 127,
                      elapsedTime: 0,
                      goalTime: 0,
                      notificationTime: -1,
                      difficulty: 33,
                      id: null,
                    };

                    updateHabit(t);
                    setNameNewHabit("");
                  }

                  ev.preventDefault();
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AddIcon />
                  </InputAdornment>
                ),
              }}
              variant="standard"
            />
          </Box>
          <Box height={habitStackHight} style={{ overflowY: "auto" }}>
            <Stack spacing={0} style={{ height: "100%" }}>
              {habitsList}
              {showCompletedHabits ? completedHabitsList : <></>}
              {completedHabitsList.length ? (
                <Box
                  key="habits-buttonForHide"
                  sx={{ background: "white", px: 1, py: 2, opacity: 0.85 }}
                  style={{ cursor: "pointer" }}
                  overflow="hidden"
                  onClick={() => {
                    setShowCompletedHabits((v) => !v);
                  }}
                >
                  <Grid
                    container
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Grid item xs={2} lg={1}>
                      <Box sx={{ textAlign: "center", }}>
                        <KeyboardArrowDownIcon
                          fontSize="large"
                          sx={{
                            
                            pt: showCompletedHabits ? 0 : 0.5,
                            pb: showCompletedHabits ? 0.5 : 0,
                            transform: showCompletedHabits
                              ? "rotate(180deg);"
                              : "rotate(0deg);",
                          }}
                        ></KeyboardArrowDownIcon>
                      </Box>
                    </Grid>
                    <Grid item xs={8} lg={10}>
                      <Typography>
                        {showCompletedHabits
                          ? "Hide completed"
                          : "Show completed"}
                      </Typography>
                    </Grid>
                    <Grid item xs={2} lg={1}>
                      <Typography>
                        <Box sx={{ textAlign: "center" }}>
                          {completedHabitsList.length}
                        </Box>
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              ) : (
                <></>
              )}
            </Stack>
          </Box>
        </Grid>
        <Grid item xs={6}>
          {selectedHabit ? (
            <Habit habit={selectedHabit}></Habit>
          ) : (
            <Grid
              container
              spacing={0}
              direction="column"
              alignItems="center"
              justifyContent="center"
              style={{ minHeight: "100vh" }}
            >
              <Grid item xs={3}>
                <Typography>Click habit title to view the detail</Typography>
              </Grid>
            </Grid>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Habits;

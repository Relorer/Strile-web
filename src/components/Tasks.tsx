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
import Task from "./Task";
import AddIcon from "@mui/icons-material/Add";
import { calcExecutedForTask, removeTask, updateTask } from "../db/db";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

interface TasksProps {
  userInfo: any;
}

const Tasks = ({ userInfo }: TasksProps) => {
  const mainContext = useContext(Context);
  const snackBar = useContext(SnackBarContext);
  const { notify } = snackBar || { notify: () => {} };

  const [user, loading] = useAuthState(mainContext.auth);
  const navigate = useNavigate();

  const [selectedDay, setSelectedDay] = useState<string>(
    nowWithoutTime().toString()
  );

  const daysListRef = useRef<HTMLElement>(null);
  const addTaskFieldRef = useRef<HTMLElement>(null);

  const [taskStackHight, setTaskStackHight] = useState(0);

  const [selectedTaskKey, setSelectedTask] = useState("");

  const [nameNewTask, setNameNewTask] = useState("");

  const [showCompletedTasks, setShowCompletedTasks] = useState<boolean>(
    (localStorage.getItem("showCompletedCases") &&
      localStorage.getItem("showCompletedCases") == "true") ||
      false
  );

  useEffect(() => {
    localStorage.setItem("showCompletedCases", showCompletedTasks?.toString());
  }, [showCompletedTasks]);

  const updateDimensions = () => {
    if (
      daysListRef?.current?.clientHeight &&
      addTaskFieldRef.current?.clientHeight
    ) {
      setTaskStackHight(
        window.innerHeight -
          daysListRef?.current?.clientHeight -
          addTaskFieldRef.current?.clientHeight
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

  let selectedTask = userInfo?.tasks[selectedTaskKey];

  let completedTasksList: any[] = [];
  let tasksList: any[] = [];

  if (userInfo?.tasks) {
    Object.keys(userInfo?.tasks).map((key, index) => {
      let task = userInfo?.tasks[key];
      let deadline = task.deadline;
      let deadlineText = "";
      let deadlineColor = "#c5c4c4";

      let today = parseInt(selectedDay);
      let date = new Date(today);
      date.setDate(date.getDate() - 1);
      let yesterday = date.getTime();
      date.setDate(date.getDate() + 2);
      let tomorrow = date.getTime();

      let dateComplete = dateWithoutTime(new Date(task.dateComplete));
      let dateCreate = dateWithoutTime(new Date(task.dateCreate));

      let isCompleteToday = dateComplete === today;
      let isComplete = task.dateComplete !== 0;

      let plannedForDay =
        dateCreate <= today && (!isComplete || dateComplete >= today);

      if (plannedForDay) {
        if (deadline == 0) deadlineText = "No deadline";
        else if (deadline == yesterday && !isComplete) {
          deadlineText = "Yesterday";
        } else if (deadline == today && !isComplete) {
          deadlineText = "Today";
        } else if (deadline == tomorrow && !isComplete) {
          deadlineText = "Tomorrow";
        } else {
          deadlineText = new Date(deadline).toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          });
        }

        if (deadline <= yesterday && deadline != 0 && !isComplete)
          deadlineColor = "red";
        else if ((deadline == today || deadline == tomorrow) && !isComplete) {
          deadlineColor = "#0971f1";
        }

        let t = (
          <>
            <Box
              sx={{ background: "white", px: 1, py: 2 }}
              style={{ cursor: "pointer" }}
              onClick={() => {
                let k = key;
                setSelectedTask(k);
              }}
              key={key}
            >
              <Grid container justifyContent="space-between">
                <Grid item xs={2} lg={1} sx={{ textAlign: "center" }}>
                  <Checkbox
                    checked={isCompleteToday}
                    sx={{
                      "& .MuiSvgIcon-root": { fontSize: 30 },
                    }}
                    icon={<RadioButtonUncheckedRoundedIcon />}
                    checkedIcon={<CheckCircleRoundedIcon />}
                    onChange={(e) => {
                      if (isCompleteToday) {
                        task.dateComplete = 0;
                      } else {
                        task.dateComplete = nowWithoutTime();
                      }
                      if (today === nowWithoutTime()) {
                        calcExecutedForTask(userInfo, task, !isCompleteToday);
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={8} lg={10}>
                  <Typography
                    sx={{ textOverflow: "ellipsis", overflow: "hidden" }}
                  >
                    {task.name}
                  </Typography>
                  <Typography sx={{ color: deadlineColor, fontSize: 14 }}>
                    {deadlineText}
                  </Typography>
                </Grid>
                <Grid item xs={2} lg={1}></Grid>
              </Grid>
            </Box>
          </>
        );

        if (isCompleteToday) {
          completedTasksList.push(t);
        } else {
          tasksList.push(t);
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
          <Box ref={addTaskFieldRef}>
            <TextField
              placeholder="Add task, press Enter to save"
              fullWidth
              sx={{ background: "white", p: 3, mb: 2 }}
              value={nameNewTask}
              onChange={(event) => setNameNewTask(event.target.value)}
              onKeyPress={(ev) => {
                if (ev.key === "Enter") {
                  if (nameNewTask) {
                    let t = {
                      name: nameNewTask,
                      description: "",
                      difficulty: 33,
                      deadline: 0,
                      id: null,
                      dateComplete: 0,
                      dateCreate: nowWithoutTime(),
                    };

                    updateTask(t);
                    setNameNewTask("");
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
          <Box height={taskStackHight} style={{ overflowY: "auto" }}>
            <Stack spacing={0} style={{ height: "100%" }}>
              {tasksList}
              {showCompletedTasks ? completedTasksList : <></>}
              {completedTasksList.length ? (
                <Box
                  key="tasks-buttonForHide"
                  sx={{ background: "white", px: 1, py: 2, opacity: 0.85 }}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setShowCompletedTasks((v) => !v);
                  }}
                >
                  <Grid
                    container
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Grid item xs={2} lg={1}>
                      <Box
                        sx={{
                          textAlign: "center",
                        }}
                      >
                        <KeyboardArrowDownIcon
                          fontSize="large"
                          sx={{
                            pt: showCompletedTasks ? 0 : 0.5,
                            pb: showCompletedTasks ? 0.5 : 0,
                            transform: showCompletedTasks
                              ? "rotate(180deg);"
                              : "rotate(0deg);",
                          }}
                        ></KeyboardArrowDownIcon>
                      </Box>
                    </Grid>
                    <Grid item xs={8} lg={10}>
                      <Typography>
                        {showCompletedTasks
                          ? "Hide completed"
                          : "Show completed"}
                      </Typography>
                    </Grid>
                    <Grid item xs={2} lg={1}>
                      <Typography>
                        <Box sx={{ textAlign: "center" }}>
                          {completedTasksList.length}
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
          {selectedTask ? (
            <Task task={selectedTask}></Task>
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
                <Typography>Click task title to view the detail</Typography>
              </Grid>
            </Grid>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Tasks;

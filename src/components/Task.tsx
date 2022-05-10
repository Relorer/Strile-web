import {
  Box,
  Divider,
  Grid,
  IconButton,
  Slider,
  Button,
  Checkbox,
  TextField,
  Typography,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useEffect, useRef, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import RadioButtonUncheckedRoundedIcon from "@mui/icons-material/RadioButtonUncheckedRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CloseIcon from "@mui/icons-material/Close";
interface TaskProps {
  task: any;
}
import AddIcon from "@mui/icons-material/Add";
import { removeTask, updateTask } from "../db/db";
import { debounce } from "ts-debounce";
import { nowWithoutTime } from "../utils/date";

const debouncedUpdate = debounce((update: () => void) => {
  update();
}, 2000);

const Task = ({ task }: TaskProps) => {
  const [name, setName] = useState(task.name);
  const [description, setDescription] = useState(task.description);
  const [difficulty, setDifficulty] = useState(task.difficulty);
  const [deadline, setDeadline] = useState(task.deadline);

  const bottomBarRef = useRef<HTMLElement>();
  const [height, setHeight] = useState(window.innerHeight);
  const updateDimensions = () => {
    if (bottomBarRef.current?.clientHeight) {
      setHeight(window.innerHeight - bottomBarRef.current?.clientHeight - 50);
    }
  };

  const [subtasks, setSubtasks] = useState(task.subtasks || []);

  useEffect(() => {
    debouncedUpdate(() => {
      task.name = name;
      task.description = description;
      task.difficulty = difficulty;
      task.deadline = deadline;
      task.subtasks = subtasks || [];

      updateTask(task);
    });
  }, [name, description, difficulty, deadline, subtasks]);

  useEffect(() => {
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    setName(task.name);
    setDescription(task.description);
    setDifficulty(task.difficulty);
    setDeadline(task.deadline);
    setSubtasks(task.subtasks || []);
  }, [task]);
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
            <TextField
              id="standard-Description"
              label="Description"
              variant="standard"
              fullWidth
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              sx={{ my: 2 }}
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Deadline"
                disableOpenPicker={true}
                value={deadline === 0 ? null : deadline}
                onChange={(e) => {
                  setDeadline(new Date(e ?? 0).getTime());
                }}
                minDate={nowWithoutTime()}
                renderInput={(params) => (
                  <Box overflow={"hidden"}>
                    <TextField
                      variant="standard"
                      {...params}
                      sx={{ my: 2, mb: 8 }}
                      fullWidth
                    />
                  </Box>
                )}
              />
            </LocalizationProvider>

            {subtasks ? (
              subtasks.map((s: any, i: number) => (
                <Grid key={i} container spacing={2}>
                  <Grid item md={2} lg={1}>
                    <Checkbox
                      checked={s.complete}
                      onChange={(e) => {
                        s.complete = e.target.checked;
                        setSubtasks((t: any) => [...t]);
                      }}
                      sx={{
                        "& .MuiSvgIcon-root": { fontSize: 25 },
                      }}
                      icon={<RadioButtonUncheckedRoundedIcon />}
                      checkedIcon={<CheckCircleRoundedIcon />}
                    />
                  </Grid>
                  <Grid item md={8} lg={10}>
                    <TextField
                      id="standard-name"
                      variant="standard"
                      fullWidth
                      value={s.name}
                      onChange={(event) => {
                        s.name = event.target.value;
                        setSubtasks((t: any) => [...t]);
                      }}
                    />
                  </Grid>
                  <Grid item md={2} lg={1} sx={{ opacity: 0.6 }}>
                    <IconButton
                      aria-label="delete"
                      onClick={() => {
                        var index = subtasks.indexOf(s);
                        if (index !== -1) {
                          subtasks.splice(index, 1);
                        }
                        setSubtasks((t: any) => [...t]);
                      }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              ))
            ) : (
              <></>
            )}

            <Button
              fullWidth
              variant="outlined"
              startIcon={<AddIcon />}
              sx={{ mt: 2 }}
              onClick={() => {
                subtasks.push({ name: "", complete: false });
                setSubtasks((t: any) => [...t]);
              }}
            >
              Add subtask
            </Button>

            <Grid
              container
              justifyContent="space-between"
              sx={{ background: "#fff", p: 3, my: 2, mt: 4 }}
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
              key={"slider-" + task.id}
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
                Created:{" "}
                {new Date(task.dateCreate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                })}
              </Typography>
            </Grid>
            <Grid item>
              <IconButton
                aria-label="delete"
                onClick={() => {
                  removeTask(task);
                  debouncedUpdate.cancel();
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default Task;

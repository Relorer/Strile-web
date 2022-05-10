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
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import TaskIcon from "@mui/icons-material/Task";
import KitesurfingIcon from "@mui/icons-material/Kitesurfing";
import AvTimerIcon from "@mui/icons-material/AvTimer";

import {
  Box,
  Button,
  Card,
  Divider,
  Grid,
  Input,
  InputAdornment,
  Link,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useMemo, useState } from "react";
import { Context } from "..";

import { SnackBarContext } from "../services/SnackBarProvider";
import { useNavigate } from "react-router";
import Habits from "../components/Habits";
import Tasks from "../components/Tasks";
import FocusTimer from "../components/FocusTimer";
import UserInfo from "../components/UserInfo";
import LogoutIcon from "@mui/icons-material/Logout";
import { useObject } from "react-firebase-hooks/database";
import { ref } from "firebase/database";
import { updateUser } from "../db/db";

const StrilePage = () => {
  const mainContext = useContext(Context);
  const snackBar = useContext(SnackBarContext);
  const { notify } = snackBar || { notify: () => {} };

  const [currentTab, setCurrentTab] = useState<
    "habits" | "tasks" | "focusTimer" | "user"
  >("habits");
  const [user, loading] = useAuthState(mainContext.auth);
  const navigate = useNavigate();

  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);
  const updateDimensions = () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  };
  useEffect(() => {
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const [snapshot, loadingUser, error] = useObject(
    ref(mainContext.database, "users/" + user?.uid)
  );

  useMemo(() => {}, []);

  if (!user && !loading) navigate("/auth");

  const signout = async () => {
    try {
      mainContext.auth.signOut();
      navigate("/");
    } catch (e) {
      if (e instanceof Error) {
        notify(e.message, "error");
      }
    }
  };

  const userInfo = snapshot?.val();

  useEffect(() => {
    if (
      !loadingUser &&
      (!userInfo ||
        !userInfo.dateLastActiveDay ||
        !userInfo.experience ||
        !userInfo.goalExperience ||
        !userInfo.id ||
        !userInfo.level)
    ) {
      updateUser(userInfo);
    }
  }, [loadingUser]);

  if (userInfo) {
    userInfo.habits = userInfo.habits || [];
    userInfo.tasks = userInfo.tasks || [];
    userInfo.executed = userInfo.executed || [];
  }

  return (
    <Box height="100vh" overflow={"hidden"} position="relative">
      <Grid container>
        <Grid
          item
          container
          direction={"column"}
          justifyContent="space-between"
          width={300}
          height="100vh"
          sx={{
            borderRight: "1px solid rgba(0,0,0,0.12)",
            borderLeft: "25px solid #ecf4fe",
            height: "100vh",
          }}
        >
          <Grid item>
            <MenuList>
              <MenuItem
                sx={{ p: 2 }}
                selected={currentTab === "habits"}
                onClick={() => setCurrentTab("habits")}
              >
                <ListItemIcon>
                  <KitesurfingIcon fontSize="medium" />
                </ListItemIcon>
                <ListItemText>Habits</ListItemText>
              </MenuItem>
              <MenuItem
                sx={{ p: 2 }}
                selected={currentTab === "tasks"}
                onClick={() => setCurrentTab("tasks")}
              >
                <ListItemIcon>
                  <TaskIcon fontSize="medium" />
                </ListItemIcon>
                <ListItemText>Tasks</ListItemText>
              </MenuItem>
              <MenuItem
                sx={{ p: 2 }}
                selected={currentTab === "focusTimer"}
                onClick={() => setCurrentTab("focusTimer")}
              >
                <ListItemIcon>
                  <AvTimerIcon fontSize="medium" />
                </ListItemIcon>
                <ListItemText>Focus Timer</ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem
                sx={{ p: 2 }}
                selected={currentTab === "user"}
                onClick={() => setCurrentTab("user")}
              >
                <ListItemIcon>
                  <AssignmentIndIcon fontSize="medium" />
                </ListItemIcon>
                <ListItemText>{user?.displayName || user?.email}</ListItemText>
              </MenuItem>
            </MenuList>
          </Grid>
          <Grid item>
            <Box sx={{ m: 2 }}>
              <Button
                onClick={signout}
                startIcon={<LogoutIcon />}
                fullWidth
                sx={{
                  color: "#6c7075",
                  opacity: 0.6,
                  justifyContent: "flex-start",
                }}
              >
                Sign out
              </Button>
            </Box>
          </Grid>
        </Grid>
        <Grid
          item
          width={width - 300}
          sx={{ background: "#fafafa" }}
          height="100vh"
          style={{ overflowY: "scroll" }}
        >
          {loadingUser || !userInfo ? (
            <Grid
              container
              spacing={0}
              direction="column"
              alignItems="center"
              justifyContent="center"
              style={{ minHeight: "100vh" }}
            >
              <Grid item xs={3}>
                Loading...
              </Grid>
            </Grid>
          ) : (
            <>
              <Box sx={{ display: currentTab === "habits" ? "block" : "none" }}>
                <Habits userInfo={userInfo}></Habits>
              </Box>
              <Box sx={{ display: currentTab === "tasks" ? "block" : "none" }}>
                <Tasks userInfo={userInfo}></Tasks>
              </Box>
              <Box
                sx={{ display: currentTab === "focusTimer" ? "block" : "none" }}
              >
                <FocusTimer></FocusTimer>
              </Box>
              <Box sx={{ display: currentTab === "user" ? "block" : "none" }}>
                <UserInfo userInfo={userInfo}></UserInfo>
              </Box>
            </>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default StrilePage;

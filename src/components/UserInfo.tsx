import { useAuthState } from "react-firebase-hooks/auth";

import { Box, Grid, LinearProgress, Stack, Typography } from "@mui/material";
import { useContext, useMemo } from "react";
import { Context } from "..";
import { SnackBarContext } from "../services/SnackBarProvider";
import { useNavigate } from "react-router";
import Graph from "./Graph";
import { dateWithoutTime, nowWithoutTime } from "../utils/date";

interface UserInfoProps {
  userInfo: any;
}

const UserInfo = ({ userInfo }: UserInfoProps) => {
  const mainContext = useContext(Context);
  const snackBar = useContext(SnackBarContext);

  const [user, loading] = useAuthState(mainContext.auth);
  const navigate = useNavigate();

  useMemo(() => {}, []);

  if (!user && !loading) navigate("/auth");

  console.log(userInfo);

  let habitPoints: number[][] = [];
  let tasksPoints: number[][] = [];
  for (let index = 0; index < 7; index++) {
    let date = new Date();
    date.setDate(date.getDate() - 6 + index);
    habitPoints.push([0, date.getDate()]);
    tasksPoints.push([0, date.getDate()]);
  }
  Object.keys(userInfo?.executed).forEach((key) => {
    const ex = userInfo?.executed[key];
    let date = new Date();
    date.setDate(date.getDate() - 6);
    let days = ex.dateComplete - dateWithoutTime(date);
    if (ex.typeCase === "com.example.strile.data_firebase.models.Habit") {
      habitPoints[Math.ceil(days / (1000 * 60 * 60 * 24)) - 1][0]++;
    } else {
      tasksPoints[Math.ceil(days / (1000 * 60 * 60 * 24)) - 1][0]++;
    }
  });

  let commonMax = 0;
  habitPoints.forEach((p) => {
    commonMax = Math.max(commonMax, p[0]);
  });
  tasksPoints.forEach((p) => {
    commonMax = Math.max(commonMax, p[0]);
  });

  return (
    <Box maxWidth={800} minWidth={300} position="relative" sx={{ ml: 4 }}>
      <Stack spacing={2} height="auto" sx={{ mb: 2 }}>
        <Box key="userInfo-levelBlock" sx={{ background: "#fff", p: 3 }}>
          <Typography variant="h1" color={"primary"} sx={{ mb: 0, pb: 0 }}>
            <Box sx={{ fontWeight: "bold" }}>{userInfo?.level}</Box>
          </Typography>
          <Grid container justifyContent="space-between">
            <Grid item>
              <Typography
                variant="body1"
                color={"primary"}
                sx={{ mt: -2, pt: 0 }}
              >
                Level
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="body1" sx={{ mt: -2, pt: 0 }}>
                {Math.floor(userInfo?.goalExperience - userInfo?.experience)}{" "}
                points more
              </Typography>
            </Grid>
          </Grid>
          <LinearProgress
            variant="determinate"
            value={(userInfo?.experience / userInfo?.goalExperience) * 100}
          />
        </Box>
        <Graph
          key="userInfo-habitGraph"
          width={"100"}
          height={250}
          title="Habits"
          points={habitPoints}
          commonMax={commonMax}
        ></Graph>
        <Graph
          key="userInfo-taskGraph"
          width={"100"}
          height={250}
          title="Tasks"
          points={tasksPoints}
          commonMax={commonMax}
        ></Graph>
      </Stack>
      <Stack height="auto" sx={{ mb: 5 }}>
        {userInfo?.executed ? (
          Object.keys(userInfo?.executed).map((key, index) =>
            userInfo?.executed[key].dateComplete >= nowWithoutTime() ? (
              <Grid
                sx={{ background: "#fff", p: 3 }}
                container
                key={key}
                justifyContent="space-between"
              >
                <Grid item xs={8}>
                  <Typography
                    variant="body1"
                    sx={{ textOverflow: "ellipsis", overflow: "hidden" }}
                  >
                    {userInfo?.executed[key].name}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="body1">
                    {userInfo?.executed[key].experience}
                  </Typography>
                </Grid>
              </Grid>
            ) : (
              <></>
            )
          )
        ) : (
          <></>
        )}
      </Stack>
    </Box>
  );
};

export default UserInfo;

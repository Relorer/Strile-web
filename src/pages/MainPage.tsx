import { Box, Button, Container, Grid, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React from "react";
import { useEffect, useMemo, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Context } from "..";
import { downloadAPK } from "../utils/fileLoader";
import getRandomArbitrary from "../utils/random";
import sleep from "../utils/sleep";

const useStyles = makeStyles((theme) => ({
  line: {
    background: "#cee3fc",
    width: "10vh",
    height: "300vh",
    position: "absolute",
    top: "-35vh",
    left: "30vw",
    transition: "3s",
    transformOrigin: "center",
    zIndex: "-1",
  },
  circle: {
    background: "#cee3fc",
    width: "65vh",
    height: "65vh",
    position: "absolute",
    top: "20vh",
    left: "10vw",
    transition: "3s",
    borderRadius: "100%",
    transformOrigin: "center",
    zIndex: "-1",
  },
  box: {
    background: "#cee3fc",
    width: "50vh",
    height: "50vh",
    position: "absolute",
    top: "50vh",
    left: "60vw",
    transition: "3s",
    transformOrigin: "center",
    zIndex: "-1",
  },
  triangle: {
    position: "absolute",
    top: "0vh",
    left: "85vw",
    transition: "3s",
    transformOrigin: "center",
    zIndex: "-1",

    border: "20vh solid transparent",
    borderLeft: "35vh solid #cee3fc",
    display: "block",
    width: 0,
    height: 0,
  },
}));

const MainPage = () => {
  const mainContext = React.useContext(Context);
  const [user, loading] = useAuthState(mainContext.auth);

  const classes = useStyles();
  const [lineTransform, setLineTransform] = useState("rotate(-20deg)");
  const [circleTransform, setCircleTransform] = useState("rotate(20deg)");
  const [boxTransform, setBoxTransform] = useState("rotate(20deg)");
  const [triangleTransform, setTriangleTransform] = useState("rotate(20deg)");

  const animateLine = async () => {
    while (true) {
      await sleep(getRandomArbitrary(6, 20) * 1000);
      setLineTransform("rotate(-" + getRandomArbitrary(10, 20) + "deg)");
    }
  };

  const animateCircle = async () => {
    while (true) {
      await sleep(getRandomArbitrary(6, 20) * 1000);
      setCircleTransform(
        "translate(" +
          getRandomArbitrary(-15, 15) +
          "%, " +
          getRandomArbitrary(-15, 15) +
          "%)"
      );
    }
  };

  const animateBox = async () => {
    while (true) {
      await sleep(getRandomArbitrary(6, 20) * 1000);
      setBoxTransform(
        "rotate(" +
          getRandomArbitrary(5, 30) +
          "deg) translate(" +
          getRandomArbitrary(-15, 15) +
          "%, " +
          getRandomArbitrary(-15, 15) +
          "%)"
      );
    }
  };

  const animateTriangle = async () => {
    while (true) {
      await sleep(getRandomArbitrary(6, 20) * 1000);
      setTriangleTransform(
        "rotate(" +
          getRandomArbitrary(5, 30) +
          "deg) translate(" +
          getRandomArbitrary(-15, 15) +
          "%, " +
          getRandomArbitrary(-15, 15) +
          "%)"
      );
    }
  };

  useMemo(() => {
    animateLine();
    animateCircle();
    animateBox();
    animateTriangle();
  }, []);

  return (
    <Box height="100vh" overflow={"hidden"} position="relative">
      <Container maxWidth="xl">
        <Grid container height="100vh" alignItems="center">
          <Grid item xs={12} md={6} container spacing={3}>
            <Grid item>
              <Typography variant="h2">
                <Box sx={{ fontWeight: "bold" }}>Be more effective</Box>
                <Box sx={{ fontWeight: "bold" }}>with Strile</Box>
              </Typography>
            </Grid>
            <Grid item container spacing={3}>
              <Grid item  xs={12} md={5} lg={5}>
                <Button
                  variant={"contained"}
                  href={user ? "./strile" : "./auth"}
                  fullWidth
                >
                  <Typography variant="h6">
                    <Box sx={{ fontWeight: "bold" }}>Get Started</Box>
                  </Typography>
                </Button>
              </Grid>
              <Grid item xs={12} md={7} lg={6}>
                <Button onClick={downloadAPK} fullWidth>
                  <Typography variant="h6">Download for Android</Typography>
                </Button>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box
              component="img"
              sx={{
                height: "70vh",
                m: "auto",
                display: "block",
              }}
              alt="Strile example"
              src="./images/template.png"
            />
          </Grid>
        </Grid>
      </Container>
      <div className={classes.line} style={{ transform: lineTransform }}></div>
      <div
        className={classes.circle}
        style={{ transform: circleTransform }}
      ></div>
      <div className={classes.box} style={{ transform: boxTransform }}></div>
      <div
        className={classes.triangle}
        style={{ transform: triangleTransform }}
      ></div>
    </Box>
  );
};

export default MainPage;

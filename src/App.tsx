import * as React from "react";
import Container from "@mui/material/Container";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";

import MainPage from "./pages/MainPage";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import AuthPage from "./pages/AuthPage";
import { SnackBarProvider } from "./services/SnackBarProvider";
import { useAuthState } from "react-firebase-hooks/auth";
import { Context } from ".";
import StrilePage from "./pages/StrilePage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import { BrowserView, MobileView } from "react-device-detect";
import { Box, Button, Grid, Typography } from "@mui/material";
import { downloadAPK } from "./utils/fileLoader";

const theme = createTheme({
  palette: {
    primary: {
      main: "#0971f1",
    },
  },
});

export default function App() {
  return (
    <>
      <MobileView>
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
          style={{ height: "100vh", width: "100vw" }}
          sx={{ p: 5 }}
        >
          <Grid item xs={3}>
            <Typography variant="h6" sx={{ textAlign: "center" }}>
              The mobile version is under development
            </Typography>
            <Box sx={{ mx: 4, my: 6 }}>
              <Button fullWidth variant={"contained"} onClick={downloadAPK}>
                <Typography variant="h6">Download for Android</Typography>
              </Button>
            </Box>
          </Grid>
        </Grid>
      </MobileView>
      <BrowserView>
        <ThemeProvider theme={theme}>
          <SnackBarProvider>
            <Router>
              <Routes>
                <Route path="/" element={<MainPage></MainPage>} />
                <Route path="/auth" element={<AuthPage></AuthPage>} />
                <Route path="/strile" element={<StrilePage></StrilePage>} />
                <Route
                  path="/reset"
                  element={<ResetPasswordPage></ResetPasswordPage>}
                />
              </Routes>
            </Router>
          </SnackBarProvider>
        </ThemeProvider>
      </BrowserView>
    </>
  );
}

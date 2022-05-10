import { AccountCircle } from "@mui/icons-material";
import LockIcon from "@mui/icons-material/Lock";
import GoogleIcon from "@mui/icons-material/Google";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  Box,
  Button,
  Card,
  Divider,
  Input,
  InputAdornment,
  Link,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useContext, useEffect, useMemo, useState } from "react";
import { Context } from "..";
import {
  GoogleAuthProvider,
  signInWithCredential,
  signInWithPopup,
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { SnackBarContext } from "../services/SnackBarProvider";
import { useNavigate } from "react-router";
import { checkEmail } from "../utils/validators";

const useStyles = makeStyles((theme) => ({}));

const ResetPasswordPage = () => {
  const classes = useStyles();
  const mainContext = useContext(Context);
  const snackBar = useContext(SnackBarContext);
  const { notify } = snackBar || { notify: () => {} };

  const [user, loading] = useAuthState(mainContext.auth);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [resetPasswordButton, setResetPasswordButton] = useState(false);

  const resetPassword = async (e: any) => {
    e.preventDefault();
    const auth = mainContext.auth;
    sendPasswordResetEmail(auth, email)
      .then(() => {
        navigate("/auth");
        notify("The email has been sent", "info");
      })
      .catch((e) => {
        if (e.code == "auth/user-not-found") {
          notify("User not found", "error");
        }
        notify(e.message, "error");
      });
  };

  const checkEmailField = (email: string) => {
    setResetPasswordButton(checkEmail(email));
  };

  if (user) navigate("/strile");

  return (
    <>
      <Link href="./">
        <Box
          component="img"
          sx={{
            height: 70,
            mx: "auto",
            my: 5,
            mb: 3,
            display: "block",
          }}
          alt="Strile example"
          src="./images/logo.png"
        />
      </Link>
      <Card
        variant="outlined"
        sx={{ maxWidth: 400, my: 3, mx: "auto", display: "block" }}
      >
        <form onKeyDown={(event) => true}>
          <Box sx={{ m: 5, mb: 2 }}>
            <Input
              id="input-with-icon-adornment"
              placeholder="Email"
              fullWidth
              value={email}
              onChange={(e) => {
                let email = e?.target.value ?? "";
                setEmail(email);
                checkEmailField(email);
              }}
              sx={{ py: 2 }}
              startAdornment={
                <InputAdornment position="start">
                  <AccountCircle />
                </InputAdornment>
              }
            />
          </Box>

          <Box sx={{ m: 5, mb: 4 }}>
            <Button
              disabled={!resetPasswordButton}
              fullWidth
              variant="contained"
              onClick={resetPassword}
              type="submit"
            >
              Reset
            </Button>
          </Box>
        </form>
        <Box sx={{ mx: 5, mt: 0, mb: 5, textAlign: "center" }}>
          <Link href="/auth" sx={{ textDecoration: "none" }}>
            Back
          </Link>
        </Box>
      </Card>
    </>
  );
};

export default ResetPasswordPage;

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
import { useContext, useMemo, useState } from "react";
import { Context } from "..";
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { SnackBarContext } from "../services/SnackBarProvider";
import { useNavigate } from "react-router";
import { checkEmail } from "../utils/validators";

const useStyles = makeStyles((theme) => ({}));

const AuthPage = () => {
  const mainContext = useContext(Context);
  const snackBar = useContext(SnackBarContext);
  const { notify } = snackBar || { notify: () => {} };

  const [user, loading] = useAuthState(mainContext.auth);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signInButton, setSignInButton] = useState(false);

  const signupWithEmail = async (e: any) => {
    e.preventDefault();
    const auth = mainContext.auth;
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {})
      .catch((e) => {
        if (e.code === "auth/email-already-in-use") {
          //EMAIL EXISTS
          signinWithEmail();
        } else {
          notify(e.message, "error");
        }
      });
  };

  const signinWithEmail = async () => {
    const auth = mainContext.auth;
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {})
      .catch((e) => {
        if (e.code === "auth/wrong-password") {
          notify("Wrong password", "error");
        } else {
          notify(e.message, "error");
        }
      });
  };

  const signinWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope("profile");
      provider.addScope("email");
      const result = await signInWithPopup(mainContext.auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
    } catch (e) {
      if (e instanceof Error) {
        notify(e.message, "error");
      }
    }
  };

  const checkEmailPass = (email: string, pass: string) => {
    setSignInButton(pass.length >= 6 && checkEmail(email));
  };

  useMemo(() => {}, []);

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
                checkEmailPass(email, password);
              }}
              sx={{ py: 2 }}
              startAdornment={
                <InputAdornment position="start">
                  <AccountCircle />
                </InputAdornment>
              }
            />
          </Box>
          <Box sx={{ m: 5, mt: 0 }}>
            <Input
              id="input-with-icon-adornment"
              placeholder="Password"
              fullWidth
              value={password}
              onChange={(e) => {
                let pass = e?.target.value ?? "";
                setPassword(pass);
                checkEmailPass(email, pass);
              }}
              type="Password"
              sx={{ py: 2 }}
              startAdornment={
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              }
            />
          </Box>

          <Box sx={{ m: 5, mb: 0 }}>
            <Button
              disabled={!signInButton}
              fullWidth
              variant="contained"
              onClick={signupWithEmail}
              type="submit"
            >
              Sign in / Sign up
            </Button>
          </Box>
        </form>
        <Box sx={{ mx: 5, mt: 2, mb: 5 }}>
          <Link href="/reset" sx={{ textDecoration: "none" }}>
            Forgot Password
          </Link>
        </Box>
        <Box sx={{ mx: 5, mb: 2 }}>
          <Typography component="div" sx={{ color: "#6c7075", opacity: 0.8 }}>
            <Divider>Sign in with</Divider>
          </Typography>
        </Box>

        <Box sx={{ mx: 5, mb: 5 }}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
            color="info"
            onClick={signinWithGoogle}
            sx={{
              color: "#6c7075",
              borderColor: "#6c7075",
              opacity: 0.9,
            }}
          >
            Google
          </Button>
        </Box>
      </Card>
    </>
  );
};

export default AuthPage;

import * as React from "react";
import ReactDOM from "react-dom";
import CssBaseline from "@mui/material/CssBaseline";
import App from "./App";

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { ref, getDatabase } from "firebase/database";

const app = initializeApp({
  apiKey: "AIzaSyCCEvYskcOBwuF6OSmFt7oVcpZ3dmdtSmo",
  authDomain: "strile.firebaseapp.com",
  databaseURL: "https://strile-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "strile",
  storageBucket: "strile.appspot.com",
  messagingSenderId: "1086051508162",
  appId: "1:1086051508162:web:3222720a999fc8c41c805b",
  measurementId: "G-ZY9HLVSGEE",
});

const auth = getAuth();
const database = getDatabase(app);

interface MainContext {
  auth: typeof auth;
  app: typeof app;
  database: typeof database;
}

export const Context = React.createContext<MainContext>({
  auth,
  app,
  database,
});

ReactDOM.render(
  <React.Fragment>
    <CssBaseline />
    <Context.Provider
      value={{
        auth,
        app,
        database,
      }}
    >
      <App />
    </Context.Provider>
  </React.Fragment>,
  document.getElementById("root")
);

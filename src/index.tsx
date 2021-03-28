import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Container, Box, makeStyles } from "@material-ui/core";

ReactDOM.render(
  <React.StrictMode>
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <App />
    </Container>
  </React.StrictMode>,
  document.getElementById("root")
);

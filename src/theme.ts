import { createMuiTheme } from "@material-ui/core/styles";

//A custom theme for this app
const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#66aa88",
      light: "#96C5AD",
      dark: "#41765b",
    },
    secondary: {
      main: "#F0D3F7",
      light: "#F9EEFC",
      dark: "#E0A8F0",
    },
    info: {
      main: "#596475",
    },
  },
});

export default theme;

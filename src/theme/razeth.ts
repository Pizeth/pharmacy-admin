import { deepmerge } from "@mui/utils";
import { defaultDarkTheme, defaultTheme } from "react-admin";
import { red, green, blue } from "@mui/material/colors";

export const lightTheme = deepmerge(defaultTheme, {
  palette: {
    // primary: {
    //   light: "#fb402f",
    //   main: "#ba000d",
    //   // main: "#F70019",
    //   dark: "#e60023",
    //   contrastText: "#fff",
    // },
    // secondary: {
    //   light: "##348dce",
    //   main: "#226fb0",
    //   dark: "#0d4280",
    //   contrastText: "#000",
    // },
    primary: red,
    secondary: blue,
    error: {
      // main: "#d32f2f", // Custom color for error
      main: "#e76f51", // Custom color for error
    },
    warning: {
      main: "#ffa000", // Custom color for warning
    },
    success: {
      main: "#388e3c", // Custom color for success
    },
  },

  components: {
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
      },
    },
    MuiFormControl: {
      defaultProps: {
        variant: "outlined",
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(0, 0, 0, 0.04)",
          "&$disabled": {
            backgroundColor: "rgba(0, 0, 0, 0.04)",
          },
        },
      },
    },
  },
});

export const darkTheme = deepmerge(defaultDarkTheme, {
  palette: {
    primary: {
      mode: "dark",
      // main: "#ba000d",
      // main: "#F70019",
      main: "#e60023",
      // contrastText: "#fff",
    },
    // secondary: {
    //   light: "##348dce",
    //   main: "#226fb0",
    //   dark: "#0d4280",
    //   contrastText: "#000",
    // },
    background: {
      default: "#313131",
    },
  },
  components: {
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
      },
    },
    MuiFormControl: {
      defaultProps: {
        variant: "outlined",
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(0, 0, 0, 0.04)",
          "&$disabled": {
            backgroundColor: "rgba(0, 0, 0, 0.04)",
          },
        },
      },
    },
  },
});

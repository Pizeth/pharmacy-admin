import { deepmerge } from "@mui/utils";
import { defaultDarkTheme, defaultTheme } from "react-admin";
import { red, green, blue } from "@mui/material/colors";
import { PaletteColor } from "@mui/material/styles/createPalette";
import { light } from "@mui/material/styles/createPalette";

declare module "@mui/material/styles" {
  interface Palette {
    error: PaletteColor;
  }
  interface PaletteOptions {
    error?: PaletteColor;
  }
}

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
      // main: "#e76f51", // Custom color for error
      main: "#ffa000",
      light: "#f58700",
      dark: "#FFD22B",
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
      contrastText: "#fff",
    },
    secondary: { main: "#03dac6" },
    error: {
      // main: "#d32f2f", // Custom color for error
      // main: "#e76f51", // Custom color for error
      main: "#ffa000",
      // main: "#FFD22B",
      // light: "#f58700",
      // dark: "#FFD22B",
    },
    // background: { default: "#121212", paper: "#1d1d1d" },
    text: { primary: "#ffffff", secondary: "#aaaaaa" },
    background: { default: "#313131" },
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
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "&.Mui-error .MuiOutlinedInput-notchedOutline": {
            borderColor: (theme) => theme.palette.error.main,
          },
          "&.Mui-focused .MuiSvgIcon-root": {
            color: (theme) => theme.palette.primary.main,
          },
          "&.Mui-error .MuiSvgIcon-root": {
            color: (theme) => theme.palette.error.main,
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          marginLeft: "2em", // Adjust label position when start icon is present
          "&.MuiInputLabel-shrink": { marginLeft: "0" },
          "&.Mui-error": { color: (theme) => theme.palette.error.main },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: { borderColor: (theme) => theme.palette.error.main },
        input: {
          "&::placeholder": {
            color: (theme) => theme.palette.error.main,
            transition: "color 0.5s",
          },
        },
      },
    },

    MuiFormHelperText: {
      styleOverrides: {
        root: {
          "&.Mui-error": {
            color: "#ffa000", // Ensure custom error color for FormHelperText
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          "&.Mui-error": {
            color: "#ffa000", // Custom error color for labels
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "&.Mui-error .MuiOutlinedInput-notchedOutline": {
            borderColor: "#ffa000", // Custom error color for the outline
          },
          "&.Mui-error .MuiInputAdornment-root .MuiSvgIcon-root": {
            color: "#ffa000", // Custom error color for icons
          },
        },
      },
    },
  },
});

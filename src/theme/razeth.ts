import { deepmerge } from "@mui/utils";
import { defaultDarkTheme, defaultTheme, RaThemeOptions } from "react-admin";
import { red, blue } from "@mui/material/colors";
import { createTheme, Theme } from "@mui/material/styles";

const defaultThemeInvariants = {
  typography: {
    h6: {
      fontWeight: 400,
    },
  },
  sidebar: {
    width: 240,
    closedWidth: 50,
  },
  components: {
    MuiAutocomplete: {
      defaultProps: {
        fullWidth: true,
      },
      variants: [
        {
          props: {},
          style: ({ theme }: { theme: Theme }) => ({
            [theme.breakpoints.down("sm")]: { width: "100%" },
          }),
        },
      ],
    },
    MuiTextField: {
      defaultProps: {
        variant: "filled" as const,
        margin: "dense" as const,
        size: "small" as const,
        fullWidth: true,
      },
      variants: [
        {
          props: {},
          style: ({ theme }: { theme: Theme }) => ({
            [theme.breakpoints.down("sm")]: { width: "100%" },
          }),
        },
      ],
    },
    MuiFormControl: {
      defaultProps: {
        variant: "filled" as const,
        margin: "dense" as const,
        size: "small" as const,
        fullWidth: true,
      },
    },
    RaSimpleFormIterator: {
      defaultProps: {
        fullWidth: true,
      },
    },
    RaTranslatableInputs: {
      defaultProps: {
        fullWidth: true,
      },
    },
  },
};

const customBaseTheme = createTheme({
  palette: {
    primary: { main: "#e1232e", contrastText: "#fff" },
    secondary: { main: "#007bff" },
    error: { main: "#f58700" },
    warning: { main: "#FFD22B" },
    info: { main: "#f89696" },
    success: { main: "#2ece71" },
    mode: "dark",
    background: { default: "#121212", paper: "#1d1d1d" },
    text: { primary: "#ffffff", secondary: "#aaaaaa" },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: (props: { theme: Theme }) => ({
          // backgroundColor: props.theme.palette.primary.main, // Customize the AppBar background color
          backgroundColor: "#c40316", // Customize the AppBar background color
          color: props.theme.palette.text.primary, // Customize font color
        }),
      },
    },
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
        root: (props: { theme: Theme }) => ({
          // "& .MuiOutlinedInput-notchedOutline": {
          //   borderColor: props.theme.palette.error.main,
          // },
          // "&.Mui-focused .MuiInputAdornment-root .MuiSvgIcon-root": {
          //   color: props.theme.palette.primary.main,
          // },
          "&.Mui-focused .MuiSvgIcon-root": {
            color: props.theme.palette.primary.main,
          },
          "&.Mui-error .MuiSvgIcon-root": {
            color: props.theme.palette.error.main,
          },
        }),
      },
    },
    // MuiFormHelperText: {
    //   styleOverrides: {
    //     root: {
    //       "&.Mui-error": { color: (theme: Theme) => theme.palette.error.main },
    //     },
    //   },
    // },
    // MuiInputLabel: {
    //   styleOverrides: {
    //     root: {
    //       marginLeft: "2em",
    //       "&.MuiInputLabel-shrink": { marginLeft: "0" },
    //       "&.Mui-error": { color: (theme: Theme) => theme.palette.error.main },
    //     },
    //   },
    // },
    // MuiInputBase: {
    //   styleOverrides: {
    //     root: {
    //       "&.Mui-error": {
    //         borderColor: (theme: Theme) => theme.palette.error.main,
    //       },
    //     },
    //     input: {
    //       "&::placeholder": {
    //         color: (theme: Theme) => theme.palette.error.main,
    //         transition: "color 0.5s",
    //       },
    //     },
    //   },
    // },
    // MuiInputAdornment: {
    //   styleOverrides: {
    //     root: {
    //       "&.Mui-error .MuiSvgIcon-root": {
    //         color: (theme: Theme) => theme.palette.error.main,
    //       },
    //     },
    //   },
    // },
  },
});

// Merge custom base theme with defaults const
export const darkTheme: RaThemeOptions = deepmerge(
  defaultThemeInvariants,
  customBaseTheme,
);

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
      main: "#079e0f", // Custom color for success
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

export const darkTheme1 = deepmerge(defaultDarkTheme, {
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
        root: (props: { theme: Theme }) => ({
          borderColor: props.theme.palette.error.main,
          "&.Mui-focused .MuiInputAdornment-root .MuiSvgIcon-root": {
            color: (theme: Theme) => theme.palette.primary.main,
          },
          // "& .MuiOutlinedInput-notchedOutline": {
          //   borderColor: props.theme.palette.error.main,
          // },
          // "&.Mui-focused .MuiInputAdornment-root .MuiSvgIcon-root": {
          //   color: props.theme.palette.primary.main,
          // },
          "&.Mui-focused .MuiSvgIcon-root": {
            color: props.theme.palette.primary.main,
          },
          "&.Mui-error .MuiSvgIcon-root": {
            color: props.theme.palette.error.main,
          },
        }),
      },
    },

    // MuiOutlinedInput: {
    //   styleOverrides: {
    //     root: {
    //       borderColor: (theme: Theme) => theme.palette.error.main,
    //       "&.Mui-focused .MuiInputAdornment-root .MuiSvgIcon-root": {
    //         color: (theme: Theme) => theme.palette.primary.main,
    //       },
    //       // Focus state
    //       "&.Mui-focused .MuiSvgIcon-root": {
    //         color: "#e60023",
    //       },

    //       // Error state
    //       "&.Mui-error .MuiSvgIcon-root": {
    //         color: "#ffa000",
    //       },
    //     },
    //   },
    // },
  },
});

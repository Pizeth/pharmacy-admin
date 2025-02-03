import { deepmerge } from "@mui/utils";
import { defaultDarkTheme, defaultTheme, RaThemeOptions } from "react-admin";
import { red, blue } from "@mui/material/colors";
import { createTheme, Theme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    passwordStrength: string[] | ((theme: Theme) => string[]);
  }
  interface PaletteOptions {
    passwordStrength?: string[] | ((theme: Theme) => string[]);
  }
}

// declare module "@mui/material/LinearProgress" {
//   interface LinearProgressProps {
//     ownerState?: {
//       strength?: number;
//     };
//   }
// }

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
    // primary: { main: "#e1232e", contrastText: "#fff" },
    // secondary: { main: "#007bff", dark: "#0056b3" },
    // error: { main: "#f58700", dark: "#e76f51" },
    // warning: { main: "#FFD22B", dark: "#f58700" },
    // info: { main: "#f89696", dark: "#cc56e4" },
    // success: { main: "#2ece71", dark: "#079e0f" },
    mode: "dark",
    background: { default: "#121212", paper: "#1d1d1d" },
    text: { primary: "#ffffff", secondary: "#aaaaaa" },
    // passwordStrength: ["#f44336", "#ff9900", "#ffeb3b", "#4caf50", "#2e7d32"],
    passwordStrength: ["#aaaaaa", "#e76f51", "#f58700", "#0668d1", "#4caf50"],
    // passwordStrength: (theme) => [
    //   // This is a function that returns the array
    //   theme.palette.error.main,
    //   theme.palette.warning.main,
    //   theme.palette.info.main,
    //   theme.palette.success.main,
    //   theme.palette.success.dark,
    // ],
    // passwordStrength: (theme: Theme) => [
    //   theme.palette.error.main,
    //   theme.palette.warning.main,
    //   theme.palette.info.main,
    //   theme.palette.success.main,
    //   theme.palette.success.dark,
    // ],
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
      styleOverrides: {
        root: {
          marginTop: "0.5em",
          marginBottom: "0.25em",
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          marginTop: "0.75em",
          // "&.Mui-error": { color: (theme: Theme) => theme.palette.error.main },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          "&.MuiTypography-caption": {
            marginleft: "0.25em",
          },
        },
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
    MuiCssBaseline: {
      styleOverrides: (theme) => `
        // .MuiBox-root {
        //   // Default styles for all Box components
        //   margin: ${theme.spacing(0)};
        //   padding: ${theme.spacing(0)};
        
        //   // Specific styles for react-admin components
        //   &.RaFileInput-dropZone {
        //     border: 2px dashed ${theme.palette.divider};
        //     padding: ${theme.spacing(4)};
        //     text-align: center;
        //   }

        //   &.css-164r41r { // Password strength meter container
        //     margin-top: ${theme.spacing(0)};
        //     padding: ${theme.spacing(0)};
        //   }
        // }

        /* Target ALL Boxes inside Stacks */
        .MuiStack-root .MuiBox-root {
          margin: ${theme.spacing(0)};
          padding: ${theme.spacing(0)};
          line-height: 0;
        }

        /* Specific to Password Strength Meter Box */
        .MuiStack-root > .MuiBox-root:has(.MuiLinearProgress-root) {
          margin-top: ${theme.spacing(0)};
          padding: ${theme.spacing(0)};
          // background-color: ${theme.palette.grey[100]};
        }

        /* For browsers without :has() support (fallback) */
        .MuiStack-root > .MuiBox-root[data-pw-strength] {
          margin-top: ${theme.spacing(0)};
          padding: ${theme.spacing(0)};
          // background-color: ${theme.palette.grey[100]};
        }
      `,
    },
    MuiCard: {
      styleOverrides: {
        root: {
          "&.MuiBox-root": {
            // color: props.theme.palette.primary.main,
            margin: "0px",
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        // Target the bar itself
        // bar: {
        //   backgroundColor: "#4caf50", // Custom color
        //   borderRadius: "4px", // Rounded corners
        //   height: "10px", // Adjust thickness
        // },
        // Optional: Override other states (e.g., buffer or query animation)
        // colorPrimary: {
        // backgroundColor: "#e0e0e0", // Background color of the progress track
        // backgroundColor: "#bd222a",
        // },

        root: ({ theme }) => ({
          height: 5,
          borderRadius: 5,
          // backgroundColor: "#bd222a",
          // backgroundColor: "#e0e0e0",
        }),
        // bar: ({ theme, ownerState }) => {
        //   // Resolve the passwordStrength array properly
        //   const strengthColors =
        //     typeof theme.palette.passwordStrength === "function"
        //       ? theme.palette.passwordStrength(theme)
        //       : theme.palette.passwordStrength || [];

        //   return {
        //     borderRadius: 4,
        //     backgroundColor:
        //       ownerState?.strength !== undefined
        //         ? strengthColors[
        //             Math.min(ownerState.strength, strengthColors.length - 1)
        //           ]
        //         : theme.palette.primary.main,
        //   };
        // },
        // bar: ({ theme, ownerState }) => {
        //   // Handle fallback for passwordStrength array
        //   const strengthColors = Array.isArray(theme.palette.passwordStrength)
        //     ? theme.palette.passwordStrength
        //     : ["#f44336", "#ff9900", "#ffeb3b", "#4caf50", "#2e7d32"];

        //   const strength = ownerState?.strength ?? 0;

        //   return {
        //     borderRadius: 4,
        //     backgroundColor:
        //       strengthColors[Math.min(strength, strengthColors.length - 1)],
        //   };
        // },
        // Add this to fix the colorPrimary error
        // colorPrimary: ({ theme }) => ({
        //   backgroundColor: theme.palette.grey[300],
        // }),

        // bar: ({ theme, ownerState }) => ({
        //   borderRadius: 4,
        //   // Use ownerState to access custom props
        //   backgroundColor:
        //     ownerState?.strength !== undefined
        //       ? Array.isArray(theme.palette.passwordStrength)
        //         ? theme.palette.passwordStrength[
        //             Math.min(
        //               ownerState.strength as number,
        //               theme.palette.passwordStrength.length - 1,
        //             )
        //           ]
        //         : theme.palette.primary.main
        //       : theme.palette.primary.main,
        // }),
        // bar: ({ theme, ownerState }) => ({
        //   borderRadius: 4,
        //   backgroundColor:
        //     ownerState?.strength !== undefined &&
        //     Array.isArray(theme.palette.passwordStrength)
        //       ? theme.palette.passwordStrength[
        //           Math.min(
        //             ownerState.strength,
        //             theme.palette.passwordStrength.length - 1,
        //           )
        //         ]
        //       : theme.palette.primary.main,
        // }),
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

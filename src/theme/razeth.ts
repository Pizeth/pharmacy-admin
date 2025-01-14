import { deepmerge } from "@mui/utils";
import { defaultDarkTheme, defaultTheme } from "react-admin";
import { red, green, blue } from "@mui/material/colors";
import {
  PaletteColor,
  PaletteColorOptions,
} from "@mui/material/styles/createPalette";
import { light } from "@mui/material/styles/createPalette";
import { createTheme, Theme } from "@mui/material/styles";
import { InputAdornment, SvgIcon } from "@mui/material";

// Ensure the theme's palette is correctly extended

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
    // MuiOutlinedInput: {
    //   styleOverrides: {
    //     root: {
    //       "&.Mui-error .MuiOutlinedInput-notchedOutline": {
    //         borderColor: "#ffa000", // Custom error color for the outline
    //       },
    //       "&.Mui-error .MuiInputAdornment-root .MuiSvgIcon-root": {
    //         color: "#ffa000", // Custom error color for icons
    //       },
    //     },
    //   },
    // },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderColor: (theme: Theme) => theme.palette.error.main,
          "&.Mui-focused .MuiInputAdornment-root .MuiSvgIcon-root": {
            color: (theme: Theme) => theme.palette.primary.main,
          },
          // Focus state
          "&.Mui-focused .MuiSvgIcon-root": {
            color: "#e60023",
          },

          // Error state
          "&.Mui-error .MuiSvgIcon-root": {
            color: "#ffa000",
          },
        },
      },
    },
    // outlinedInput: {
    //   "&:hover .MuiInputAdornment-root .MuiSvgIcon-root": {
    //     color: (theme: Theme) => theme.palette.primary.main,
    //   },
    //   "&.Mui-focused .MuiInputAdornment-root .MuiSvgIcon-root": {
    //     color: (theme: Theme) => theme.palette.primary.main,
    //   },
    // },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          marginLeft: "2em", // Adjust label position when start icon is present
          "&.MuiInputLabel-shrink": { marginLeft: "0" },
          "&.Mui-error": { color: (theme: Theme) => theme.palette.error.main },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          "&.Mui-error": {
            color: (theme: Theme) => theme.palette.error.main,
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: { borderColor: (theme: Theme) => theme.palette.error.main },
        input: {
          "&::placeholder": {
            color: (theme: Theme) => theme.palette.error.main,
            transition: "color 0.5s",
          },
        },
      },
    },
    MuiInputAdornment: {
      styleOverrides: {
        root: {
          "&.error .MuiSvgIcon-root": {
            color: (theme: Theme) => theme.palette.error.main,
          },
        },
      },
    },
  },
});

const customBaseTheme = createTheme({
  palette: {
    primary: { main: "#e1232e" },
    secondary: { main: "#007bff" },
    error: { main: "#f58700" },
    background: { default: "#121212", paper: "#1d1d1d" },
    text: { primary: "#ffffff", secondary: "#aaaaaa" },
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
    // MuiOutlinedInput: {
    //   styleOverrides: {
    //     root: {
    //       borderColor: (theme: Theme) => theme.palette.error.main,
    //       "&.Mui-focused .MuiInputAdornment-root .MuiSvgIcon-root": {
    //         color: (theme: Theme) => theme.palette.primary.main,
    //       },
    //       "&.Mui-focused .MuiSvgIcon-root": {
    //         color: (theme: Theme) => theme.palette.primary.main,
    //       },
    //       "&.Mui-error .MuiSvgIcon-root": {
    //         color: (theme: Theme) => theme.palette.error.main,
    //       },
    //     },
    //   },
    // },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: (theme: Theme) => theme.palette.error.main,
          },
          "&.Mui-focused .MuiInputAdornment-root .MuiSvgIcon-root": {
            color: (theme: Theme) => theme.palette.primary.main,
          },
          "&.Mui-focused .MuiSvgIcon-root": {
            color: (theme: Theme) => theme.palette.primary.main,
          },
          "&.Mui-error .MuiSvgIcon-root": {
            color: (theme: Theme) => theme.palette.error.main,
          },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          "&.Mui-error": { color: (theme: Theme) => theme.palette.error.main },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          marginLeft: "2em",
          "&.MuiInputLabel-shrink": { marginLeft: "0" },
          "&.Mui-error": { color: (theme: Theme) => theme.palette.error.main },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          "&.Mui-error": {
            borderColor: (theme: Theme) => theme.palette.error.main,
          },
        },
        input: {
          "&::placeholder": {
            color: (theme: Theme) => theme.palette.error.main,
            transition: "color 0.5s",
          },
        },
      },
    },
    MuiInputAdornment: {
      styleOverrides: {
        root: {
          "&.Mui-error .MuiSvgIcon-root": {
            color: (theme: Theme) => theme.palette.error.main,
          },
        },
      },
    },
  },
});

// Merge custom base theme with defaults const
export const darkTheme1 = deepmerge(defaultDarkTheme, customBaseTheme);

// MuiFormHelperText: {
//   styleOverrides: {
//     root: {
//       "&.Mui-error": {
//         color: "#ffa000", // Ensure custom error color for FormHelperText
//       },
//     },
//   },
// },
// MuiInputLabel: {
//   styleOverrides: {
//     root: {
//       "&.Mui-error": {
//         color: "#ffa000", // Custom error color for labels
//       },
//     },
//   },
// },
// MuiOutlinedInput: {
//   styleOverrides: {
//     root: {
//       "&.Mui-error .MuiOutlinedInput-notchedOutline": {
//         borderColor: "#ffa000", // Custom error color for the outline
//       },
//       "&.Mui-error .MuiInputAdornment-root .MuiSvgIcon-root": {
//         color: "#ffa000", // Custom error color for icons
//       },
//     },
//   },
// },

// export const StyledTextField = styled(ResettableTextField)(
//   ({ theme, error }) => ({
//     "& .MuiInputBase-root": {
//       borderColor: error ? theme.palette.error.main : "inherit",
//     },
//     "& .MuiInputBase-input::placeholder": {
//       color: error ? theme.palette.error.main : "inherit",
//       transition: "color 0.5s",
//     },
//     "& .MuiOutlinedInput-root": {
//       "&.Mui-focused .MuiSvgIcon-root": {
//         color: error ? theme.palette.error.main : "inherit", //theme.palette.primary.main,
//       },
//     },
//     "& .MuiInputLabel-outlined": {
//       marginLeft: "2em", // Adjust label position when start icon is present
//       "&.MuiInputLabel-shrink": { marginLeft: "0" },
//     },
//   }),
// );

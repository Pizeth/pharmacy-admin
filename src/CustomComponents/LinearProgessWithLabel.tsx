import { LinearProgress, Typography, Box, Theme } from "@mui/material";
import { LinearProgressWithLabelProps } from "../Types/types";

// export const LinearProgressWithLabel = (
//   props: LinearProgressProps & { value: number },
// ) => {
//   return (
//     <Box sx={{ display: "flex", alignItems: "center" }}>
//       <Box sx={{ width: "100%", mr: 1 }}>
//         <LinearProgress variant="determinate" {...props} />
//       </Box>
//       <Box sx={{ minWidth: 35 }}>
//         <Typography
//           variant="body2"
//           sx={{ color: "text.secondary" }}
//         >{`${Math.round(props.value)}%`}</Typography>
//       </Box>
//     </Box>
//   );
// };

const defaultColors = ["#aaaaaa", "#e76f51", "#f58700", "#0668d1", "#4caf50"];

const LinearProgressWithLabel = ({
  strength,
  value,
  ...props
}: LinearProgressWithLabelProps) => {
  const color = (theme: Theme) => {
    const strengthColors = Array.isArray(theme.palette.passwordStrength)
      ? theme.palette.passwordStrength
      : defaultColors;
    return strengthColors[Math.min(strength, strengthColors.length - 1)];
  };

  return (
    <Box display="flex" alignItems="center">
      <Box width="100%" mr={1}>
        <LinearProgress
          {...props}
          variant="determinate"
          value={value}
          sx={{
            "& .MuiLinearProgress-bar": {
              backgroundColor: color,
            },
          }}
        />
      </Box>
      <Box minWidth={35} className="text-center">
        <Typography variant="caption" sx={{ color: color }}>
          {`${Math.round(value)}%`}
        </Typography>
      </Box>
    </Box>
  );

  // return (
  //   <Box display="flex" alignItems="center">
  //     <Box width="100%" mr={1}>
  //       <LinearProgress
  //         {...props}
  //         variant="determinate"
  //         value={value}
  //         // Force override all color-related styles
  //         sx={{
  //           "& .MuiLinearProgress-bar": {
  //             backgroundColor: (theme) => {
  //               const strengthColors = Array.isArray(
  //                 theme.palette.passwordStrength,
  //               )
  //                 ? theme.palette.passwordStrength
  //                 : getColor(strength);
  //               return strengthColors[
  //                 Math.min(strength ?? 0, strengthColors.length - 1)
  //               ];
  //             },
  //           },
  //         }}
  //       />
  //     </Box>
  //     <Box minWidth={35} className="text-center">
  //       <Typography
  //         variant="caption"
  //         sx={{
  //           color: (theme) => {
  //             const strengthColors = Array.isArray(
  //               theme.palette.passwordStrength,
  //             )
  //               ? theme.palette.passwordStrength
  //               : getColor(strength);
  //             return strengthColors[
  //               Math.min(strength ?? 0, strengthColors.length - 1)
  //             ];
  //           },
  //         }}
  //       >
  //         {`${Math.round(value)}%`}
  //       </Typography>
  //     </Box>
  //   </Box>
  // );
};

export default LinearProgressWithLabel;

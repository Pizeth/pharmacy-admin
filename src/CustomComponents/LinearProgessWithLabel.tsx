import {
  LinearProgressProps,
  LinearProgress,
  Typography,
  Box,
} from "@mui/material";
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

// const LinearProgressWithLabel = ({
//   strength,
//   ...props
// }: LinearProgressWithLabelProps) => {
//   return (
//     <Box display="flex" alignItems="center">
//       <Box width="100%" mr={1}>
//         <LinearProgress
//           variant="determinate"
//           {...props}
//           ownerState={{ strength }}
//         />
//       </Box>
//       <Box minWidth={35}>
//         <Typography variant="body2" color="textSecondary">{`${Math.round(
//           props.value,
//         )}%`}</Typography>
//       </Box>
//     </Box>
//   );
// };

const getColor = (strength: number) => {
  const colors = ["#f44336", "#ff9900", "#ffeb3b", "#4caf50", "#2e7d32"];
  return colors[Math.min(strength, colors.length - 1)];
};

const LinearProgressWithLabel = ({
  strength,
  value,
  ...props
}: LinearProgressWithLabelProps) => {
  return (
    <Box display="flex" alignItems="center">
      <Box width="100%" mr={1}>
        <LinearProgress
          {...props}
          variant="determinate"
          value={value}
          // color="primary" // Set default color to primary
          // ownerState={{ strength }} // Pass strength to ownerState
          // Force override all color-related styles
          sx={{
            // backgroundColor: (theme) => theme.palette.grey[300],
            // backgroundColor: (theme) => theme.palette.info.main,
            "& .MuiLinearProgress-bar": {
              backgroundColor: (theme) => {
                const strengthColors = Array.isArray(
                  theme.palette.passwordStrength,
                )
                  ? theme.palette.passwordStrength
                  : getColor(strength);
                return strengthColors[
                  Math.min(strength ?? 0, strengthColors.length - 1)
                ];
              },
            },
          }}
        />
      </Box>
      <Box minWidth={35} className="text-center">
        <Typography
          variant="caption"
          // color="textSecondary"
          sx={{
            color: (theme) => {
              const strengthColors = Array.isArray(
                theme.palette.passwordStrength,
              )
                ? theme.palette.passwordStrength
                : getColor(strength);
              return strengthColors[
                Math.min(strength ?? 0, strengthColors.length - 1)
              ];
            },
          }}
        >
          {`${Math.round(value)}%`}
        </Typography>
      </Box>
    </Box>
  );
};

// const LinearProgressWithLabel = (
//   props: LinearProgressProps & { value: number },
// ) => {
//   return (
//     <Box display="flex" alignItems="center">
//       <Box width="100%" mr={1}>
//         <LinearProgress variant="determinate" {...props} />
//       </Box>
//       <Box minWidth={35}>
//         <Typography variant="body2" color="textSecondary">{`${Math.round(
//           props.value,
//         )}%`}</Typography>
//       </Box>
//     </Box>
//   );
// };

export default LinearProgressWithLabel;

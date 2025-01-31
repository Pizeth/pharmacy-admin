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

const LinearProgressWithLabel = ({
  strength,
  value,
  ...props
}: LinearProgressWithLabelProps) => {
  return (
    <Box display="flex" alignItems="center">
      <Box width="100%" mr={1}>
        <LinearProgress
          variant="determinate"
          value={value}
          ownerState={{ strength }} // Keep this!
          {...props}
        />
      </Box>
      <Box minWidth={35}>
        <Typography variant="body2" color="textSecondary">
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

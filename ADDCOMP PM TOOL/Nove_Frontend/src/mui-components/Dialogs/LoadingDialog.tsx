import React from "react";
import {
  Dialog,
  DialogContent,
  CircularProgress,
  Typography,
  Stack,
  LinearProgress,
  useTheme,
} from "@mui/material";
import { BarChart } from "@mui/icons-material";
import { Box, keyframes } from "@mui/system";

const barUpDown = keyframes`
  0% { transform: scaleY(1); }
  50% { transform: scaleY(0.5); } /* Shrink the bar */
  100% { transform: scaleY(1); } /* Back to full height */
`;

const AnimatedBar = ({ delay,bgColor }: any) => {
  return(
    <Box
    sx={{
      width: "6px",
      height: "30px",
      backgroundColor: bgColor,
      margin: "0 2px",
      display: "inline-block",
      transformOrigin: "bottom", // Animate from the bottom of the bar
      animation: `${barUpDown} 1s ease-in-out infinite`,
      animationDelay: `${delay}s`, // Stagger the animation delay for each bar
    }}
  />
  )
}
interface LoadingDialogProps {
  open: boolean;
}
//  Saving your changes, please wait...
const LoadingDialog: React.FC<LoadingDialogProps> = ({ open }) => {
  const theme = useTheme();
  return (
    <Dialog open={open} aria-labelledby="loading-dialog-title">
      <LinearProgress />
      <DialogContent>
        <Stack
          direction={"column"}
          justifyContent={"center"}
          sx={{ minWidth: 450 }}
          alignItems={"center"}
          spacing={1}
          padding={1}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
            }}
          >
            {/* Render multiple bars with different delays for a staggered animation effect */}
            <AnimatedBar delay={0} bgColor={theme.palette.primary.main} />
            <AnimatedBar delay={0.2} bgColor={theme.palette.warning.main}/>
            <AnimatedBar delay={0.4} bgColor={theme.palette.error.main}/>
            <AnimatedBar delay={0.6} bgColor={theme.palette.success.main}/>
          </Box>
          <Typography variant="body1" fontSize={"1.2rem"} fontWeight={500}>
            Hold on! We're processing your data.
          </Typography>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default LoadingDialog;

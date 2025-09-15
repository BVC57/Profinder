import React from "react";
import { Box } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const PageDownArrow = ({ onClick }) => {
  return (
    <>
      <Box
        sx={{
          position: "absolute",
          bottom: 60,
          left: "50%",
          transform: "translateX(-50%)",
          color: "white",
          opacity: 0.8,
          animation: "bounce 2s infinite",
          cursor: "pointer",
        }}
        onClick={onClick} // optional scroll or action
      >
        <KeyboardArrowDownIcon sx={{ fontSize: 40 }} />
      </Box>

      {/* Arrow Bounce Animation */}
      <style>
        {`
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
              transform: translateX(-50%) translateY(0);
            }
            40% {
              transform: translateX(-50%) translateY(-10px);
            }
            60% {
              transform: translateX(-50%) translateY(-5px);
            }
          }
        `}
      </style>
    </>
  );
};

export default PageDownArrow;

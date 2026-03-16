import React from "react";
import { Box, Typography, Link } from "@mui/material";

const Footer = () => {
  return (
    <Box
      sx={{
        mt: 3,
        background: "var(--white)",
        border: "1px solid var(--border)",
        borderRadius: 3,
        padding: { xs: 2, sm: 3 },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        {/* Data Source */}
        <Box>
          <Typography
            sx={{
              fontFamily: "monospace",
              fontSize: "0.7rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--sub)",
              mb: 0.8,
            }}
          >
            Data Source
          </Typography>

          <Typography
            sx={{
              fontSize: "0.9rem",
              lineHeight: 1.6,
              maxWidth: 420,
            }}
          >
            Air quality data provided by{" "}
            <Link
              href="https://waqi.info/"
              target="_blank"
              underline="hover"
            >
              World Air Quality Index
            </Link>
          </Typography>
        </Box>

        {/* Update Info */}
        <Box>
          <Typography
            sx={{
              fontFamily: "monospace",
              fontSize: "0.7rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--sub)",
              mb: 0.8,
            }}
          >
            Information
          </Typography>

          <Typography
            sx={{
              fontSize: "0.9rem",
              lineHeight: 1.6,
            }}
          >
            This website helps people understand local air quality conditions.
            Forecast values are predictions and may change.
          </Typography>
        </Box>
      </Box>

      {/* Bottom line */}
      <Box
        sx={{
          mt: 2.5,
          pt: 2,
          borderTop: "1px solid var(--border)",
          display: "flex",
          justifyContent: "space-between",
          flexDirection: { xs: "column", sm: "row" },
          gap: 1,
        }}
      >
        <Typography
          sx={{
            fontSize: "0.8rem",
            color: "var(--sub)",
          }}
        >
          AirSense - Know Your Air, Live Well
        </Typography>

        <Typography
          sx={{
            fontSize: "0.8rem",
            color: "var(--sub)",
          }}
        >
          Designed for easy understanding of air pollution levels
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;
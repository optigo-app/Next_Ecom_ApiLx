import React from "react";
import { Box, Button, Stack } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import SortIcon from "@mui/icons-material/Sort";
import ViewModuleIcon from "@mui/icons-material/ViewModule";

const ActionIsland = () => {
  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 20,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1000,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          bgcolor: "background.paper",
          boxShadow: 4,
          borderRadius: 999,
          px: 1,
          py:1,
        }}
      >
        <Stack direction="row" spacing={0.5}>
          <Button
            startIcon={<FilterListIcon />}
            size="small"
            sx={{ textTransform: "none", borderRadius: 999  ,px:2 ,py:1}}
          >
            Filter
          </Button>

          <Button
            startIcon={<SortIcon />}
            size="small"
            sx={{ textTransform: "none", borderRadius: 999  ,px:2 ,py:1}}
          >
            Sort
          </Button>

          <Button
            startIcon={<ViewModuleIcon />}
            size="small"
            sx={{ textTransform: "none", borderRadius: 999 ,px:2 ,py:1 }}
          >
            View
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default ActionIsland;

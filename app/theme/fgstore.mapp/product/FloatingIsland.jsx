import React from "react";
import { Box, Button, Stack } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import SortIcon from "@mui/icons-material/Sort";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import PhotoRoundedIcon from '@mui/icons-material/PhotoRounded';

const ActionIsland = ({
  ImageView,
  ChangeView,
  OpenFilter,
  FilterDrawerOpen
}) => {
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
          py: 1,
        }}
      >
        <Stack direction="row" spacing={0.5}>
          <Button
            onClick={OpenFilter}
            startIcon={<FilterListIcon fontSize="medium" />}
            size="small"
            sx={{ textTransform: "none", borderRadius: 999, px: 2, py: 1 }}
          >
            Filter
          </Button>

          {/* <Button
          onClick={OpenFilter}
            startIcon={<SortIcon />}
            size="small"
            sx={{ textTransform: "none", borderRadius: 999, px: 2, py: 1 }}
          >
            Sort
          </Button> */}

          <Button
            onClick={ChangeView}
            startIcon={ImageView ? <PhotoRoundedIcon fontSize="medium"  /> : <ViewModuleIcon fontSize="medium"  />}
            size="small"
            sx={{ textTransform: "none", borderRadius: 999, px: 2, py: 1 }}
          >
            View
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default ActionIsland;

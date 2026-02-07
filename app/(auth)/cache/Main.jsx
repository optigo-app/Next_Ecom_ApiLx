"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Tooltip
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import InfoIcon from "@mui/icons-material/Info"; // Optional icon
import { formatDistanceToNow } from "date-fns";

const CacheManager = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openConfirm, setOpenConfirm] = useState(false);
  
  // Pagination State
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Fetch Data
  const fetchCache = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cache?mode=list", { cache: "no-store" });
      const json = await res.json();
      if (json.success) {
        setRows(json.data);
      }
    } catch (error) {
      console.error("Failed to load cache", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCache();
  }, []);

  // Handle Delete Single
  const handleDelete = async (key, fileName) => {
    const target = fileName || key;
    try {
      await fetch(`/api/cache?key=${encodeURIComponent(target)}`, {
        method: "DELETE",
      });
      // Remove from UI immediately
      const newRows = rows.filter((row) => row.fileName !== fileName);
      setRows(newRows);
      
      // Adjust pagination if we deleted the last item on a page
      if (newRows.length <= page * rowsPerPage && page > 0) {
        setPage(page - 1);
      }
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  // Handle Clear All
  const handleClearAll = async () => {
    try {
      await fetch(`/api/cache?mode=all`, { method: "DELETE" });
      setRows([]);
      setPage(0);
      setOpenConfirm(false);
    } catch (error) {
      console.error("Clear all failed", error);
    }
  };

  // Pagination Handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Calculate visible rows
  const visibleRows = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        {/* Header Section */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold">
              Server Cache Manager
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Cached Items: {rows.length}
            </Typography>
          </Box>
          <Box>
            <Button
              startIcon={<RefreshIcon />}
              onClick={fetchCache}
              variant="outlined"
              sx={{ mr: 2 }}
              disabled={loading}
            >
              Refresh
            </Button>
            <Button
              startIcon={<DeleteSweepIcon />}
              onClick={() => setOpenConfirm(true)}
              variant="contained"
              color="error"
              disabled={rows.length === 0 || loading}
            >
              Clear All Cache
            </Button>
          </Box>
        </Box>

        {/* Table Section */}
        <TableContainer sx={{ border: "1px solid #e0e0e0", borderRadius: 1, maxHeight: 650 }}>
          <Table stickyHeader aria-label="cache table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", bgcolor: "#f5f5f5" }}>Cache Key / Name</TableCell>
                <TableCell sx={{ fontWeight: "bold", bgcolor: "#f5f5f5" }}>Context / Meta</TableCell>
                <TableCell sx={{ fontWeight: "bold", bgcolor: "#f5f5f5" }}>Size</TableCell>
                <TableCell sx={{ fontWeight: "bold", bgcolor: "#f5f5f5" }}>Created</TableCell>
                <TableCell sx={{ fontWeight: "bold", bgcolor: "#f5f5f5" }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold", bgcolor: "#f5f5f5" }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 10 }}>
                    <CircularProgress />
                    <Typography sx={{ mt: 2 }}>Loading Cache Data...</Typography>
                  </TableCell>
                </TableRow>
              ) : rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                    <Typography variant="h6" color="text.secondary">
                      No cache files found.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                visibleRows.map((row) => (
                  <TableRow hover key={row.fileName || row.originalKey}>
                    
                    {/* Key Column */}
                    <TableCell sx={{ maxWidth: 300 }}>
                      <Box sx={{ wordBreak: "break-all", whiteSpace: "normal" }}>
                        <strong>{row.originalKey}</strong>
                        <Typography variant="caption" display="block" color="text.secondary">
                          File: {row.fileName}
                        </Typography>
                      </Box>
                    </TableCell>

                    {/* Meta Column */}
                    <TableCell>
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                        {row.meta?.type && (
                          <Chip label={`Type: ${row.meta.type}`} size="small" variant="outlined" />
                        )}
                        {row.meta?.storeUkey && (
                          <Typography variant="caption">Store: {row.meta.storeUkey}</Typography>
                        )}
                      </Box>
                    </TableCell>

                    {/* Size */}
                    <TableCell>{row.size}</TableCell>

                    {/* Created Date */}
                    <TableCell>
                      {row.timestamp ? formatDistanceToNow(row.timestamp, { addSuffix: true }) : "N/A"}
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <Chip
                        label={row.isExpired ? "Expired" : "Active"}
                        color={row.isExpired ? "error" : "success"}
                        size="small"
                      />
                    </TableCell>

                    {/* Actions */}
                    <TableCell align="right">
                      <Tooltip title="Delete this cache">
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(row.originalKey, row.fileName)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        {!loading && rows.length > 0 && (
          <TablePagination
            rowsPerPageOptions={[10, 25, 50, 100]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </Paper>

      {/* Confirmation Dialog */}
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Clear All Cache?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete <b>ALL</b> cache files from the server? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)}>Cancel</Button>
          <Button onClick={handleClearAll} color="error" autoFocus>
            Yes, Clear All
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CacheManager;
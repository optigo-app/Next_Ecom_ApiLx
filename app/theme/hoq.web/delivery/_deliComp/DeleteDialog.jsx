import React from "react";
import "./Delivery.scss";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
} from "@mui/material";

export default function DeleteDialog({
    openDelete,
    handleDeleteClose,
    handleDelete,
}) {
    return (
        <Dialog open={openDelete} onClose={handleDeleteClose}>
            <DialogTitle>Delete Address</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure you want to delete this address?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={handleDeleteClose}
                    color="secondary"
                    sx={{ color: "black" }}
                >
                    Cancel
                </Button>
                <Button
                    className="btn_delete_hoq"
                    onClick={handleDelete}
                    sx={{
                        color: "white",
                        background: "#c20000",
                        "&:hover": {
                            backgroundColor: "#c20000",
                        },
                    }}
                >
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
}

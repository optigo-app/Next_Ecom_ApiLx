import { Box, Modal } from '@mui/material';
import React, { useState } from 'react'

const ItemRemarkDialog = ({
    showRemark1,
    handleClose1,
    handleClose2,
    selectedItem,
    productRemark,
    open1,
    handleRemarkChange,
    handleSave,
    onRemarkChange,
    onSave,
    remark,
}) => {
    const style2 = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        maxWidth: '90%',
        width: 600,
        bgcolor: 'background.paper',
        border: 'none',
        boxShadow: 24,
        p: 1,
        outline: 'none',
    };
    const [tempRemark, setTempRemark] = useState(remark);

    // Update temporary remark when textarea value changes
    const handleChange = (e) => {
        setTempRemark(e.target.value);
        onRemarkChange(e); // Optional: call the prop function if needed
    };

    // Save the remark and close the modal
    const handleSave1 = () => {
        onSave(tempRemark);
        handleClose1();
        // handleClose2();
    };

    // Handle modal close and reset temporary remark
    const handleClose = () => {
        setTempRemark(remark); // Reset to the initial remark
        handleClose1();
        // handleClose2();
    };
    return (
        <>
            {/* <Modal
                className='elev_modal'
                open={showRemark1 || open1}
                onClose={handleClose1}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style2}>
                    <div className="elv_product-remark">
                        <span className='elv_product-title-span'>Add The Item Remark..</span>
                        <textarea
                            className="elv_product-remarkTextArea"
                            rows="6"
                            style={{ borderRadius: '10px', marginBlock: '0.5rem', border: '', outline: 'none' }}
                            value={remark}
                            onChange={handleChange}
                        ></textarea>
                    </div>
                    <div className="elv_projectRemarkBtn-group">
                        <button className="elv_remarksave-btn" onClick={handleSave1}>
                            Save
                        </button>
                        <button className="elv_remarkcancel-btn" onClick={handleClose}>
                            Cancel
                        </button>
                    </div>
                </Box>
            </Modal> */}
            <Modal
  open={showRemark1 || open1}
  onClose={handleClose}
  aria-labelledby="item-remark-title"
  sx={{
    backdropFilter: "blur(3px)",
    backgroundColor: "rgba(0,0,0,0.2)"
  }}
>
  <Box
    sx={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: { xs: "90%", sm: 450, md: 520 },
      bgcolor: "white",
      borderRadius: 3,
      boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
      p: { xs: 2, sm: 2 },
    }}
  >
    {/* TITLE */}
    <Box sx={{ mb: 1 }}>
      <Box
        sx={{
          fontSize: 18,
          fontWeight: 600,
          color: "#1A1A1A",
          textAlign: "left",
        }}
      >
        Add Item Remark
      </Box>
    </Box>

    {/* TEXTAREA */}
    <Box>
      <textarea
        rows={6}
        value={tempRemark}
        onChange={handleChange}
        style={{
          width: "100%",
          borderRadius: "10px",
          border: "1px solid #E3E3E3",
          resize: "none",
          padding: "12px 14px",
          fontSize: "15px",
          outline: "none",
          background: "#FAFAFA",
          fontFamily: "inherit",
        }}
      />
    </Box>

    {/* ACTION BUTTONS */}
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-end",
        gap: 2,
        mt: 2,
      }}
    >
      <Box
        onClick={handleClose}
        sx={{
          px: 3,
          py: 1,
          borderRadius: 2,
          border: "1px solid #D0D0D0",
          bgcolor: "white",
          cursor: "pointer",
          fontWeight: 500,
          fontSize: 14,
          color: "#444",
          "&:hover": {
            background: "#F5F5F5"
          }
        }}
      >
        Cancel
      </Box>
      <Box
        onClick={handleSave1}
        sx={{
          px: 3,
          py: 1,
            padding: '8px 22px',
                            borderRadius: '10px',
                            background: '#163164',
                            border: '1px solid #163164',
                            color: 'white',
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                            transition: '0.25s',
                            boxShadow: '0 2px 6px rgba(79,70,229,0.25)',
          "&:hover": {
            bgcolor: "#163164"
          }
        }}
      >
        Save
      </Box>
    </Box>
  </Box>
</Modal>

        </>
    )
}

export default ItemRemarkDialog
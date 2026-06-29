import { Box, Modal } from '@mui/material';
import React, { useEffect, useState } from 'react'

const RemarkDialog = ({
    open1,
    onClose1,
    remark1,
    onRemarkChange1,
    onSave1

}) => {
    const style2 = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '100%',
        maxWidth: 520,
        bgcolor: '#fff',
        borderRadius: '16px',
        boxShadow: '0 12px 32px rgba(0,0,0,0.12)',
        p: 3,
        outline: 'none',
    };

    const [tempRemark, setTempRemark] = useState(remark1);

    useEffect(() => {
        setTempRemark(remark1);
    }, [remark1])

    const handleChange = (e) => {
        setTempRemark(e.target.value);
        onRemarkChange1(e);
    };

    const handleSave = () => {
        onSave1(tempRemark);
        onClose1();
    };

    const handleClose = () => {
        setTempRemark(remark1);
        onClose1();
    };

    return (
        <Modal
            open={open1}
            onClose={handleClose}
            className="elev-modal"
            sx={{
                boxSizing: 'border-box'
            }}
        >
            <Box sx={style2}>

                {/* Header */}
                <div style={{
                    fontSize: '1.15rem',
                    fontWeight: 600,
                    marginBottom: '0.75rem',
                    color: '#1a1a1a',
                }}>
                    Add Order Remark
                </div>

                {/* Text Area */}
                <textarea
                    className="elv_product-remarkTextArea"
                    rows="6"
                    style={{
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: '12px',
                        border: '1px solid #e5e7eb',
                        background: '#fafafa',
                        fontSize: '0.95rem',
                        color: '#333',
                        resize: 'none',
                        transition: '0.2s border, 0.2s background',
                        boxSizing: 'border-box'
                    }}
                    value={tempRemark}
                    onChange={handleChange}
                    onFocus={(e) => {
                        e.target.style.background = '#fff';
                        e.target.style.border = '1px solid #C9D4FF';
                    }}
                    onBlur={(e) => {
                        e.target.style.background = '#fafafa';
                        e.target.style.border = '1px solid #e5e7eb';
                    }}
                />

                {/* Action Buttons */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '10px',
                    marginTop: '1.25rem',
                }}>
                    <button
                        onClick={handleClose}
                        style={{
                            padding: '8px 18px',
                            borderRadius: '10px',
                            background: '#f3f4f6',
                            border: '1px solid #e5e7eb',
                            color: '#444',
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                            transition: '0.25s',
                        }}
                        onMouseEnter={(e) => e.target.style.background = '#e8e9eb'}
                        onMouseLeave={(e) => e.target.style.background = '#f3f4f6'}
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSave}
                        style={{
                            padding: '8px 22px',
                            borderRadius: '10px',
                            background: '#163164',
                            border: '1px solid #163164',
                            color: 'white',
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                            transition: '0.25s',
                            boxShadow: '0 2px 6px rgba(79,70,229,0.25)',
                        }}
                        onMouseEnter={(e) => e.target.style.background = '#163164'}
                        onMouseLeave={(e) => e.target.style.background = '#163164'}
                    >
                        Save
                    </button>
                </div>
            </Box>
        </Modal>
    );
};

export default RemarkDialog;

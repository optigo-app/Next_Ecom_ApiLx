import React, { useEffect, useState } from 'react';
import './YourProfile.scss';
import { TextField, Modal, CircularProgress, Box, Button, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import { saveEditProfile } from '@/app/(core)/utils/API/AccountTabs/YourProfile';
import { getAddressData } from '@/app/(core)/utils/API/AccountTabs/manageAddress';
import { validateChangeYPAccount, validateUserDataYPAccount } from '@/app/(core)/utils/Glob_Functions/AccountPages/AccountPage';
import { getButtonStyle } from '@/app/(core)/constants/MobileAppTheme';

export default function YourProfile() {

    const [userData, setUserData] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [editedUserData, setEditedUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [errorMsg, setErrorMsg] = useState('');
    const [defaultAddress, setDefaultAddress] = useState(null);
    const [addressPresentFlag, setAddressPresentFlag] = useState(false);

    useEffect(() => {
        const storedUserData = sessionStorage.getItem('loginUserDetail');
        if (storedUserData) {
            const parsedUserData = JSON.parse(storedUserData);
            let obj = { ...parsedUserData };
            obj.mobileno = obj.mobileno.replace(/-/g, '');
            setUserData(obj);
        }
    }, []);

    const handleEdit = () => {
        setEditedUserData({ ...userData });
        setEditMode(true);
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setEditedUserData((prevData) => ({
            ...prevData,
            [id]: value,
        }));

        // Validate the field
        const errorsCopy = { ...errors };
        errorsCopy[id] = validateChangeYPAccount(id, value);

        setErrors(errorsCopy);

    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validate user data
        const { errors, isValid } = validateUserDataYPAccount(editedUserData);

        if (isValid) {
            // No errors, proceed with the submission
            try {
                setIsLoading(true);
                const storedData = sessionStorage.getItem('loginUserDetail');
                const data = JSON.parse(storedData);
                const storeInit = JSON.parse(sessionStorage.getItem('storeInit'));
                const { FrontEnd_RegNo } = storeInit;
                const response = await saveEditProfile(editedUserData, data, FrontEnd_RegNo);
                if (response?.Data?.rd[0]?.stat === 1) {
                    toast.success('Edit success');
                    setUserData(editedUserData);
                    sessionStorage.setItem('loginUserDetail', JSON.stringify(editedUserData));
                    setEditMode(false);
                } else if (response?.Data?.rd[0]?.stat === 0 && ((response?.Data?.rd[0]?.stat_msg)?.toLowerCase()) === "mobileno alredy exists") {
                    setErrors(prevErrors => ({
                        ...prevErrors,
                        mobileno: 'MobileNo Already Exists',
                    }));
                } else {
                    toast.error('Error in saving profile.');
                }
            } catch (error) {
                console.error('Error:', error);
                toast.error('An error occurred. Please try again.');
            } finally {
                setIsLoading(false);
            }
        } else {
            // Set errors to display validation messages
            setErrors(errors);
        }
    };

    const handleClose = () => {
        setEditMode(false);
    };

    const handleCancel = () => {
        setEditMode(false);
        setErrors({});
    }

    return (
        <Box sx={{
            padding: '10px'
        }} className='yourProfile_Account_SMR'>
            <div className='  smr_yourProfile'>

                {isLoading && (
                    <div className="loader-overlay" style={{
                        display: "flex",
                        justifyContent: "center",
                        height: "80vh",
                        width: "100%",
                        alignItems: "center",
                        zIndex: 100000
                    }}>
                        <CircularProgress className='loadingBarManage' />
                    </div>
                )}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
                    {<div className='userProfileMain' style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        {userData && (
                            <>
                                <div className='mobileEditProfileDiv'>
                                    <TextField
                                        autoFocus
                                        id="defaddress_shippingfirstname"
                                        label="First Name"
                                        variant="outlined"
                                        className='labgrowRegister'
                                        style={{ margin: '15px', color: 'black' }}
                                        value={userData?.firstname || ''}
                                        disabled
                                        onChange={handleInputChange}
                                    />
                                    <TextField
                                        id="defaddress_shippinglastname"
                                        label="Last Name"
                                        variant="outlined"
                                        className='labgrowRegister'
                                        style={{ margin: '15px' }}
                                        value={userData?.lastname || ''}
                                        disabled
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className='mobileEditProfileDiv'>
                                    <TextField
                                        id="userid"
                                        label="Email"
                                        variant="outlined"
                                        className='labgrowRegister'
                                        style={{ margin: '15px' }}
                                        value={userData?.userid || ''}
                                        disabled
                                        onChange={handleInputChange}
                                    />
                                    <TextField
                                        id="defaddress_shippingmobile"
                                        label="Mobile No."
                                        variant="outlined"
                                        className='labgrowRegister'
                                        style={{ margin: '15px' }}
                                        value={userData?.mobileno || ''}
                                        disabled
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className='mobileEditProfileDiv'>
                                    <TextField
                                        id="defaddress_street"
                                        label="Address"
                                        variant="outlined"
                                        className='labgrowRegister'
                                        style={{ margin: '15px' }}
                                        value={userData?.street || ''}
                                        disabled
                                        sx={{
                                            "& .MuiInputBase-input.Mui-disabled": {
                                                WebkitTextFillColor: 'black'
                                            }
                                        }}
                                        multiline
                                        rows={3}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </>
                        )}
                    </div>}
                    <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleEdit}
                            sx={getButtonStyle(true, {
                                width: '100%'
                            })}
                            fullWidth
                        >
                            Edit Profile
                        </Button>
                    </Box>
                </div>

                <Modal open={editMode} onClose={handleClose}>
                    <Box
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: { xs: "90%", sm: 450 },
                            maxHeight: "90vh",
                            overflowY: "auto",
                            bgcolor: "background.paper",
                            borderRadius: 2,
                            boxShadow: 24,
                            p: 3
                        }}
                        className="smr_editProfileModal"
                    >
                        <form onSubmit={(event) => handleSubmit(event)}>

                            <Typography
                                variant="h6"
                                sx={{ textAlign: "center", mb: 2 }}
                            >
                                Edit Profile
                            </Typography>

                            {editedUserData && (
                                <>
                                    <TextField
                                        fullWidth
                                        id="firstname"
                                        label="First Name"
                                        margin="normal"
                                        value={editedUserData.firstname || ""}
                                        onChange={handleInputChange}
                                        error={!!errors.firstname}
                                        helperText={errors.firstname}
                                    />

                                    <TextField
                                        fullWidth
                                        id="lastname"
                                        label="Last Name"
                                        margin="normal"
                                        value={editedUserData.lastname || ""}
                                        onChange={handleInputChange}
                                        error={!!errors.lastname}
                                        helperText={errors.lastname}
                                    />

                                    <TextField
                                        fullWidth
                                        id="userid"
                                        label="Email"
                                        margin="normal"
                                        value={editedUserData.userid || ""}
                                        disabled
                                    />

                                    <TextField
                                        fullWidth
                                        id="mobileno"
                                        label="Mobile No"
                                        margin="normal"
                                        value={editedUserData.mobileno || ""}
                                        onChange={handleInputChange}
                                        error={!!errors.mobileno}
                                        helperText={errors.mobileno}
                                    />

                                    <TextField
                                        fullWidth
                                        id="street"
                                        label="Address"
                                        margin="normal"
                                        multiline
                                        rows={3}
                                        value={editedUserData.street || ""}
                                        onChange={handleInputChange}
                                        error={!!errors.street}
                                        helperText={errors.street}
                                    />
                                </>
                            )}

                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    mt: 3
                                }}
                            >
                                <Button
                                    type="submit"
                                    variant="contained"
                                    fullWidth
                                    sx={getButtonStyle(true, {
                                        width: '100%',
                                        mr: 1,
                                        bgcolor: 'transparent',
                                        color: 'black',
                                        "&:hover": {
                                            backgroundColor: 'transparent',
                                            boxShadow: 'none',
                                        },
                                    })}
                                >
                                    Save
                                </Button>

                                <Button
                                    variant="outlined"
                                    fullWidth
                                    sx={getButtonStyle(true, {
                                        width: '100%',
                                        ml: 1
                                    })}
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </Button>
                            </Box>

                        </form>
                    </Box>
                </Modal>

            </div>
        </Box>
    );
}



















//    <Modal
//                     open={editMode}
//                     onClose={handleClose}
//                 >
//                     <div className='smilingEditProfilePopup_SMR' style={{ position: 'absolute', backgroundColor: 'white', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 450, boxShadow: 24, p: 4 }}>
//                         <form onSubmit={(event) => handleSubmit(event)} style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
//                             <h2 style={{ marginTop: '30px', textAlign: 'center' }}>Edit Profile</h2>
//                             {editedUserData && (
//                                 <>
//                                     <TextField
//                                         id="firstname"
//                                         label="First Name"
//                                         variant="outlined"
//                                         style={{ margin: '15px' }}
//                                         value={editedUserData.firstname !== "undefined" ? editedUserData.firstname : ""}
//                                         onChange={handleInputChange}
//                                         error={!!errors.firstname}
//                                         helperText={errors.firstname}
//                                     />
//                                     <TextField
//                                         id="lastname"
//                                         label="Last Name"
//                                         variant="outlined"
//                                         style={{ margin: '15px' }}
//                                         value={editedUserData.lastname !== "undefined" ? editedUserData.lastname : ""}
//                                         onChange={handleInputChange}
//                                         error={!!errors.lastname}
//                                         helperText={errors.lastname}
//                                     />
//                                     <TextField
//                                         id="userid"
//                                         label="Email"
//                                         variant="outlined"
//                                         style={{ margin: '15px' }}
//                                         value={editedUserData.userid !== "undefined" ? editedUserData.userid : ""}
//                                         onChange={handleInputChange}
//                                         error={!!errors.userid}
//                                         helperText={errors.userid}
//                                         disabled
//                                     />
//                                     <TextField
//                                         id="mobileno"
//                                         label="Mobile No."
//                                         variant="outlined"
//                                         style={{ margin: '15px' }}
//                                         value={editedUserData.mobileno !== "undefined" ? editedUserData.mobileno : ""}
//                                         onChange={handleInputChange}
//                                         error={!!errors.mobileno}
//                                         helperText={errors.mobileno}
//                                     />
//                                     <TextField
//                                         id="street"
//                                         label="Address"
//                                         variant="outlined"
//                                         style={{ margin: '15px' }}
//                                         value={editedUserData.street !== "undefined" ? editedUserData.street : ""}
//                                         onChange={handleInputChange}
//                                         error={!!errors.street}
//                                         helperText={errors.street}
//                                         sx={{
//                                             "& .MuiInputBase-input.Mui-disabled": {
//                                                 WebkitTextFillColor: 'black'
//                                             }
//                                         }}
//                                         multiline
//                                         rows={2}
//                                     />
//                                 </>
//                             )}
//                             <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px', marginBottom: '25px' }}>
//                                 {/* <button type='submit' className='smr_SmilingAddEditAddrwess' style={{ backgroundColor: 'lightgray', marginInline: '5px' }}>Save</button> */}
//                                 <button type='submit' className='smilingDeleveryformSaveBtn' >Save</button>
//                                 <button onClick={() => handleCancel()} className='smilingDeleveryformCansleBtn_SMR' >Cancel</button>
//                             </div>
//                         </form>
//                     </div>
//                 </Modal>
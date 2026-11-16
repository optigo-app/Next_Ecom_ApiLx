import React, { useState } from "react";
import { TextField, Grid, IconButton } from "@mui/material";
import "./Plm.scss";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const Plm = () => {

  const [formData, setFormData] = useState({
    labelName: "",
    logo: null,
    markUp: 0,
    logoPreview: null
  });

  const [showPreview, setShowPreview] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setFormData({
        ...formData,
        logo: file,
        logoPreview: fileUrl,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();


    const data = new FormData();
    data.append('labelName', formData?.labelName);
    data.append('file', formData?.logo);
    data.append('fileUrl', formData?.logoPreview);
    data.append('markUp', formData?.markUp);




  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  return (
    <>
      <div className="plm_Account_SMR plm_container">
        <div className="plm_width">
          <div className="plm_title" style={{ cursor: 'pointer', textAlign: 'center', width: '100%' }}>
            Private Label Setup
          </div>
          <div className="fieldContainer">
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid xs={12} className=" margin_plm">
                  <TextField
                    id="labelName"
                    name="labelName"
                    label="Label Name"
                    variant="outlined"
                    value={formData.labelName}
                    onChange={handleChange}
                    // style={{ minWidth: "400px", maxWidth: "400px" }}
                    className="FieldWidthPLM"
                    required
                  />
                </Grid>
                <Grid xs={12} className="margin_plm">
                  <Grid container spacing={2} alignItems="center" style={{ display: 'flex' }}>
                    <Grid xs={10} style={{ width: '70%' }}>
                      <TextField
                        type="file"
                        id="logo"
                        name="logo"
                        label="Upload Logo"
                        onChange={handleFileChange}
                        required
                        fullWidth
                        InputLabelProps={{
                          shrink: true,
                        }}
                        variant="outlined"
                        InputProps={{
                          endAdornment: (
                            <IconButton onClick={togglePreview}>
                              {showPreview ? <VisibilityOff titleAccess="Hide" /> : <Visibility titleAccess="Show" />}
                            </IconButton>
                          ),
                        }}
                      />
                    </Grid>
                    {formData.logoPreview && (
                      <Grid xs={2} style={{ width: '20%' }}>
                        {showPreview ? (
                          <img
                            src={formData.logoPreview}
                            alt="Logo Preview"
                            className="smr_plmPreviewImgage"
                          />
                        ) : <span style={{ minWidth: '100%' }}></span>}
                      </Grid>
                    )}
                  </Grid>
                </Grid>
                {/* <Grid xs={12}  className=" margin_plm">
              <TextField
                type="file"
                id="logo"
                name="logo"
                label="Upload Logo"
                onChange={handleFileChange}
                required
                className="FieldWidthPLM"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={togglePreview}>
                      {showPreview ? <VisibilityOff titleAccess="Hide" /> : <Visibility titleAccess="Show" />}
                    </IconButton>
                  ),
                }}
              />

            </Grid>
             {(formData.logoPreview) && (
            <Grid xs={12} className="margin_plm d-flex justify-content-center align-items-center ">
              {showPreview && <img src={formData.logoPreview} alt="Logo Preview" style={{ maxWidth: '100%' }} />}
            </Grid>
            )} */}
                <Grid xs={12} className=" margin_plm">
                  <TextField
                    type="number"
                    id="markUp"
                    name="markUp"
                    label="Mark Up (%)"
                    variant="outlined"
                    value={formData.markUp}
                    onChange={handleChange}
                    required
                    // style={{ minWidth: "400px", maxWidth: "400px" }}
                    className="FieldWidthPLM"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      min: 0,
                      max: 100,
                    }}
                  />
                </Grid>
                <Grid xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <button className='SmilingAddEditAddrwess' style={{ backgroundColor: 'lightgray', marginTop: '15px' }}>Save</button>
                </Grid>
              </Grid>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Plm;

// import React, { useState } from 'react';
// import './Plm.scss';

// const Plm = () => {
//   const [formData, setFormData] = useState({
//     labelName: '',
//     logo: null,
//     markUp: 0,
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handleFileChange = (e) => {
//     setFormData({
//       ...formData,
//       logo: e.target.files[0],
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log(formData);
//     // You can handle form submission here, e.g., send data to the server
//   };

//   return (
//     <div className="plm-container">
//       <h2>Private Label Setup</h2>
//       <form onSubmit={handleSubmit}>
//         <div className="form-group">
//           <label htmlFor="labelName">Label Name</label>
//           <input
//             type="text"
//             id="labelName"
//             name="labelName"
//             value={formData.labelName}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div className="form-group">
//           <label htmlFor="logo">Upload Logo</label>
//           <input
//             type="file"
//             id="logo"
//             name="logo"
//             accept="image/*"
//             onChange={handleFileChange}
//             required
//           />
//         </div>
//         <div className="form-group">
//           <label htmlFor="markUp">Mark Up (%)</label>
//           <input
//             type="number"
//             id="markUp"
//             name="markUp"
//             value={formData.markUp}
//             onChange={handleChange}
//             required
//             min="0"
//             max="100"
//           />
//         </div>
//         <button type="submit" className="btn-submit">Submit</button>
//       </form>
//     </div>
//   );
// };

// export default Plm;

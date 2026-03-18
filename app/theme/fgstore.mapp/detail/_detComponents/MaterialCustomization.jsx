import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid'; // Standard MUI Grid
import React from 'react';
import CustomSelect from './Select';

const MaterialCustomization = ({
  storeInit,
  metalTypeCombo,
  metalColorCombo,
  diaQcCombo,
  diaList,
  csQcCombo,
  csList,
  SizeCombo,
  singleProd,
  selectMtType,
  selectMtColor,
  selectDiaQc,
  selectCsQc,
  sizeData,
  handleCustomChange,
  handleMetalWiseColorImg,
  SizeSorting,
}) => {




  const containerStyle = {
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
    padding: '6px 12px',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#fff',
    transition: 'border-color 0.2s ease',
    '&:hover': {
      borderColor: '#bdbdbd'
    }
  };

  const labelStyle = {
    fontSize: '0.65rem',
    color: '#9e9e9e',
    textTransform: 'uppercase',
    marginBottom: '2px',
    fontFamily: 'inherit',
    letterSpacing: '0.5px',
    textAlign:'left'
  };

  const selectStyle = {
    border: 'none',
    outline: 'none',
    width: '100%',
    fontSize: '0.95rem',
    color: '#333',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    padding: '0',
    fontFamily: 'inherit'
  };

  const textSpanStyle = {
    fontSize: '0.95rem',
    color: '#333',
    padding: '0',
    fontFamily: 'inherit',
  };

  return (
    <>
      <Box sx={{ width:'100%',  mt: 4 }}>
        {storeInit?.IsProductWebCustomization == 1 &&
          metalTypeCombo?.length > 0 &&
          storeInit?.IsMetalCustomization === 1 && (
            <Grid container spacing={1}>
              
              {/* --- METAL TYPE --- */}
              <Grid item size={{xs:6 ,  sm : 6}}
              
              >
                <Box sx={containerStyle}>
                  <label style={labelStyle}>
                    METAL TYPE:
                  </label>
                  {singleProd?.IsMrpBase == 1 ? (
                    <span style={textSpanStyle}>
                      {metalTypeCombo?.filter((ele) => ele?.Metalid == singleProd?.MetalPurityid)[0]?.metaltype}
                    </span>
                  ) : (
                    <>

                    {/* <select
                      style={selectStyle}
                      value={selectMtType}
                      onChange={(e) => handleCustomChange(e, "mt")}
                    >
                      {metalTypeCombo.map((ele) => (
                        <option key={ele?.Metalid} value={ele?.metaltype}>
                          {ele?.metaltype}
                        </option>
                      ))}
                    </select> */}
                    <CustomSelect
  label="Select Metal Type"
  options={metalTypeCombo}
  value={selectMtType}
  onChange={(e) => handleCustomChange(e, "mt")}
  getOptionLabel={(opt) => opt?.metaltype}
  getOptionValue={(opt) => opt?.metaltype}
/>

                    </>
                  )}
                </Box>
              </Grid>

              {/* --- METAL COLOR --- */}
              {metalColorCombo?.length > 0 && storeInit?.IsMetalTypeWithColor === 1 && (
                <Grid item size={{xs:6 ,  sm : 6}}>
                  <Box sx={containerStyle}>
                    <label style={labelStyle} htmlFor="metal_c_select">
                      METAL COLOR:
                    </label>
                    {singleProd?.IsMrpBase == 1 ? (
                      <span style={textSpanStyle}>
                        {metalColorCombo?.filter((ele) => ele?.id == singleProd?.MetalColorid)[0]?.metalcolorname}
                      </span>
                    ) : (
                      <>
<CustomSelect
  label="Select Metal Color"
  options={metalColorCombo}
  value={selectMtColor}
  onChange={handleMetalWiseColorImg}
  getOptionLabel={(opt) => opt?.metalcolorname || opt?.colorname}
  getOptionValue={(opt) => opt?.metalcolorname || opt?.colorname}
/>

                      {/* <select
                        id="metal_c_select"
                        style={selectStyle}
                        value={selectMtColor}
                        onChange={(e) => handleMetalWiseColorImg(e)}
                      >
                        {metalColorCombo?.map((ele) => (
                          <option key={ele?.id} value={ele?.metalcolorname}>
                            {ele?.metalcolorname}
                          </option>
                        ))}
                      </select> */}
                      </>
                    )}
                  </Box>
                </Grid>
              )}

              {/* --- DIAMOND --- */}
              {storeInit?.IsDiamondCustomization === 1 && diaQcCombo?.length > 0 && diaList?.length > 0 && (
                <Grid item size={{xs:6 ,  sm : 6}}>
                  <Box sx={containerStyle}>
                    <label style={labelStyle}>
                      DIAMOND:
                    </label>
                    {/* <select
                      style={selectStyle}
                      value={selectDiaQc}
                      onChange={(e) => handleCustomChange(e, "dia")}
                    >
                      {diaQcCombo.map((ele) => (
                        <option key={ele?.QualityId} value={`${ele?.Quality},${ele?.color}`}>
                          {`${ele?.Quality},${ele?.color}`}
                        </option>
                      ))}
                    </select> */}
                    <CustomSelect
  label="Select Diamond"
  options={diaQcCombo}
  value={selectDiaQc}
  onChange={(e) => handleCustomChange(e, "dia")}
  getOptionLabel={(opt) => `${opt?.Quality}, ${opt?.color}`}
  getOptionValue={(opt) => `${opt?.Quality},${opt?.color}`}
/>

                  </Box>
                </Grid>
              )}

              {/* --- COLOR STONE --- */}
              {storeInit?.IsCsCustomization === 1 && selectCsQc?.length > 0 && csList?.filter((ele) => ele?.D !== "MISC")?.length > 0 && (
                <Grid item size={{xs:6 ,  sm : 6}}>
                  <Box sx={containerStyle}>
                    <label style={labelStyle}>
                      COLOR STONE:
                    </label>
                    {/* <select
                      style={selectStyle}
                      value={selectCsQc}
                      onChange={(e) => handleCustomChange(e, "cs")}
                    >
                      {csQcCombo.map((ele) => (
                        <option key={ele?.QualityId} value={`${ele?.Quality},${ele?.color}`}>
                          {`${ele?.Quality},${ele?.color}`}
                        </option>
                      ))}
                    </select> */}
                                       <CustomSelect
  label="Select COLOR STONE"
  options={csQcCombo}
  value={selectCsQc}
  onChange={(e) => handleCustomChange(e, "cs")}
  getOptionLabel={(opt) => `${opt?.Quality}, ${opt?.color}`}
  getOptionValue={(opt) => `${opt?.Quality},${opt?.color}`}
/>  
                  </Box>
                </Grid>
              )}

              {/* --- SIZE --- */}
              {SizeSorting(SizeCombo?.rd)?.length > 0 && singleProd?.DefaultSize !== "" && (
                <Grid item size={{xs:6 ,  sm : 6}}>
                  <Box sx={containerStyle}>
                    <label style={labelStyle}>
                      SIZE:
                    </label>
                    {singleProd?.IsMrpBase == 1 ? (
                      <span style={textSpanStyle}>
                        {singleProd?.DefaultSize}
                      </span>
                    ) : (
                      <>
<CustomSelect
  label="Select Size"
  options={SizeSorting(SizeCombo?.rd)}
  value={sizeData}
  onChange={(e) => handleCustomChange(e, "sz")}
  getOptionLabel={(opt) => opt?.sizename}
  getOptionValue={(opt) => opt?.sizename}
/>

                      {/* <select
                        style={selectStyle}
                        value={sizeData}
                        onChange={(e) => handleCustomChange(e, "sz")}
                      >
                        {SizeSorting(SizeCombo?.rd)?.map((ele) => (
                          <option value={ele?.sizename} key={ele?.id}>
                            {ele?.sizename}
                          </option>
                        ))}
                      </select> */}
                      </>
                    )}
                  </Box>
                </Grid>
              )}

            </Grid>
          )}
      </Box>
    </>
  );
};

export default MaterialCustomization;






















// import { Box, Typography } from '@mui/material';
// import Grid from '@mui/material/Grid'; // Standard MUI Grid
// import React from 'react';

// const MaterialCustomization = ({
//   storeInit,
//   metalTypeCombo,
//   metalColorCombo,
//   diaQcCombo,
//   diaList,
//   csQcCombo,
//   csList,
//   SizeCombo,
//   singleProd,
//   selectMtType,
//   selectMtColor,
//   selectDiaQc,
//   selectCsQc,
//   sizeData,
//   handleCustomChange,
//   handleMetalWiseColorImg,
//   SizeSorting,
// }) => {




//   const containerStyle = {
//     border: '1px solid #e0e0e0',
//     borderRadius: '4px',
//     padding: '6px 12px',
//     display: 'flex',
//     flexDirection: 'column',
//     backgroundColor: '#fff',
//     transition: 'border-color 0.2s ease',
//     '&:hover': {
//       borderColor: '#bdbdbd'
//     }
//   };

//   const labelStyle = {
//     fontSize: '0.65rem',
//     color: '#9e9e9e',
//     textTransform: 'uppercase',
//     marginBottom: '2px',
//     fontFamily: 'inherit',
//     letterSpacing: '0.5px',
//     textAlign:'left'
//   };

//   const selectStyle = {
//     border: 'none',
//     outline: 'none',
//     width: '100%',
//     fontSize: '0.95rem',
//     color: '#333',
//     backgroundColor: 'transparent',
//     cursor: 'pointer',
//     padding: '0',
//     fontFamily: 'inherit'
//   };

//   const textSpanStyle = {
//     fontSize: '0.95rem',
//     color: '#333',
//     padding: '0',
//     fontFamily: 'inherit',
//   };

//   return (
//     <>
//       <Box sx={{ width:'100%',  mt: 4 }}>
//         {storeInit?.IsProductWebCustomization == 1 &&
//           metalTypeCombo?.length > 0 &&
//           storeInit?.IsMetalCustomization === 1 && (
//             <Grid container spacing={1}>
              
//               {/* --- METAL TYPE --- */}
//               <Grid item size={{xs:6 ,  sm : 6}}
              
//               >
//                 <Box sx={containerStyle}>
//                   <label style={labelStyle}>
//                     METAL TYPE:
//                   </label>
//                   {singleProd?.IsMrpBase == 1 ? (
//                     <span style={textSpanStyle}>
//                       {metalTypeCombo?.filter((ele) => ele?.Metalid == singleProd?.MetalPurityid)[0]?.metaltype}
//                     </span>
//                   ) : (
//                     <select
//                       style={selectStyle}
//                       value={selectMtType}
//                       onChange={(e) => handleCustomChange(e, "mt")}
//                     >
//                       {metalTypeCombo.map((ele) => (
//                         <option key={ele?.Metalid} value={ele?.metaltype}>
//                           {ele?.metaltype}
//                         </option>
//                       ))}
//                     </select>
//                   )}
//                 </Box>
//               </Grid>

//               {/* --- METAL COLOR --- */}
//               {metalColorCombo?.length > 0 && storeInit?.IsMetalTypeWithColor === 1 && (
//                 <Grid item size={{xs:6 ,  sm : 6}}>
//                   <Box sx={containerStyle}>
//                     <label style={labelStyle} htmlFor="metal_c_select">
//                       METAL COLOR:
//                     </label>
//                     {singleProd?.IsMrpBase == 1 ? (
//                       <span style={textSpanStyle}>
//                         {metalColorCombo?.filter((ele) => ele?.id == singleProd?.MetalColorid)[0]?.metalcolorname}
//                       </span>
//                     ) : (
//                       <select
//                         id="metal_c_select"
//                         style={selectStyle}
//                         value={selectMtColor}
//                         onChange={(e) => handleMetalWiseColorImg(e)}
//                       >
//                         {metalColorCombo?.map((ele) => (
//                           <option key={ele?.id} value={ele?.metalcolorname}>
//                             {ele?.metalcolorname}
//                           </option>
//                         ))}
//                       </select>
//                     )}
//                   </Box>
//                 </Grid>
//               )}

//               {/* --- DIAMOND --- */}
//               {storeInit?.IsDiamondCustomization === 1 && diaQcCombo?.length > 0 && diaList?.length > 0 && (
//                 <Grid item size={{xs:6 ,  sm : 6}}>
//                   <Box sx={containerStyle}>
//                     <label style={labelStyle}>
//                       DIAMOND:
//                     </label>
//                     <select
//                       style={selectStyle}
//                       value={selectDiaQc}
//                       onChange={(e) => handleCustomChange(e, "dia")}
//                     >
//                       {diaQcCombo.map((ele) => (
//                         <option key={ele?.QualityId} value={`${ele?.Quality},${ele?.color}`}>
//                           {`${ele?.Quality},${ele?.color}`}
//                         </option>
//                       ))}
//                     </select>
//                   </Box>
//                 </Grid>
//               )}

//               {/* --- COLOR STONE --- */}
//               {storeInit?.IsCsCustomization === 1 && selectCsQc?.length > 0 && csList?.filter((ele) => ele?.D !== "MISC")?.length > 0 && (
//                 <Grid item size={{xs:6 ,  sm : 6}}>
//                   <Box sx={containerStyle}>
//                     <label style={labelStyle}>
//                       COLOR STONE:
//                     </label>
//                     <select
//                       style={selectStyle}
//                       value={selectCsQc}
//                       onChange={(e) => handleCustomChange(e, "cs")}
//                     >
//                       {csQcCombo.map((ele) => (
//                         <option key={ele?.QualityId} value={`${ele?.Quality},${ele?.color}`}>
//                           {`${ele?.Quality},${ele?.color}`}
//                         </option>
//                       ))}
//                     </select>
//                   </Box>
//                 </Grid>
//               )}

//               {/* --- SIZE --- */}
//               {SizeSorting(SizeCombo?.rd)?.length > 0 && singleProd?.DefaultSize !== "" && (
//                 <Grid item size={{xs:6 ,  sm : 6}}>
//                   <Box sx={containerStyle}>
//                     <label style={labelStyle}>
//                       SIZE:
//                     </label>
//                     {singleProd?.IsMrpBase == 1 ? (
//                       <span style={textSpanStyle}>
//                         {singleProd?.DefaultSize}
//                       </span>
//                     ) : (
//                       <select
//                         style={selectStyle}
//                         value={sizeData}
//                         onChange={(e) => handleCustomChange(e, "sz")}
//                       >
//                         {SizeSorting(SizeCombo?.rd)?.map((ele) => (
//                           <option value={ele?.sizename} key={ele?.id}>
//                             {ele?.sizename}
//                           </option>
//                         ))}
//                       </select>
//                     )}
//                   </Box>
//                 </Grid>
//               )}

//             </Grid>
//           )}
//       </Box>
//     </>
//   );
// };

// export default MaterialCustomization;


// import { Box } from '@mui/material';
// import Grid from '@mui/material/Grid'; // Standard MUI Grid
// import React from 'react';

// const MaterialCustomization = ({
//     storeInit,
//     metalTypeCombo,
//     metalColorCombo,
//     diaQcCombo,
//     diaList,
//     csQcCombo,
//     csList,
//     SizeCombo,
//     singleProd,
//     selectMtType,
//     selectMtColor,
//     selectDiaQc,
//     selectCsQc,
//     sizeData,
//     handleCustomChange,
//     handleMetalWiseColorImg,
//     SizeSorting,
// }) => {
//     return (
//         <>
//             <Box sx={{ width: "100%", px: 2, mt: 3 ,mb:2 }}>
//                 {storeInit?.IsProductWebCustomization == 1 &&
//                     metalTypeCombo?.length > 0 &&
//                     storeInit?.IsMetalCustomization === 1 && (
//                         <Grid container spacing={1} className="fgstore_mapp_single_prod_customize_main">

//                             {/* --- METAL TYPE --- */}
//                             <Grid item size={{ xs: 6, sm: 6 }} sx={{ display: 'flex', flexDirection: 'column' }}>
//                                 <div className="fgstore_mapp_single_prod_customize" style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
//                                     <label className="fgstore_mappmenuItemTimeEleveDeatil" style={{ marginBottom: '4px' }}>
//                                         METAL TYPE:
//                                     </label>
//                                     {singleProd?.IsMrpBase == 1 ? (
//                                         <span
//                                             className="fgstore_mapp_menuitemSelectoreMain"
//                                             style={{
//                                                 display: "flex",
//                                                 flexDirection: "column",
//                                                 marginLeft: "4px",
//                                             }}
//                                         >
//                                             {metalTypeCombo?.filter((ele) => ele?.Metalid == singleProd?.MetalPurityid)[0]?.metaltype}
//                                         </span>
//                                     ) : (
//                                         <select
//                                             className="fgstore_mapp_menuitemSelectoreMain"
//                                             value={selectMtType}
//                                             onChange={(e) => handleCustomChange(e, "mt")}
//                                             style={{ fontSize: "1rem", width: "100%", padding: "8px" }}
//                                         >
//                                             {metalTypeCombo.map((ele) => (
//                                                 <option key={ele?.Metalid} value={ele?.metaltype}>
//                                                     {ele?.metaltype}
//                                                 </option>
//                                             ))}
//                                         </select>
//                                     )}
//                                 </div>
//                             </Grid>

//                             {/* --- METAL COLOR --- */}
//                             {metalColorCombo?.length > 0 && storeInit?.IsMetalTypeWithColor === 1 && (
//                                 <Grid item size={{ xs: 6, sm: 6 }} sx={{ display: 'flex', flexDirection: 'column' }}>
//                                     <div className="fgstore_mapp_single_prod_customize" style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
//                                         <label
//                                             className="fgstore_mappmenuItemTimeEleveDeatil"
//                                             htmlFor="metal_c_fgstore_mapp"
//                                             style={{ marginBottom: '4px' }}
//                                         >
//                                             METAL COLOR:
//                                         </label>
//                                         {singleProd?.IsMrpBase == 1 ? (
//                                             <span
//                                                 className="fgstore_mapp_menuitemSelectoreMain"
//                                                 style={{
//                                                     display: "flex",
//                                                     flexDirection: "column",
//                                                     marginLeft: "4px",
//                                                 }}
//                                             >
//                                                 {metalColorCombo?.filter((ele) => ele?.id == singleProd?.MetalColorid)[0]?.metalcolorname}
//                                             </span>
//                                         ) : (
//                                             <select
//                                                 className="fgstore_mapp_menuitemSelectoreMain"
//                                                 id="metal_c_fgstore_mapp"
//                                                 value={selectMtColor}
//                                                 onChange={(e) => handleMetalWiseColorImg(e)}
//                                                 style={{ fontSize: "1rem", width: "100%", padding: "8px" }}
//                                             >
//                                                 {metalColorCombo?.map((ele) => (
//                                                     <option key={ele?.id} value={ele?.metalcolorname}>
//                                                         {ele?.metalcolorname}
//                                                     </option>
//                                                 ))}
//                                             </select>
//                                         )}
//                                     </div>
//                                 </Grid>
//                             )}

//                             {/* --- DIAMOND --- */}
//                             {storeInit?.IsDiamondCustomization === 1 && diaQcCombo?.length > 0 && diaList?.length > 0 && (
//                                 <Grid item size={{ xs: 6, sm: 6 }} sx={{ display: 'flex', flexDirection: 'column' }}>
//                                     <div className="fgstore_mapp_single_prod_customize" style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
//                                         <label className="fgstore_mappmenuItemTimeEleveDeatil" style={{ marginBottom: '4px' }}>
//                                             DIAMOND:
//                                         </label>
//                                         <select
//                                             className="fgstore_mapp_menuitemSelectoreMain"
//                                             value={selectDiaQc}
//                                             onChange={(e) => handleCustomChange(e, "dia")}
//                                             style={{ fontSize: "1rem", width: "100%", padding: "8px" }}
//                                         >
//                                             {diaQcCombo.map((ele) => (
//                                                 <option key={ele?.QualityId} value={`${ele?.Quality},${ele?.color}`}>
//                                                     {`${ele?.Quality},${ele?.color}`}
//                                                 </option>
//                                             ))}
//                                         </select>
//                                     </div>
//                                 </Grid>
//                             )}

//                             {/* --- COLOR STONE --- */}
//                             {storeInit?.IsCsCustomization === 1 && selectCsQc?.length > 0 && csList?.filter((ele) => ele?.D !== "MISC")?.length > 0 && (
//                                 <Grid item size={{ xs: 6, sm: 6 }} sx={{ display: 'flex', flexDirection: 'column' }}>
//                                     <div className="fgstore_mapp_single_prod_customize" style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
//                                         <label className="fgstore_mappmenuItemTimeEleveDeatil" style={{ marginBottom: '4px' }}>
//                                             COLOR STONE:
//                                         </label>
//                                         <select
//                                             className="fgstore_mapp_menuitemSelectoreMain"
//                                             value={selectCsQc}
//                                             onChange={(e) => handleCustomChange(e, "cs")}
//                                             style={{ fontSize: "1rem", width: "100%", padding: "8px" }}
//                                         >
//                                             {csQcCombo.map((ele) => (
//                                                 <option key={ele?.QualityId} value={`${ele?.Quality},${ele?.color}`}>
//                                                     {`${ele?.Quality},${ele?.color}`}
//                                                 </option>
//                                             ))}
//                                         </select>
//                                     </div>
//                                 </Grid>
//                             )}

//                             {/* --- SIZE --- */}
//                             {SizeSorting(SizeCombo?.rd)?.length > 0 && singleProd?.DefaultSize !== "" && (
//                                 <Grid item size={{ xs: 6, sm: 6 }} sx={{ display: 'flex', flexDirection: 'column' }}>
//                                     <div className="fgstore_mapp_single_prod_customize" style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
//                                         <label className="fgstore_mappmenuItemTimeEleveDeatil" style={{ marginBottom: '4px' }}>
//                                             SIZE:
//                                         </label>
//                                         {singleProd?.IsMrpBase == 1 ? (
//                                             <span
//                                                 className="fgstore_mapp_menuitemSelectoreMain"
//                                                 style={{
//                                                     display: "flex",
//                                                     flexDirection: "column",
//                                                     marginLeft: "4px",
//                                                 }}
//                                             >
//                                                 {singleProd?.DefaultSize}
//                                             </span>
//                                         ) : (
//                                             <select
//                                                 className="fgstore_mapp_menuitemSelectoreMain"
//                                                 value={sizeData}
//                                                 onChange={(e) => handleCustomChange(e, "sz")}
//                                                 style={{ fontSize: "1rem", width: "100%", padding: "8px" }}
//                                             >
//                                                 {SizeSorting(SizeCombo?.rd)?.map((ele) => (
//                                                     <option value={ele?.sizename} key={ele?.id}>
//                                                         {ele?.sizename}
//                                                     </option>
//                                                 ))}
//                                             </select>
//                                         )}
//                                     </div>
//                                 </Grid>
//                             )}

//                         </Grid>
//                     )}
//             </Box>
//         </>
//     );
// };

// export default MaterialCustomization;

// // import { Box } from '@mui/material'
// // import React from 'react'

// // const MaterialCustomization = ({
// //      storeInit,
// //   metalTypeCombo,
// //   metalColorCombo,
// //   diaQcCombo,
// //   diaList,
// //   csQcCombo,
// //   csList,
// //   SizeCombo,
// //   singleProd,
// //   selectMtType,
// //   selectMtColor,
// //   selectDiaQc,
// //   selectCsQc,
// //   sizeData,
// //   handleCustomChange,
// //   handleMetalWiseColorImg,
// //   SizeSorting,
// // }) => {
// //     return (
// //         <>
// //             <Box sx={{ width: "100%", px: 2, mt: 4 }}>
// //    {storeInit?.IsProductWebCustomization == 1 && metalTypeCombo?.length > 0 && storeInit?.IsMetalCustomization === 1 && (
// //                                 <div className="fgstore_mapp_single_prod_customize_main">
// //                                     <div className="first_row_fgstore_mapp_new">
// //                                         {
// //                                             <div className="fgstore_mapp_single_prod_customize">
// //                                                 <label className="fgstore_mappmenuItemTimeEleveDeatil">METAL TYPE:</label>
// //                                                 {singleProd?.IsMrpBase == 1 ? (
// //                                                     <span
// //                                                         className="fgstore_mapp_menuitemSelectoreMain"
// //                                                         style={{
// //                                                             display: "flex",
// //                                                             flexDirection: "column",
// //                                                             marginLeft: "4px",
// //                                                         }}
// //                                                     >
// //                                                         {metalTypeCombo?.filter((ele) => ele?.Metalid == singleProd?.MetalPurityid)[0]?.metaltype}
// //                                                     </span>
// //                                                 ) : (
// //                                                     <select
// //                                                         className="fgstore_mapp_menuitemSelectoreMain"
// //                                                         value={selectMtType}
// //                                                         onChange={(e) => handleCustomChange(e, "mt")}
// //                                                         // onChange={(e) => setSelectMtType(e.target.value)}
// //                                                         style={{ fontSize: "1rem" }}
// //                                                     >
// //                                                         {metalTypeCombo.map((ele) => (
// //                                                             <option key={ele?.Metalid} value={ele?.metaltype}>
// //                                                                 {ele?.metaltype}
// //                                                             </option>
// //                                                         ))}
// //                                                     </select>
// //                                                 )}
// //                                             </div>
// //                                         }
// //                                         {metalColorCombo?.length > 0 && storeInit?.IsMetalTypeWithColor === 1 && (
// //                                             <div className="fgstore_mapp_single_prod_customize">
// //                                                 <label className="fgstore_mappmenuItemTimeEleveDeatil" htmlFor="metal_c_fgstore_mapp">
// //                                                     METAL COLOR:
// //                                                 </label>
// //                                                 {singleProd?.IsMrpBase == 1 ? (
// //                                                     <span
// //                                                         className="fgstore_mapp_menuitemSelectoreMain"
// //                                                         style={{
// //                                                             display: "flex",
// //                                                             flexDirection: "column",
// //                                                             marginLeft: "4px",
// //                                                         }}
// //                                                     >
// //                                                         {metalColorCombo?.filter((ele) => ele?.id == singleProd?.MetalColorid)[0]?.metalcolorname}
// //                                                     </span>
// //                                                 ) : (
// //                                                     <select className="fgstore_mapp_menuitemSelectoreMain" id="metal_c_fgstore_mapp" value={selectMtColor} onChange={(e) => handleMetalWiseColorImg(e)} style={{ fontSize: "1rem" }}>
// //                                                         {metalColorCombo?.map((ele) => (
// //                                                             <option key={ele?.id} value={ele?.metalcolorname}>
// //                                                                 {ele?.metalcolorname}
// //                                                             </option>
// //                                                         ))}
// //                                                     </select>
// //                                                 )}
// //                                             </div>
// //                                         )}
// //                                     </div>
// //                                     <div className="first_row_fgstore_mapp_new">
// //                                         {storeInit?.IsDiamondCustomization === 1 && diaQcCombo?.length > 0 && diaList?.length ? (
// //                                             <div className="fgstore_mapp_single_prod_customize">
// //                                                 <label className="fgstore_mappmenuItemTimeEleveDeatil">DIAMOND :</label>
// //                                                 {
// //                                                     <select
// //                                                         className="fgstore_mapp_menuitemSelectoreMain"
// //                                                         value={selectDiaQc}
// //                                                         // onChange={(e) => setSelectDiaQc(e.target.value)}
// //                                                         onChange={(e) => handleCustomChange(e, "dia")}
// //                                                         style={{ fontSize: "1rem" }}
// //                                                     >
// //                                                         {diaQcCombo.map((ele) => (
// //                                                             <option key={ele?.QualityId} value={`${ele?.Quality},${ele?.color}`}>{`${ele?.Quality},${ele?.color}`}</option>
// //                                                         ))}
// //                                                     </select>
// //                                                 }
// //                                             </div>
// //                                         ) : null}
// //                                         {storeInit?.IsCsCustomization === 1 && selectCsQc?.length > 0 && csList?.filter((ele) => ele?.D !== "MISC")?.length > 0 ? (
// //                                             <div className="fgstore_mapp_single_prod_customize">
// //                                                 <label className="fgstore_mappmenuItemTimeEleveDeatil">COLOR STONE :</label>
// //                                                 <select
// //                                                     className="fgstore_mapp_menuitemSelectoreMain"
// //                                                     value={selectCsQc}
// //                                                     // onChange={(e) => setSelectCsQc(e.target.value)}
// //                                                     onChange={(e) => handleCustomChange(e, "cs")}
// //                                                     style={{ fontSize: "1rem" }}
// //                                                 >
// //                                                     {csQcCombo.map((ele) => (
// //                                                         <option key={ele?.QualityId} value={`${ele?.Quality},${ele?.color}`}>{`${ele?.Quality},${ele?.color}`}</option>
// //                                                     ))}
// //                                                 </select>
// //                                             </div>
// //                                         ) : (
// //                                             SizeSorting(SizeCombo?.rd)?.length > 0 &&
// //                                             singleProd?.DefaultSize !== "" && (
// //                                                 <div
// //                                                     className="fgstore_mapp_single_prod_customize"
// //                                                     style={{
// //                                                         width: "50%",
// //                                                     }}
// //                                                 >
// //                                                     <label className="fgstore_mappmenuItemTimeEleveDeatil">SIZE:</label>
// //                                                     {singleProd?.IsMrpBase == 1 ? (
// //                                                         <span
// //                                                             className="fgstore_mapp_menuitemSelectoreMain"
// //                                                             style={{
// //                                                                 display: "flex",
// //                                                                 flexDirection: "column",
// //                                                                 marginLeft: "4px",
// //                                                             }}
// //                                                         >
// //                                                             {singleProd?.DefaultSize}
// //                                                         </span>
// //                                                     ) : (
// //                                                         <select
// //                                                             className="fgstore_mapp_menuitemSelectoreMain"
// //                                                             value={sizeData}
// //                                                             // onChange={(e) => {
// //                                                             //   setSizeData(e.target.value);
// //                                                             // }}
// //                                                             onChange={(e) => handleCustomChange(e, "sz")}
// //                                                             style={{ fontSize: "1rem" }}
// //                                                         >
// //                                                             {SizeSorting(SizeCombo?.rd)?.map((ele) => (
// //                                                                 <option
// //                                                                     value={ele?.sizename}
// //                                                                     // selected={
// //                                                                     //   singleProd && singleProd.DefaultSize === ele.sizename
// //                                                                     // }
// //                                                                     key={ele?.id}
// //                                                                 >
// //                                                                     {ele?.sizename}
// //                                                                 </option>
// //                                                             ))}
// //                                                         </select>
// //                                                     )}
// //                                                 </div>
// //                                             )
// //                                         )}
// //                                     </div>
// //                                     {storeInit?.IsCsCustomization === 1 && selectCsQc?.length > 0 && csList?.filter((ele) => ele?.D !== "MISC")?.length > 0
// //                                         ? SizeSorting(SizeCombo?.rd)?.length > 0 &&
// //                                         singleProd?.DefaultSize !== "" && (
// //                                             <div
// //                                                 className="fgstore_mapp_single_prod_customize"
// //                                                 style={{
// //                                                     width: "50%",
// //                                                 }}
// //                                             >
// //                                                 <label className="fgstore_mappmenuItemTimeEleveDeatil">SIZE:</label>
// //                                                 {singleProd?.IsMrpBase == 1 ? (
// //                                                     <span
// //                                                         className="fgstore_mapp_menuitemSelectoreMain"
// //                                                         style={{
// //                                                             display: "flex",
// //                                                             flexDirection: "column",
// //                                                             marginLeft: "4px",
// //                                                         }}
// //                                                     >
// //                                                         {singleProd?.DefaultSize}
// //                                                     </span>
// //                                                 ) : (
// //                                                     <select
// //                                                         className="fgstore_mapp_menuitemSelectoreMain"
// //                                                         value={sizeData}
// //                                                         // onChange={(e) => {
// //                                                         //   setSizeData(e.target.value);
// //                                                         // }}
// //                                                         onChange={(e) => handleCustomChange(e, "sz")}
// //                                                         style={{ fontSize: "1rem" }}
// //                                                     >
// //                                                         {SizeSorting(SizeCombo?.rd)?.map((ele) => (
// //                                                             <option
// //                                                                 value={ele?.sizename}
// //                                                                 // selected={
// //                                                                 //   singleProd && singleProd.DefaultSize === ele.sizename
// //                                                                 // }
// //                                                                 key={ele?.id}
// //                                                             >
// //                                                                 {ele?.sizename}
// //                                                             </option>
// //                                                         ))}
// //                                                     </select>
// //                                                 )}
// //                                             </div>
// //                                         )
// //                                         : null}
// //                                 </div>
// //                             )}
// //             </Box>
// //         </>
// //     )
// // }

// // export default MaterialCustomization



//   {storeInit?.IsProductWebCustomization == 1 && metalTypeCombo?.length > 0 && storeInit?.IsMetalCustomization === 1 && (
//                                 <div className="fgstore_mapp_single_prod_customize_main">
//                                     <div className="first_row_fgstore_mapp_new">
//                                         {
//                                             <div className="fgstore_mapp_single_prod_customize">
//                                                 <label className="fgstore_mappmenuItemTimeEleveDeatil">METAL TYPE:</label>
//                                                 {singleProd?.IsMrpBase == 1 ? (
//                                                     <span
//                                                         className="fgstore_mapp_menuitemSelectoreMain"
//                                                         style={{
//                                                             display: "flex",
//                                                             flexDirection: "column",
//                                                             marginLeft: "4px",
//                                                         }}
//                                                     >
//                                                         {metalTypeCombo?.filter((ele) => ele?.Metalid == singleProd?.MetalPurityid)[0]?.metaltype}
//                                                     </span>
//                                                 ) : (
//                                                     <select
//                                                         className="fgstore_mapp_menuitemSelectoreMain"
//                                                         value={selectMtType}
//                                                         onChange={(e) => handleCustomChange(e, "mt")}
//                                                         // onChange={(e) => setSelectMtType(e.target.value)}
//                                                         style={{ fontSize: "1rem" }}
//                                                     >
//                                                         {metalTypeCombo.map((ele) => (
//                                                             <option key={ele?.Metalid} value={ele?.metaltype}>
//                                                                 {ele?.metaltype}
//                                                             </option>
//                                                         ))}
//                                                     </select>
//                                                 )}
//                                             </div>
//                                         }
//                                         {metalColorCombo?.length > 0 && storeInit?.IsMetalTypeWithColor === 1 && (
//                                             <div className="fgstore_mapp_single_prod_customize">
//                                                 <label className="fgstore_mappmenuItemTimeEleveDeatil" htmlFor="metal_c_fgstore_mapp">
//                                                     METAL COLOR:
//                                                 </label>
//                                                 {singleProd?.IsMrpBase == 1 ? (
//                                                     <span
//                                                         className="fgstore_mapp_menuitemSelectoreMain"
//                                                         style={{
//                                                             display: "flex",
//                                                             flexDirection: "column",
//                                                             marginLeft: "4px",
//                                                         }}
//                                                     >
//                                                         {metalColorCombo?.filter((ele) => ele?.id == singleProd?.MetalColorid)[0]?.metalcolorname}
//                                                     </span>
//                                                 ) : (
//                                                     <select className="fgstore_mapp_menuitemSelectoreMain" id="metal_c_fgstore_mapp" value={selectMtColor} onChange={(e) => handleMetalWiseColorImg(e)} style={{ fontSize: "1rem" }}>
//                                                         {metalColorCombo?.map((ele) => (
//                                                             <option key={ele?.id} value={ele?.metalcolorname}>
//                                                                 {ele?.metalcolorname}
//                                                             </option>
//                                                         ))}
//                                                     </select>
//                                                 )}
//                                             </div>
//                                         )}
//                                     </div>
//                                     <div className="first_row_fgstore_mapp_new">
//                                         {storeInit?.IsDiamondCustomization === 1 && diaQcCombo?.length > 0 && diaList?.length ? (
//                                             <div className="fgstore_mapp_single_prod_customize">
//                                                 <label className="fgstore_mappmenuItemTimeEleveDeatil">DIAMOND :</label>
//                                                 {
//                                                     <select
//                                                         className="fgstore_mapp_menuitemSelectoreMain"
//                                                         value={selectDiaQc}
//                                                         // onChange={(e) => setSelectDiaQc(e.target.value)}
//                                                         onChange={(e) => handleCustomChange(e, "dia")}
//                                                         style={{ fontSize: "1rem" }}
//                                                     >
//                                                         {diaQcCombo.map((ele) => (
//                                                             <option key={ele?.QualityId} value={`${ele?.Quality},${ele?.color}`}>{`${ele?.Quality},${ele?.color}`}</option>
//                                                         ))}
//                                                     </select>
//                                                 }
//                                             </div>
//                                         ) : null}
//                                         {storeInit?.IsCsCustomization === 1 && selectCsQc?.length > 0 && csList?.filter((ele) => ele?.D !== "MISC")?.length > 0 ? (
//                                             <div className="fgstore_mapp_single_prod_customize">
//                                                 <label className="fgstore_mappmenuItemTimeEleveDeatil">COLOR STONE :</label>
//                                                 <select
//                                                     className="fgstore_mapp_menuitemSelectoreMain"
//                                                     value={selectCsQc}
//                                                     // onChange={(e) => setSelectCsQc(e.target.value)}
//                                                     onChange={(e) => handleCustomChange(e, "cs")}
//                                                     style={{ fontSize: "1rem" }}
//                                                 >
//                                                     {csQcCombo.map((ele) => (
//                                                         <option key={ele?.QualityId} value={`${ele?.Quality},${ele?.color}`}>{`${ele?.Quality},${ele?.color}`}</option>
//                                                     ))}
//                                                 </select>
//                                             </div>
//                                         ) : (
//                                             SizeSorting(SizeCombo?.rd)?.length > 0 &&
//                                             singleProd?.DefaultSize !== "" && (
//                                                 <div
//                                                     className="fgstore_mapp_single_prod_customize"
//                                                     style={{
//                                                         width: "50%",
//                                                     }}
//                                                 >
//                                                     <label className="fgstore_mappmenuItemTimeEleveDeatil">SIZE:</label>
//                                                     {singleProd?.IsMrpBase == 1 ? (
//                                                         <span
//                                                             className="fgstore_mapp_menuitemSelectoreMain"
//                                                             style={{
//                                                                 display: "flex",
//                                                                 flexDirection: "column",
//                                                                 marginLeft: "4px",
//                                                             }}
//                                                         >
//                                                             {singleProd?.DefaultSize}
//                                                         </span>
//                                                     ) : (
//                                                         <select
//                                                             className="fgstore_mapp_menuitemSelectoreMain"
//                                                             value={sizeData}
//                                                             // onChange={(e) => {
//                                                             //   setSizeData(e.target.value);
//                                                             // }}
//                                                             onChange={(e) => handleCustomChange(e, "sz")}
//                                                             style={{ fontSize: "1rem" }}
//                                                         >
//                                                             {SizeSorting(SizeCombo?.rd)?.map((ele) => (
//                                                                 <option
//                                                                     value={ele?.sizename}
//                                                                     // selected={
//                                                                     //   singleProd && singleProd.DefaultSize === ele.sizename
//                                                                     // }
//                                                                     key={ele?.id}
//                                                                 >
//                                                                     {ele?.sizename}
//                                                                 </option>
//                                                             ))}
//                                                         </select>
//                                                     )}
//                                                 </div>
//                                             )
//                                         )}
//                                     </div>
//                                     {storeInit?.IsCsCustomization === 1 && selectCsQc?.length > 0 && csList?.filter((ele) => ele?.D !== "MISC")?.length > 0
//                                         ? SizeSorting(SizeCombo?.rd)?.length > 0 &&
//                                         singleProd?.DefaultSize !== "" && (
//                                             <div
//                                                 className="fgstore_mapp_single_prod_customize"
//                                                 style={{
//                                                     width: "50%",
//                                                 }}
//                                             >
//                                                 <label className="fgstore_mappmenuItemTimeEleveDeatil">SIZE:</label>
//                                                 {singleProd?.IsMrpBase == 1 ? (
//                                                     <span
//                                                         className="fgstore_mapp_menuitemSelectoreMain"
//                                                         style={{
//                                                             display: "flex",
//                                                             flexDirection: "column",
//                                                             marginLeft: "4px",
//                                                         }}
//                                                     >
//                                                         {singleProd?.DefaultSize}
//                                                     </span>
//                                                 ) : (
//                                                     <select
//                                                         className="fgstore_mapp_menuitemSelectoreMain"
//                                                         value={sizeData}
//                                                         // onChange={(e) => {
//                                                         //   setSizeData(e.target.value);
//                                                         // }}
//                                                         onChange={(e) => handleCustomChange(e, "sz")}
//                                                         style={{ fontSize: "1rem" }}
//                                                     >
//                                                         {SizeSorting(SizeCombo?.rd)?.map((ele) => (
//                                                             <option
//                                                                 value={ele?.sizename}
//                                                                 // selected={
//                                                                 //   singleProd && singleProd.DefaultSize === ele.sizename
//                                                                 // }
//                                                                 key={ele?.id}
//                                                             >
//                                                                 {ele?.sizename}
//                                                             </option>
//                                                         ))}
//                                                     </select>
//                                                 )}
//                                             </div>
//                                         )
//                                         : null}
//                                 </div>
//                             )}













//  <Accordion
//                                 className="accordian"
//                                 sx={{
//                                     border: "none",
//                                     boxShadow: "none",
//                                     "&:before": {
//                                         display: "none",
//                                     },
//                                 }}
//                                 key={1}
//                                 expanded={expandedIndex === 1}
//                                 onChange={handleChange(1)}
//                             >
//                                 <AccordionSummary
//                                     expandIcon={expandedIndex === 1 ? <RemoveIcon style={{ fontSize: "1.2rem", color: "black" }} /> : <AddIcon style={{ fontSize: "1.2rem", color: "black" }} />}
//                                     aria-controls="panel1-content"
//                                     id="panel1-header"
//                                     className="summary"
//                                     sx={{
//                                         padding: "0 5px",
//                                     }}
//                                 >
//                                     <Typography
//                                         className="title"
//                                         sx={{
//                                             textAlign: "center",
//                                             width: "100%",
//                                         }}
//                                         style={{
//                                             fontSize: "0.9rem",
//                                             textTransform: "uppercase",
//                                             marginLeft: "3.4px",
//                                         }}
//                                     >
//                                         MATERIAL DETAILS
//                                     </Typography>
//                                 </AccordionSummary>
//                                 <AccordionDetails>
//                                     <div className="smr_prod_summury_info" style={{ border: "none" }}>
//                                         <div className="smr_prod_summury_info_inner" style={{ display: "flex", flexDirection: "column" }}>
//                                             <span className="smr_single_prod_designno">{singleProd?.designno}</span>
//                                             <span className="smr_prod_short_key">
//                                                 Metal Purity : <span className="smr_prod_short_val">{selectMtType}</span>
//                                             </span>
//                                             <span className="smr_prod_short_key">
//                                                 Metal Color : <span className="smr_prod_short_val">{selectMtColor}</span>
//                                             </span>
//                                             {storeInit?.IsDiamondCustomization === 1 && diaQcCombo?.length > 0 && diaList?.length ? (
//                                                 <span className="smr_prod_short_key">
//                                                     Diamond Quality Color : <span className="smr_prod_short_val">{`${selectDiaQc}`}</span>
//                                                 </span>
//                                             ) : null}
//                                             {storeInit?.IsMetalWeight === 1 && (
//                                                 <span className="smr_prod_short_key">
//                                                     Net Wt :<span className="smr_prod_short_val">{singleProd1?.Nwt ?? singleProd?.Nwt?.toFixed(3)}</span>
//                                                 </span>
//                                             )}
//                                         </div>
//                                     </div>
//                                 </AccordionDetails>
//                             </Accordion>









// import { Box } from '@mui/material';
// import Grid from '@mui/material/Grid'; // Standard MUI Grid
// import React from 'react';

// const MaterialCustomization = ({
//     storeInit,
//     metalTypeCombo,
//     metalColorCombo,
//     diaQcCombo,
//     diaList,
//     csQcCombo,
//     csList,
//     SizeCombo,
//     singleProd,
//     selectMtType,
//     selectMtColor,
//     selectDiaQc,
//     selectCsQc,
//     sizeData,
//     handleCustomChange,
//     handleMetalWiseColorImg,
//     SizeSorting,
// }) => {
//     return (
//         <>
//             <Box sx={{ width: "100%", px: 2, mt: 3 ,mb:2 }}>
//                 {storeInit?.IsProductWebCustomization == 1 &&
//                     metalTypeCombo?.length > 0 &&
//                     storeInit?.IsMetalCustomization === 1 && (
//                         <Grid container spacing={1} className="fgstore_mapp_single_prod_customize_main">

//                             {/* --- METAL TYPE --- */}
//                             <Grid item size={{ xs: 6, sm: 6 }} sx={{ display: 'flex', flexDirection: 'column' }}>
//                                 <div className="fgstore_mapp_single_prod_customize" style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
//                                     <label className="fgstore_mappmenuItemTimeEleveDeatil" style={{ marginBottom: '4px' }}>
//                                         METAL TYPE:
//                                     </label>
//                                     {singleProd?.IsMrpBase == 1 ? (
//                                         <span
//                                             className="fgstore_mapp_menuitemSelectoreMain"
//                                             style={{
//                                                 display: "flex",
//                                                 flexDirection: "column",
//                                                 marginLeft: "4px",
//                                             }}
//                                         >
//                                             {metalTypeCombo?.filter((ele) => ele?.Metalid == singleProd?.MetalPurityid)[0]?.metaltype}
//                                         </span>
//                                     ) : (
//                                         <select
//                                             className="fgstore_mapp_menuitemSelectoreMain"
//                                             value={selectMtType}
//                                             onChange={(e) => handleCustomChange(e, "mt")}
//                                             style={{ fontSize: "1rem", width: "100%", padding: "8px" }}
//                                         >
//                                             {metalTypeCombo.map((ele) => (
//                                                 <option key={ele?.Metalid} value={ele?.metaltype}>
//                                                     {ele?.metaltype}
//                                                 </option>
//                                             ))}
//                                         </select>
//                                     )}
//                                 </div>
//                             </Grid>

//                             {/* --- METAL COLOR --- */}
//                             {metalColorCombo?.length > 0 && storeInit?.IsMetalTypeWithColor === 1 && (
//                                 <Grid item size={{ xs: 6, sm: 6 }} sx={{ display: 'flex', flexDirection: 'column' }}>
//                                     <div className="fgstore_mapp_single_prod_customize" style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
//                                         <label
//                                             className="fgstore_mappmenuItemTimeEleveDeatil"
//                                             htmlFor="metal_c_fgstore_mapp"
//                                             style={{ marginBottom: '4px' }}
//                                         >
//                                             METAL COLOR:
//                                         </label>
//                                         {singleProd?.IsMrpBase == 1 ? (
//                                             <span
//                                                 className="fgstore_mapp_menuitemSelectoreMain"
//                                                 style={{
//                                                     display: "flex",
//                                                     flexDirection: "column",
//                                                     marginLeft: "4px",
//                                                 }}
//                                             >
//                                                 {metalColorCombo?.filter((ele) => ele?.id == singleProd?.MetalColorid)[0]?.metalcolorname}
//                                             </span>
//                                         ) : (
//                                             <select
//                                                 className="fgstore_mapp_menuitemSelectoreMain"
//                                                 id="metal_c_fgstore_mapp"
//                                                 value={selectMtColor}
//                                                 onChange={(e) => handleMetalWiseColorImg(e)}
//                                                 style={{ fontSize: "1rem", width: "100%", padding: "8px" }}
//                                             >
//                                                 {metalColorCombo?.map((ele) => (
//                                                     <option key={ele?.id} value={ele?.metalcolorname}>
//                                                         {ele?.metalcolorname}
//                                                     </option>
//                                                 ))}
//                                             </select>
//                                         )}
//                                     </div>
//                                 </Grid>
//                             )}

//                             {/* --- DIAMOND --- */}
//                             {storeInit?.IsDiamondCustomization === 1 && diaQcCombo?.length > 0 && diaList?.length > 0 && (
//                                 <Grid item size={{ xs: 6, sm: 6 }} sx={{ display: 'flex', flexDirection: 'column' }}>
//                                     <div className="fgstore_mapp_single_prod_customize" style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
//                                         <label className="fgstore_mappmenuItemTimeEleveDeatil" style={{ marginBottom: '4px' }}>
//                                             DIAMOND:
//                                         </label>
//                                         <select
//                                             className="fgstore_mapp_menuitemSelectoreMain"
//                                             value={selectDiaQc}
//                                             onChange={(e) => handleCustomChange(e, "dia")}
//                                             style={{ fontSize: "1rem", width: "100%", padding: "8px" }}
//                                         >
//                                             {diaQcCombo.map((ele) => (
//                                                 <option key={ele?.QualityId} value={`${ele?.Quality},${ele?.color}`}>
//                                                     {`${ele?.Quality},${ele?.color}`}
//                                                 </option>
//                                             ))}
//                                         </select>
//                                     </div>
//                                 </Grid>
//                             )}

//                             {/* --- COLOR STONE --- */}
//                             {storeInit?.IsCsCustomization === 1 && selectCsQc?.length > 0 && csList?.filter((ele) => ele?.D !== "MISC")?.length > 0 && (
//                                 <Grid item size={{ xs: 6, sm: 6 }} sx={{ display: 'flex', flexDirection: 'column' }}>
//                                     <div className="fgstore_mapp_single_prod_customize" style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
//                                         <label className="fgstore_mappmenuItemTimeEleveDeatil" style={{ marginBottom: '4px' }}>
//                                             COLOR STONE:
//                                         </label>
//                                         <select
//                                             className="fgstore_mapp_menuitemSelectoreMain"
//                                             value={selectCsQc}
//                                             onChange={(e) => handleCustomChange(e, "cs")}
//                                             style={{ fontSize: "1rem", width: "100%", padding: "8px" }}
//                                         >
//                                             {csQcCombo.map((ele) => (
//                                                 <option key={ele?.QualityId} value={`${ele?.Quality},${ele?.color}`}>
//                                                     {`${ele?.Quality},${ele?.color}`}
//                                                 </option>
//                                             ))}
//                                         </select>
//                                     </div>
//                                 </Grid>
//                             )}

//                             {/* --- SIZE --- */}
//                             {SizeSorting(SizeCombo?.rd)?.length > 0 && singleProd?.DefaultSize !== "" && (
//                                 <Grid item size={{ xs: 6, sm: 6 }} sx={{ display: 'flex', flexDirection: 'column' }}>
//                                     <div className="fgstore_mapp_single_prod_customize" style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
//                                         <label className="fgstore_mappmenuItemTimeEleveDeatil" style={{ marginBottom: '4px' }}>
//                                             SIZE:
//                                         </label>
//                                         {singleProd?.IsMrpBase == 1 ? (
//                                             <span
//                                                 className="fgstore_mapp_menuitemSelectoreMain"
//                                                 style={{
//                                                     display: "flex",
//                                                     flexDirection: "column",
//                                                     marginLeft: "4px",
//                                                 }}
//                                             >
//                                                 {singleProd?.DefaultSize}
//                                             </span>
//                                         ) : (
//                                             <select
//                                                 className="fgstore_mapp_menuitemSelectoreMain"
//                                                 value={sizeData}
//                                                 onChange={(e) => handleCustomChange(e, "sz")}
//                                                 style={{ fontSize: "1rem", width: "100%", padding: "8px" }}
//                                             >
//                                                 {SizeSorting(SizeCombo?.rd)?.map((ele) => (
//                                                     <option value={ele?.sizename} key={ele?.id}>
//                                                         {ele?.sizename}
//                                                     </option>
//                                                 ))}
//                                             </select>
//                                         )}
//                                     </div>
//                                 </Grid>
//                             )}

//                         </Grid>
//                     )}
//             </Box>
//         </>
//     );
// };

// export default MaterialCustomization;

// // import { Box } from '@mui/material'
// // import React from 'react'

// // const MaterialCustomization = ({
// //      storeInit,
// //   metalTypeCombo,
// //   metalColorCombo,
// //   diaQcCombo,
// //   diaList,
// //   csQcCombo,
// //   csList,
// //   SizeCombo,
// //   singleProd,
// //   selectMtType,
// //   selectMtColor,
// //   selectDiaQc,
// //   selectCsQc,
// //   sizeData,
// //   handleCustomChange,
// //   handleMetalWiseColorImg,
// //   SizeSorting,
// // }) => {
// //     return (
// //         <>
// //             <Box sx={{ width: "100%", px: 2, mt: 4 }}>
// //    {storeInit?.IsProductWebCustomization == 1 && metalTypeCombo?.length > 0 && storeInit?.IsMetalCustomization === 1 && (
// //                                 <div className="fgstore_mapp_single_prod_customize_main">
// //                                     <div className="first_row_fgstore_mapp_new">
// //                                         {
// //                                             <div className="fgstore_mapp_single_prod_customize">
// //                                                 <label className="fgstore_mappmenuItemTimeEleveDeatil">METAL TYPE:</label>
// //                                                 {singleProd?.IsMrpBase == 1 ? (
// //                                                     <span
// //                                                         className="fgstore_mapp_menuitemSelectoreMain"
// //                                                         style={{
// //                                                             display: "flex",
// //                                                             flexDirection: "column",
// //                                                             marginLeft: "4px",
// //                                                         }}
// //                                                     >
// //                                                         {metalTypeCombo?.filter((ele) => ele?.Metalid == singleProd?.MetalPurityid)[0]?.metaltype}
// //                                                     </span>
// //                                                 ) : (
// //                                                     <select
// //                                                         className="fgstore_mapp_menuitemSelectoreMain"
// //                                                         value={selectMtType}
// //                                                         onChange={(e) => handleCustomChange(e, "mt")}
// //                                                         // onChange={(e) => setSelectMtType(e.target.value)}
// //                                                         style={{ fontSize: "1rem" }}
// //                                                     >
// //                                                         {metalTypeCombo.map((ele) => (
// //                                                             <option key={ele?.Metalid} value={ele?.metaltype}>
// //                                                                 {ele?.metaltype}
// //                                                             </option>
// //                                                         ))}
// //                                                     </select>
// //                                                 )}
// //                                             </div>
// //                                         }
// //                                         {metalColorCombo?.length > 0 && storeInit?.IsMetalTypeWithColor === 1 && (
// //                                             <div className="fgstore_mapp_single_prod_customize">
// //                                                 <label className="fgstore_mappmenuItemTimeEleveDeatil" htmlFor="metal_c_fgstore_mapp">
// //                                                     METAL COLOR:
// //                                                 </label>
// //                                                 {singleProd?.IsMrpBase == 1 ? (
// //                                                     <span
// //                                                         className="fgstore_mapp_menuitemSelectoreMain"
// //                                                         style={{
// //                                                             display: "flex",
// //                                                             flexDirection: "column",
// //                                                             marginLeft: "4px",
// //                                                         }}
// //                                                     >
// //                                                         {metalColorCombo?.filter((ele) => ele?.id == singleProd?.MetalColorid)[0]?.metalcolorname}
// //                                                     </span>
// //                                                 ) : (
// //                                                     <select className="fgstore_mapp_menuitemSelectoreMain" id="metal_c_fgstore_mapp" value={selectMtColor} onChange={(e) => handleMetalWiseColorImg(e)} style={{ fontSize: "1rem" }}>
// //                                                         {metalColorCombo?.map((ele) => (
// //                                                             <option key={ele?.id} value={ele?.metalcolorname}>
// //                                                                 {ele?.metalcolorname}
// //                                                             </option>
// //                                                         ))}
// //                                                     </select>
// //                                                 )}
// //                                             </div>
// //                                         )}
// //                                     </div>
// //                                     <div className="first_row_fgstore_mapp_new">
// //                                         {storeInit?.IsDiamondCustomization === 1 && diaQcCombo?.length > 0 && diaList?.length ? (
// //                                             <div className="fgstore_mapp_single_prod_customize">
// //                                                 <label className="fgstore_mappmenuItemTimeEleveDeatil">DIAMOND :</label>
// //                                                 {
// //                                                     <select
// //                                                         className="fgstore_mapp_menuitemSelectoreMain"
// //                                                         value={selectDiaQc}
// //                                                         // onChange={(e) => setSelectDiaQc(e.target.value)}
// //                                                         onChange={(e) => handleCustomChange(e, "dia")}
// //                                                         style={{ fontSize: "1rem" }}
// //                                                     >
// //                                                         {diaQcCombo.map((ele) => (
// //                                                             <option key={ele?.QualityId} value={`${ele?.Quality},${ele?.color}`}>{`${ele?.Quality},${ele?.color}`}</option>
// //                                                         ))}
// //                                                     </select>
// //                                                 }
// //                                             </div>
// //                                         ) : null}
// //                                         {storeInit?.IsCsCustomization === 1 && selectCsQc?.length > 0 && csList?.filter((ele) => ele?.D !== "MISC")?.length > 0 ? (
// //                                             <div className="fgstore_mapp_single_prod_customize">
// //                                                 <label className="fgstore_mappmenuItemTimeEleveDeatil">COLOR STONE :</label>
// //                                                 <select
// //                                                     className="fgstore_mapp_menuitemSelectoreMain"
// //                                                     value={selectCsQc}
// //                                                     // onChange={(e) => setSelectCsQc(e.target.value)}
// //                                                     onChange={(e) => handleCustomChange(e, "cs")}
// //                                                     style={{ fontSize: "1rem" }}
// //                                                 >
// //                                                     {csQcCombo.map((ele) => (
// //                                                         <option key={ele?.QualityId} value={`${ele?.Quality},${ele?.color}`}>{`${ele?.Quality},${ele?.color}`}</option>
// //                                                     ))}
// //                                                 </select>
// //                                             </div>
// //                                         ) : (
// //                                             SizeSorting(SizeCombo?.rd)?.length > 0 &&
// //                                             singleProd?.DefaultSize !== "" && (
// //                                                 <div
// //                                                     className="fgstore_mapp_single_prod_customize"
// //                                                     style={{
// //                                                         width: "50%",
// //                                                     }}
// //                                                 >
// //                                                     <label className="fgstore_mappmenuItemTimeEleveDeatil">SIZE:</label>
// //                                                     {singleProd?.IsMrpBase == 1 ? (
// //                                                         <span
// //                                                             className="fgstore_mapp_menuitemSelectoreMain"
// //                                                             style={{
// //                                                                 display: "flex",
// //                                                                 flexDirection: "column",
// //                                                                 marginLeft: "4px",
// //                                                             }}
// //                                                         >
// //                                                             {singleProd?.DefaultSize}
// //                                                         </span>
// //                                                     ) : (
// //                                                         <select
// //                                                             className="fgstore_mapp_menuitemSelectoreMain"
// //                                                             value={sizeData}
// //                                                             // onChange={(e) => {
// //                                                             //   setSizeData(e.target.value);
// //                                                             // }}
// //                                                             onChange={(e) => handleCustomChange(e, "sz")}
// //                                                             style={{ fontSize: "1rem" }}
// //                                                         >
// //                                                             {SizeSorting(SizeCombo?.rd)?.map((ele) => (
// //                                                                 <option
// //                                                                     value={ele?.sizename}
// //                                                                     // selected={
// //                                                                     //   singleProd && singleProd.DefaultSize === ele.sizename
// //                                                                     // }
// //                                                                     key={ele?.id}
// //                                                                 >
// //                                                                     {ele?.sizename}
// //                                                                 </option>
// //                                                             ))}
// //                                                         </select>
// //                                                     )}
// //                                                 </div>
// //                                             )
// //                                         )}
// //                                     </div>
// //                                     {storeInit?.IsCsCustomization === 1 && selectCsQc?.length > 0 && csList?.filter((ele) => ele?.D !== "MISC")?.length > 0
// //                                         ? SizeSorting(SizeCombo?.rd)?.length > 0 &&
// //                                         singleProd?.DefaultSize !== "" && (
// //                                             <div
// //                                                 className="fgstore_mapp_single_prod_customize"
// //                                                 style={{
// //                                                     width: "50%",
// //                                                 }}
// //                                             >
// //                                                 <label className="fgstore_mappmenuItemTimeEleveDeatil">SIZE:</label>
// //                                                 {singleProd?.IsMrpBase == 1 ? (
// //                                                     <span
// //                                                         className="fgstore_mapp_menuitemSelectoreMain"
// //                                                         style={{
// //                                                             display: "flex",
// //                                                             flexDirection: "column",
// //                                                             marginLeft: "4px",
// //                                                         }}
// //                                                     >
// //                                                         {singleProd?.DefaultSize}
// //                                                     </span>
// //                                                 ) : (
// //                                                     <select
// //                                                         className="fgstore_mapp_menuitemSelectoreMain"
// //                                                         value={sizeData}
// //                                                         // onChange={(e) => {
// //                                                         //   setSizeData(e.target.value);
// //                                                         // }}
// //                                                         onChange={(e) => handleCustomChange(e, "sz")}
// //                                                         style={{ fontSize: "1rem" }}
// //                                                     >
// //                                                         {SizeSorting(SizeCombo?.rd)?.map((ele) => (
// //                                                             <option
// //                                                                 value={ele?.sizename}
// //                                                                 // selected={
// //                                                                 //   singleProd && singleProd.DefaultSize === ele.sizename
// //                                                                 // }
// //                                                                 key={ele?.id}
// //                                                             >
// //                                                                 {ele?.sizename}
// //                                                             </option>
// //                                                         ))}
// //                                                     </select>
// //                                                 )}
// //                                             </div>
// //                                         )
// //                                         : null}
// //                                 </div>
// //                             )}
// //             </Box>
// //         </>
// //     )
// // }

// // export default MaterialCustomization



//   {storeInit?.IsProductWebCustomization == 1 && metalTypeCombo?.length > 0 && storeInit?.IsMetalCustomization === 1 && (
//                                 <div className="fgstore_mapp_single_prod_customize_main">
//                                     <div className="first_row_fgstore_mapp_new">
//                                         {
//                                             <div className="fgstore_mapp_single_prod_customize">
//                                                 <label className="fgstore_mappmenuItemTimeEleveDeatil">METAL TYPE:</label>
//                                                 {singleProd?.IsMrpBase == 1 ? (
//                                                     <span
//                                                         className="fgstore_mapp_menuitemSelectoreMain"
//                                                         style={{
//                                                             display: "flex",
//                                                             flexDirection: "column",
//                                                             marginLeft: "4px",
//                                                         }}
//                                                     >
//                                                         {metalTypeCombo?.filter((ele) => ele?.Metalid == singleProd?.MetalPurityid)[0]?.metaltype}
//                                                     </span>
//                                                 ) : (
//                                                     <select
//                                                         className="fgstore_mapp_menuitemSelectoreMain"
//                                                         value={selectMtType}
//                                                         onChange={(e) => handleCustomChange(e, "mt")}
//                                                         // onChange={(e) => setSelectMtType(e.target.value)}
//                                                         style={{ fontSize: "1rem" }}
//                                                     >
//                                                         {metalTypeCombo.map((ele) => (
//                                                             <option key={ele?.Metalid} value={ele?.metaltype}>
//                                                                 {ele?.metaltype}
//                                                             </option>
//                                                         ))}
//                                                     </select>
//                                                 )}
//                                             </div>
//                                         }
//                                         {metalColorCombo?.length > 0 && storeInit?.IsMetalTypeWithColor === 1 && (
//                                             <div className="fgstore_mapp_single_prod_customize">
//                                                 <label className="fgstore_mappmenuItemTimeEleveDeatil" htmlFor="metal_c_fgstore_mapp">
//                                                     METAL COLOR:
//                                                 </label>
//                                                 {singleProd?.IsMrpBase == 1 ? (
//                                                     <span
//                                                         className="fgstore_mapp_menuitemSelectoreMain"
//                                                         style={{
//                                                             display: "flex",
//                                                             flexDirection: "column",
//                                                             marginLeft: "4px",
//                                                         }}
//                                                     >
//                                                         {metalColorCombo?.filter((ele) => ele?.id == singleProd?.MetalColorid)[0]?.metalcolorname}
//                                                     </span>
//                                                 ) : (
//                                                     <select className="fgstore_mapp_menuitemSelectoreMain" id="metal_c_fgstore_mapp" value={selectMtColor} onChange={(e) => handleMetalWiseColorImg(e)} style={{ fontSize: "1rem" }}>
//                                                         {metalColorCombo?.map((ele) => (
//                                                             <option key={ele?.id} value={ele?.metalcolorname}>
//                                                                 {ele?.metalcolorname}
//                                                             </option>
//                                                         ))}
//                                                     </select>
//                                                 )}
//                                             </div>
//                                         )}
//                                     </div>
//                                     <div className="first_row_fgstore_mapp_new">
//                                         {storeInit?.IsDiamondCustomization === 1 && diaQcCombo?.length > 0 && diaList?.length ? (
//                                             <div className="fgstore_mapp_single_prod_customize">
//                                                 <label className="fgstore_mappmenuItemTimeEleveDeatil">DIAMOND :</label>
//                                                 {
//                                                     <select
//                                                         className="fgstore_mapp_menuitemSelectoreMain"
//                                                         value={selectDiaQc}
//                                                         // onChange={(e) => setSelectDiaQc(e.target.value)}
//                                                         onChange={(e) => handleCustomChange(e, "dia")}
//                                                         style={{ fontSize: "1rem" }}
//                                                     >
//                                                         {diaQcCombo.map((ele) => (
//                                                             <option key={ele?.QualityId} value={`${ele?.Quality},${ele?.color}`}>{`${ele?.Quality},${ele?.color}`}</option>
//                                                         ))}
//                                                     </select>
//                                                 }
//                                             </div>
//                                         ) : null}
//                                         {storeInit?.IsCsCustomization === 1 && selectCsQc?.length > 0 && csList?.filter((ele) => ele?.D !== "MISC")?.length > 0 ? (
//                                             <div className="fgstore_mapp_single_prod_customize">
//                                                 <label className="fgstore_mappmenuItemTimeEleveDeatil">COLOR STONE :</label>
//                                                 <select
//                                                     className="fgstore_mapp_menuitemSelectoreMain"
//                                                     value={selectCsQc}
//                                                     // onChange={(e) => setSelectCsQc(e.target.value)}
//                                                     onChange={(e) => handleCustomChange(e, "cs")}
//                                                     style={{ fontSize: "1rem" }}
//                                                 >
//                                                     {csQcCombo.map((ele) => (
//                                                         <option key={ele?.QualityId} value={`${ele?.Quality},${ele?.color}`}>{`${ele?.Quality},${ele?.color}`}</option>
//                                                     ))}
//                                                 </select>
//                                             </div>
//                                         ) : (
//                                             SizeSorting(SizeCombo?.rd)?.length > 0 &&
//                                             singleProd?.DefaultSize !== "" && (
//                                                 <div
//                                                     className="fgstore_mapp_single_prod_customize"
//                                                     style={{
//                                                         width: "50%",
//                                                     }}
//                                                 >
//                                                     <label className="fgstore_mappmenuItemTimeEleveDeatil">SIZE:</label>
//                                                     {singleProd?.IsMrpBase == 1 ? (
//                                                         <span
//                                                             className="fgstore_mapp_menuitemSelectoreMain"
//                                                             style={{
//                                                                 display: "flex",
//                                                                 flexDirection: "column",
//                                                                 marginLeft: "4px",
//                                                             }}
//                                                         >
//                                                             {singleProd?.DefaultSize}
//                                                         </span>
//                                                     ) : (
//                                                         <select
//                                                             className="fgstore_mapp_menuitemSelectoreMain"
//                                                             value={sizeData}
//                                                             // onChange={(e) => {
//                                                             //   setSizeData(e.target.value);
//                                                             // }}
//                                                             onChange={(e) => handleCustomChange(e, "sz")}
//                                                             style={{ fontSize: "1rem" }}
//                                                         >
//                                                             {SizeSorting(SizeCombo?.rd)?.map((ele) => (
//                                                                 <option
//                                                                     value={ele?.sizename}
//                                                                     // selected={
//                                                                     //   singleProd && singleProd.DefaultSize === ele.sizename
//                                                                     // }
//                                                                     key={ele?.id}
//                                                                 >
//                                                                     {ele?.sizename}
//                                                                 </option>
//                                                             ))}
//                                                         </select>
//                                                     )}
//                                                 </div>
//                                             )
//                                         )}
//                                     </div>
//                                     {storeInit?.IsCsCustomization === 1 && selectCsQc?.length > 0 && csList?.filter((ele) => ele?.D !== "MISC")?.length > 0
//                                         ? SizeSorting(SizeCombo?.rd)?.length > 0 &&
//                                         singleProd?.DefaultSize !== "" && (
//                                             <div
//                                                 className="fgstore_mapp_single_prod_customize"
//                                                 style={{
//                                                     width: "50%",
//                                                 }}
//                                             >
//                                                 <label className="fgstore_mappmenuItemTimeEleveDeatil">SIZE:</label>
//                                                 {singleProd?.IsMrpBase == 1 ? (
//                                                     <span
//                                                         className="fgstore_mapp_menuitemSelectoreMain"
//                                                         style={{
//                                                             display: "flex",
//                                                             flexDirection: "column",
//                                                             marginLeft: "4px",
//                                                         }}
//                                                     >
//                                                         {singleProd?.DefaultSize}
//                                                     </span>
//                                                 ) : (
//                                                     <select
//                                                         className="fgstore_mapp_menuitemSelectoreMain"
//                                                         value={sizeData}
//                                                         // onChange={(e) => {
//                                                         //   setSizeData(e.target.value);
//                                                         // }}
//                                                         onChange={(e) => handleCustomChange(e, "sz")}
//                                                         style={{ fontSize: "1rem" }}
//                                                     >
//                                                         {SizeSorting(SizeCombo?.rd)?.map((ele) => (
//                                                             <option
//                                                                 value={ele?.sizename}
//                                                                 // selected={
//                                                                 //   singleProd && singleProd.DefaultSize === ele.sizename
//                                                                 // }
//                                                                 key={ele?.id}
//                                                             >
//                                                                 {ele?.sizename}
//                                                             </option>
//                                                         ))}
//                                                     </select>
//                                                 )}
//                                             </div>
//                                         )
//                                         : null}
//                                 </div>
//                             )}













//  <Accordion
//                                 className="accordian"
//                                 sx={{
//                                     border: "none",
//                                     boxShadow: "none",
//                                     "&:before": {
//                                         display: "none",
//                                     },
//                                 }}
//                                 key={1}
//                                 expanded={expandedIndex === 1}
//                                 onChange={handleChange(1)}
//                             >
//                                 <AccordionSummary
//                                     expandIcon={expandedIndex === 1 ? <RemoveIcon style={{ fontSize: "1.2rem", color: "black" }} /> : <AddIcon style={{ fontSize: "1.2rem", color: "black" }} />}
//                                     aria-controls="panel1-content"
//                                     id="panel1-header"
//                                     className="summary"
//                                     sx={{
//                                         padding: "0 5px",
//                                     }}
//                                 >
//                                     <Typography
//                                         className="title"
//                                         sx={{
//                                             textAlign: "center",
//                                             width: "100%",
//                                         }}
//                                         style={{
//                                             fontSize: "0.9rem",
//                                             textTransform: "uppercase",
//                                             marginLeft: "3.4px",
//                                         }}
//                                     >
//                                         MATERIAL DETAILS
//                                     </Typography>
//                                 </AccordionSummary>
//                                 <AccordionDetails>
//                                     <div className="smr_prod_summury_info" style={{ border: "none" }}>
//                                         <div className="smr_prod_summury_info_inner" style={{ display: "flex", flexDirection: "column" }}>
//                                             <span className="smr_single_prod_designno">{singleProd?.designno}</span>
//                                             <span className="smr_prod_short_key">
//                                                 Metal Purity : <span className="smr_prod_short_val">{selectMtType}</span>
//                                             </span>
//                                             <span className="smr_prod_short_key">
//                                                 Metal Color : <span className="smr_prod_short_val">{selectMtColor}</span>
//                                             </span>
//                                             {storeInit?.IsDiamondCustomization === 1 && diaQcCombo?.length > 0 && diaList?.length ? (
//                                                 <span className="smr_prod_short_key">
//                                                     Diamond Quality Color : <span className="smr_prod_short_val">{`${selectDiaQc}`}</span>
//                                                 </span>
//                                             ) : null}
//                                             {storeInit?.IsMetalWeight === 1 && (
//                                                 <span className="smr_prod_short_key">
//                                                     Net Wt :<span className="smr_prod_short_val">{singleProd1?.Nwt ?? singleProd?.Nwt?.toFixed(3)}</span>
//                                                 </span>
//                                             )}
//                                         </div>
//                                     </div>
//                                 </AccordionDetails>
//                             </Accordion>



















"use client";

// import React, { useState, useEffect, useMemo } from "react";
// import { Box, Pagination, PaginationItem, TextField, Typography } from "@mui/material";
// import debounce from "lodash.debounce";
// import "./EditablePagination.scss";

// const EditablePagination = ({
//   currentPage,
//   totalItems,
//   itemsPerPage,
//   onPageChange,
//   inputPage,
//   setInputPage,
//   handlePageInputChange,
//   maxwidth464px,
//   totalPages,
//   currPage,
//   isShowButton,
// }) => {
//   const [tempInputPage, setTempInputPage] = useState(inputPage); 
//   const debouncedSync = useMemo(
//     () =>
//       debounce((val) => {
//         setInputPage(val);
//       }, 300),
//     [setInputPage]
//   );

//   useEffect(() => {
//     setTempInputPage(inputPage);
//   }, [inputPage]);

//   const handleOnChange = (event) => {
//     const newValue = event.target.value;
//     if (newValue === "" || /^[0-9]+$/.test(newValue)) {
//       setTempInputPage(newValue);
//       debouncedSync(newValue);
//     }
//   };

//   return (
//     <Box display="flex" alignItems="center" className="main_pagination_portion">
//       <Pagination
//         count={Math.ceil(totalItems / itemsPerPage)}
//         page={currentPage}
//         size={maxwidth464px ? "small" : "large"}
//         shape="circular"
//         showFirstButton={!!isShowButton}
//         showLastButton={!!isShowButton}
//         onChange={onPageChange}
//         renderItem={(item) => (
//           <PaginationItem
//             {...item}
//             sx={{
//               pointerEvents: item.page === currentPage ? "none" : "auto",
//             }}
//           />
//         )}
//       />

//       <Box className="main_editable_pagination" sx={{ display: "flex", alignItems: "center" }}>
//         <Typography sx={{ ml: 2 }} variant="body1">
//           Go to Page:
//         </Typography>

//         <TextField
//           type="text"
//           autoComplete="off"
//           value={tempInputPage}
//           onBlur={() => {
//             if (!tempInputPage) {
//               setTempInputPage(currPage);
//               setInputPage(currPage);
//             }
//           }}
//           onChange={handleOnChange}
//           onKeyDown={(e) => {
//             if (e.key === "Enter") {
//               if (tempInputPage) {
//                 handlePageInputChange(e);
//               } else {
//                 setTempInputPage(currPage);
//                 setInputPage(currPage);
//               }
//             }
//           }}
//           inputProps={{
//             min: 1,
//             max: totalPages,
//             autoComplete: "off",
//           }}
//           variant="outlined"
//           sx={{
//             ml: 1,
//             width: 60,
//             "& .MuiInputBase-input": {
//               paddingBlock: "5.5px",
//             },
//           }}
//         />
//       </Box>
//     </Box>
//   );
// };

// export default EditablePagination;



import React, { useState } from "react";
import { Box, Pagination, PaginationItem, TextField, Typography } from "@mui/material";
import "./EditablePagination.scss";
import debounce from "lodash.debounce";

const EditablePagination = ({ currentPage, totalItems, itemsPerPage, onPageChange, inputPage, setInputPage, handlePageInputChange, maxwidth464px, totalPages, currPage, isShowButton }) => {
  const [debouncedInputPage, setDebouncedInputPage] = useState(inputPage);
  const dstCount = totalItems;

  const handleOnChange = (event) => {
    const newValue = event.target.value;
    if (newValue === "" || /^[0-9]+$/.test(newValue)) {
      setInputPage(newValue);
    }
  };

  return (
    <Box display="flex" alignItems="center" className="main_pagination_portion">
      <Pagination
        count={Math.ceil(dstCount / itemsPerPage)}
        page={currentPage}
        size={maxwidth464px ? "small" : "large"}
        shape="circular"
        showFirstButton={isShowButton ? true : false}
        showLastButton={isShowButton ? true : false}
        onChange={onPageChange}
        renderItem={(item) => (
          <PaginationItem
            {...item}
            sx={{
              pointerEvents: item.page === currentPage ? "none" : "auto",
            }}
          />
        )}
      />

      {/* Label "Go to Page" */}
      <Box className="main_editable_pagination" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Typography className="main_pagiantion_input" sx={{ marginLeft: 2 }} variant="body1">
          Go to Page:
        </Typography>

        {/* TextField to enter page number */}
        <TextField
          type="text"
          autoComplete="off"
          className="main_pagiantion_input"
          value={inputPage}
          onBlur={() => {
            if (!inputPage) {
              setInputPage(currPage);
            }
          }}
          onChange={(e) => handleOnChange(e)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && inputPage != "") {
              handlePageInputChange(e);
            } else if (e.key === "Enter" && inputPage == "") {
              setInputPage(currPage);
            }
          }}
          inputProps={{
            min: 1,
            max: totalPages,
            autoComplete: "off",
          }}
          variant="outlined"
          sx={{
            marginLeft: 1,
            width: 60,
            "& .MuiInputBase-input": {
              paddingBlock: "5.5px",
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default EditablePagination;

import React from "react";
import { Box, Typography, Button } from "@mui/material";
import DiamondOutlinedIcon from "@mui/icons-material/DiamondOutlined";
import Link from "next/link";

const OrderBlock = () => {
  return (
    <Box sx={{ px: 1 }}>
      <Box
        sx={{
          borderRadius: 3,
          px: 1.5,
          py: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "linear-gradient(135deg,#fff0f6,#ffd6e7)",
          border: "1px solid #ffd6e7",
          boxShadow: "0 3px 10px rgba(0,0,0,0.06)",
        }}
      >
        {/* Left */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
          <Box
            sx={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg,#f3e5f5,#e1bee7)",
              color: "#5d4037",
              flexShrink: 0
            }}
          >
            <DiamondOutlinedIcon sx={{ fontSize: 18 }} />
          </Box>

          <Box>
            <Typography
              sx={{
                fontSize: 15,
                fontWeight: 600,
                color: "#5d4037",
                lineHeight: 1.5
              }}
            >
              Custom Jewellery
            </Typography>

            <Typography
              sx={{
                fontSize: 12,
                color: "#8d6e63",
                lineHeight: 1.1
              }}
            >
              Design your own piece
            </Typography>
          </Box>
        </Box>

        {/* Button */}
        <Button
          variant="contained"
          href="/custom-orders"
          LinkComponent={Link}
          sx={{
            borderRadius: "999px",
            minWidth: 70,
            height: 32,
            px: 2,
            fontSize: 12,
            fontWeight: 600,
            textTransform: "none",
            background: "linear-gradient(135deg,#f3e5f5,#e1bee7)",
            color: "#5d4037",
            boxShadow: "none"
          }}
        >
          Order
        </Button>
      </Box>
    </Box>
  );
};

export default OrderBlock;

// import React from "react";
// import { Box, Typography, Button } from "@mui/material";
// import DiamondOutlinedIcon from "@mui/icons-material/DiamondOutlined";
// import Link from "next/link";

// const OrderBlock = () => {
//   return (
//     <Box
//       sx={{
//         px: 1,
//         // boxSizing
//       }}
//     >
//       <Box
//         sx={{
//           borderRadius: 3,
//           px: 1,
//           py: 1.5,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           background: "linear-gradient(135deg,#fff0f6,#ffd6e7)",
//           border: "1px solid #ffd6e7",
//           boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
//         }}
//       >
//         {/* Left content */}
//         <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//           <Box
//             sx={{
//               width: 42,
//               height: 42,
//               borderRadius: "50%",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               background: "linear-gradient(135deg,#f3e5f5,#e1bee7)",
//               color: "#5d4037",
//             }}
//           >
//             <DiamondOutlinedIcon />
//           </Box>

//           <Box>
//             <Typography
//               sx={{
//                 fontSize: 16,
//                 fontWeight: 700,
//                 color: "#5d4037",
//               }}
//             >
//               Custom Jewellery Orders
//             </Typography>

//             <Typography
//               sx={{
//                 fontSize: 13,
//                 color: "#8d6e63",
//               }}
//             >
//               Design your own handcrafted piece
//             </Typography>
//           </Box>
//         </Box>

//         {/* CTA */}
//         <Button
//           variant="contained"
//           href="/custom-orders"
//           LinkComponent={Link}
//           sx={{
//             borderRadius: "999px",
//             px: 3,
//             textTransform: "none",
//             fontWeight: 600,
//             background: "linear-gradient(135deg,#f3e5f5,#e1bee7)",
//             color: "#5d4037",
//             fontSize : {
//               sm: 14,
//               xs:13
//             }
//           }}
//         >
//           Order
//         </Button>
//       </Box>
//     </Box>
//   );
// };

// export default OrderBlock;

import { Box, Skeleton, Button } from '@mui/material';
import Grid from '@mui/material/Grid';
import React from 'react';

const containerStyle = {
  border: '1px solid #e0e0e0',
  borderRadius: '4px',
  padding: '8px 12px',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#fff',
  height: '100%',
  justifyContent: 'center',
};

const labelStyle = {
  fontSize: '0.65rem',
  color: '#9e9e9e',
  textTransform: 'uppercase',
  marginBottom: '2px',
  fontFamily: 'inherit',
  letterSpacing: '0.5px',
  textAlign: 'left',
};

const textSpanStyle = {
  fontSize: '0.85rem',
  fontWeight: 600,
  color: '#333',
  padding: '0',
  fontFamily: 'inherit',
  textAlign: 'left',
};

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
  loadingdata,
  onOpenCustomizer,
}) => {
  const selectedMetalTypeVal = 
    selectMtType || 
    singleProd?.MetalTypePurity || 
    metalTypeCombo?.find((ele) => ele?.Metalid == singleProd?.MetalPurityid || ele?.Metalid == singleProd?.MetalTypeid)?.metaltype || 
    singleProd?.MetalType || 
    singleProd?.metalpurityname || 
    '';

  const selectedMetalColorVal = 
    selectMtColor || 
    singleProd?.MetalColor || 
    metalColorCombo?.find((ele) => ele?.id == singleProd?.MetalColorid || ele?.id == singleProd?.metalcolorid)?.metalcolorname || 
    singleProd?.metalcolorname || 
    singleProd?.colorname || 
    '';

  // Format Diamond quality value (prevents raw "7,14" numbers from flashing)
  const formattedDiaVal = React.useMemo(() => {
    if (selectDiaQc && typeof selectDiaQc === "string") {
      if (/^\d+,\d+$/.test(selectDiaQc)) {
        const [qId, cId] = selectDiaQc.split(",");
        const matched = diaQcCombo?.find((ele) => String(ele?.QualityId) === qId && String(ele?.ColorId) === cId);
        if (matched) {
          return `${matched.Quality},${matched.color}`;
        }
        return ''; // Return empty to trigger Skeleton while combo loads
      }
      if (selectDiaQc !== 'undefined,undefined') {
        return selectDiaQc;
      }
    }
    if (singleProd?.DiaQCname) return singleProd.DiaQCname;
    return '';
  }, [selectDiaQc, diaQcCombo, singleProd]);

  const selectedSizeVal = sizeData || singleProd?.DefaultSize || '';

  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      <Grid container spacing={1}>
        {/* --- METAL TYPE --- */}
        <Grid item size={{ xs: 6, sm: 6 }}>
          <Box sx={containerStyle}>
            <label style={labelStyle}>METAL TYPE:</label>
            {selectedMetalTypeVal ? (
              <span style={textSpanStyle}>{selectedMetalTypeVal}</span>
            ) : (
              <Skeleton variant="text" width={60} height={20} />
            )}
          </Box>
        </Grid>

        {/* --- METAL COLOR --- */}
        <Grid item size={{ xs: 6, sm: 6 }}>
          <Box sx={containerStyle}>
            <label style={labelStyle}>METAL COLOR:</label>
            {selectedMetalColorVal ? (
              <span style={textSpanStyle}>{selectedMetalColorVal}</span>
            ) : (
              <Skeleton variant="text" width={55} height={20} />
            )}
          </Box>
        </Grid>

        {/* --- DIAMOND --- */}
        <Grid item size={{ xs: 6, sm: 6 }}>
          <Box sx={containerStyle}>
            <label style={labelStyle}>DIAMOND:</label>
            {formattedDiaVal ? (
              <span style={textSpanStyle}>{formattedDiaVal}</span>
            ) : (
              <Skeleton variant="text" width={65} height={20} />
            )}
          </Box>
        </Grid>

        {/* --- SIZE --- */}
        {selectedSizeVal && (
          <Grid item size={{ xs: 6, sm: 6 }}>
            <Box sx={containerStyle}>
              <label style={labelStyle}>SIZE:</label>
              <span style={textSpanStyle}>{selectedSizeVal}</span>
            </Box>
          </Grid>
        )}
      </Grid>

      {/* Customize Drawer Button */}
      {onOpenCustomizer && (
        <Button
          fullWidth
          variant="outlined"
          onClick={onOpenCustomizer}
          sx={{
            mt: 1.5,
            py: 1,
            borderRadius: '4px',
            borderColor: '#333333',
            color: '#333333',
            fontWeight: 600,
            fontSize: '13px',
            textTransform: 'none',
            '&:hover': {
              borderColor: '#000000',
              backgroundColor: '#f5f5f5',
            },
          }}
        >
          Customize Design (Metal, Diamond & Size)
        </Button>
      )}
    </Box>
  );
};

export default MaterialCustomization;

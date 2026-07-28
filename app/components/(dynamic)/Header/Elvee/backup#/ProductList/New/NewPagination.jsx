import React from 'react';
import { Box, Pagination, PaginationItem, TextField, Typography } from '@mui/material';

const NewPagination = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  inputPage,
  setInputPage,
  handlePageInputChange,
  maxwidth464px,
  totalPages,
  currPage,
  isShowButton,
}) => {
  const dstCount = totalItems;

  const handleOnChange = (event) => {
    const newValue = event.target.value;
    if (newValue === '' || /^[0-9]+$/.test(newValue)) {
      setInputPage(newValue);
    }
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexWrap="wrap"
      gap={2}
      sx={{
        // borderTop: '1px solid #e5e5e5',
        pt: 2,
        pb: 2.5,
        px: { xs: 1, md: 3 },
      }}
      className="main_pagination_portion"
    >
      {/* Pagination Controls */}
      <Pagination
        count={Math.ceil(dstCount / itemsPerPage)}
        page={currentPage}
        size={maxwidth464px ? 'small' : 'medium'}
        shape="rounded"
        siblingCount={1}
        boundaryCount={1}
        showFirstButton={!!isShowButton}
        showLastButton={!!isShowButton}
        onChange={onPageChange}
        sx={{
          '& .MuiPaginationItem-root': {
            fontSize: '14px',
            borderRadius:4,
            border: '1px solid #e4e4e4',
            color: '#0a1f47',
            fontWeight: 500,
            transition: 'all 0.3s ease',
            minWidth: '38px',
            height: '38px',
            backgroundColor: '#fff',
            boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
            '&.Mui-selected': {
              backgroundColor: '#0a1f47',
              color: '#fff',
              borderColor: '#0a1f47',
              boxShadow: '0 2px 4px rgba(10,31,71,0.15)',
              '&:hover': {
                backgroundColor: '#0a1f47',
              },
            },
            '&:hover': {
              backgroundColor: '#f1f3f8',
              borderColor: '#b6b6b6',
            },
          },
        }}
        renderItem={(item) => (
          <PaginationItem
            {...item}
            sx={{
              pointerEvents: item.page === currentPage ? 'none' : 'auto',
            }}
          />
        )}
      />

      {/* Editable "Go to Page" Input */}
      <Box
        className="main_editable_pagination"
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.2,
          borderLeft: '1px solid #ddd',
          pl: { xs: 1.2, sm: 2 },
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: '#0a1f47',
            fontWeight: 500,
            letterSpacing: '0.3px',
            fontSize: '14px',
          }}
        >
          Go to page:
        </Typography>

        <TextField
          type="text"
          autoComplete="off"
          value={inputPage}
          onBlur={() => {
            if (!inputPage) setInputPage(currPage);
          }}
          onChange={handleOnChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && inputPage !== '') {
              handlePageInputChange(e);
            } else if (e.key === 'Enter' && inputPage === '') {
              setInputPage(currPage);
            }
          }}
          inputProps={{
            min: 1,
            max: totalPages,
            style: {
              textAlign: 'center',
              fontSize: '14px',
              fontWeight: 500,
              color: '#0a1f47',
            },
          }}
          variant="outlined"
          sx={{
            width: 64,
            '& .MuiOutlinedInput-root': {
              height: 36,
              backgroundColor: '#fff',
              borderRadius: '12px',
              transition: 'all 0.3s ease',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              '& fieldset': {
                borderColor: '#b6b6b6',
              },
              '&:hover fieldset': {
                borderColor: '#927038',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#0a1f47',
              },
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default NewPagination;

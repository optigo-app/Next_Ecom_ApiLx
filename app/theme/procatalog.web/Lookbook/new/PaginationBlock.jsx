import EditablePagination from "@/app/components/EditablePagination/EditablePagination";
import React from "react";
import { PaginationItem } from "@mui/material";
import MuiPagination from "@mui/material/Pagination";

const PaginationBlock = ({ isEditablePage, storeInit, dstCount, itemsPerPage, handelPageChange, inputPage, setInputPage, handlePageInputChange, maxwidth464px, totalPages, currentPage }) => {
  return (
    <>
      {isEditablePage === 1 ? (
        <>
          {storeInit?.IsProductListPagination == 1 && Math.ceil(dstCount / itemsPerPage) > 1 && (
            <div className="lpDiv">
              <EditablePagination currentPage={currentPage} totalItems={dstCount} itemsPerPage={itemsPerPage} onPageChange={handelPageChange} inputPage={inputPage} setInputPage={setInputPage} handlePageInputChange={handlePageInputChange} maxwidth464px={maxwidth464px} totalPages={totalPages} currPage={currentPage} isShowButton={false} />
            </div>
          )}
        </>
      ) : (
        <>
          {storeInit?.IsProductListPagination == 1 && Math.ceil(dstCount / itemsPerPage) > 1 && (
            <div className="lpDiv">
              <MuiPagination
                count={Math.ceil(dstCount / itemsPerPage)}
                size={maxwidth464px ? "small" : "large"}
                shape="circular"
                onChange={handelPageChange}
                page={currentPage}
                // showFirstButton
                // showLastButton
                renderItem={(item) => (
                  <PaginationItem
                    {...item}
                    sx={{
                      pointerEvents: item.page === currentPage ? "none" : "auto",
                    }}
                  />
                )}
              />
            </div>
          )}
        </>
      )}
    </>
  );
};

export default PaginationBlock;

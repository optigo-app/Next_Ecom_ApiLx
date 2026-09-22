import React, { useEffect, useState } from 'react';
import Modal from '@mui/material/Modal';
import { IconButton, Typography, Grid, Accordion, AccordionSummary, AccordionDetails, Card, CardContent, Divider, CardMedia, CardActionArea, FormControl, InputLabel, Select, MenuItem, Checkbox, CardActions, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import './elv_cartPage.scss';



const FilterAccordion = ({ title, items, checkedItems, handleCheckboxChange }) => {
  return (
    <Accordion className='smr_cart-Accordion' style={{ boxShadow: 'none', border: 'none' }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} style={{ padding: '0' }}>
        <Typography className='smr_FilterTitle'>{title}</Typography>
      </AccordionSummary>
      <AccordionDetails className='smr_filterAccordianDetail' style={{ padding: '0' }}>
        {items.map(item => (
          <div className='smr_filter-AccrodianDetails' key={item.id}>
            <Typography className='smr_filterAccordianDeatilTitle'>{item.name}</Typography>
            <Checkbox
              checked={checkedItems[title]?.[item.id] || false}
              onChange={() => handleCheckboxChange(item.id, title)}
              className='smr_filterCheckbox'
            />
          </div>
        ))}
      </AccordionDetails>
    </Accordion>
  );
};

const generateFilterAccordions = (filters, checkedItems, handleCheckboxChange) => {
  return Object.entries(filters).map(([category, items]) => (
    <FilterAccordion
      key={category}
      title={category}
      items={items}
      checkedItems={checkedItems}
      handleCheckboxChange={handleCheckboxChange}
    />
  ));
};


const MyModal = ({ open, onClose, selectedItems, onRemove, onUpdateCart, onCancelCart }) => {
  const [checkedItems, setCheckedItems] = useState({});
  const [metalTypeCombo, setMetalTypeCombo] = useState([]);
  const [metalColorCombo, setMetalColorCombo] = useState([]);
  const [ColorStoneCombo, setColorStoneCombo] = useState([]);
  const [diamondQualityColorCombo, setDiamondQualityColorCombo] = useState([]);
  const [sizeCombo, setSizeCombo] = useState([]);

  const handleCheckboxChange = (itemId, category) => {
    setCheckedItems(prevCheckedItems => ({
      ...prevCheckedItems,
      [category]: {
        ...(prevCheckedItems[category] || {}),
        [itemId]: !prevCheckedItems[category]?.[itemId],
        "checked": !prevCheckedItems[category]?.[itemId],
        "type": category,
        "value": itemId
      },
    }));
  };


  const filteredItems = selectedItems.filter(item => {
    return Object.keys(checkedItems).every(key => {
      const filter = checkedItems[key];
      if (!filter.checked) return true;
      return item[filter.type] === filter.value;
    });
  });

  let filterArr = {}
  function getUniqueValues(array, key) {
    return [...new Set(array.map(item => item[key]))];
  }

  const categories = getUniqueValues(selectedItems, 'CategoryName').map(category => ({
    id: selectedItems.find(item => item.CategoryName === category).Categoryid,
    name: category
  }));

  const collections = getUniqueValues(selectedItems, 'CollectionName').map(collection => ({
    id: selectedItems.find(item => item.CollectionName === collection).Collectionid,
    name: collection
  }));

  const subcategories = getUniqueValues(selectedItems, 'SubCategoryName').map(subcategory => ({
    id: selectedItems.find(item => item.SubCategoryName === subcategory).SubCategoryid,
    name: subcategory
  }));

  const genders = getUniqueValues(selectedItems, 'GenderName').map(gender => ({
    id: selectedItems.find(item => item.GenderName === gender).Genderid,
    name: gender
  }));

  filterArr.Categoryid = categories;
  filterArr.Collectionid = collections;
  filterArr.SubCategoryid = subcategories;
  filterArr.Genderid = genders
  // for Short-combo data
  useEffect(() => {
    const metalTypeData = JSON.parse(sessionStorage.getItem('metalTypeCombo'));
    const metalColorData = JSON.parse(sessionStorage.getItem('MetalColorCombo'));
    const diamondQtyColorData = JSON.parse(sessionStorage.getItem('diamondQualityColorCombo'));
    const CSQtyColorData = JSON.parse(sessionStorage.getItem('ColorStoneQualityColorCombo'));
    setMetalTypeCombo(metalTypeData);
    setMetalColorCombo(metalColorData);
    setDiamondQualityColorCombo(diamondQtyColorData);
    setColorStoneCombo(CSQtyColorData);
  }, [])

  return (
    <Modal
      className="smr_modal"
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"

    >
      <div className="smr_paper">
        <div className='smr_Modal_Title'>
          <Typography className='smr_Modal_TitleTypo' variant="h5" id="modal-title" gutterBottom>
            Update Cart
          </Typography>
          <IconButton className="smr_closeIcon" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>
        <Divider />
        <div className='smr_cartmodal_body'>
          <div>
            <div className="smr_ShortCutCombo-section">
              <div>
                <FormControl className="form-control">
                  <InputLabel id="metalTypeMaster">Metal Type</InputLabel>
                  <Select
                    labelId="metalTypeMaster"
                    id="metalTypeMaster"
                    label="Metal Type"
                  >
                    {metalTypeCombo.map(option => (
                      <MenuItem key={option.Metalid} value={option.metaltype}>
                        {option.metaltype}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div>
                <FormControl className="form-control">
                  <InputLabel id="metalColorMaster">Metal Color</InputLabel>
                  <Select
                    labelId="metalColorMaster"
                    id="metalColorMaster"
                    label="Metal Color"
                  >
                    {metalColorCombo.map(option => (
                      <MenuItem key={option.id} value={option.colorname}>
                        {option.colorname}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div>
                <FormControl className="form-control">
                  <InputLabel id="diamondMaster">Diamond</InputLabel>
                  <Select
                    labelId="diamondMaster"
                    id="diamondMaster"
                    label="Diamond"
                  >
                    {diamondQualityColorCombo.map(option => (
                      <MenuItem key={option?.ColorId + ',' + option?.QualityId} value={option?.Quality+'#'+ option?.color}>
                        {option?.Quality+'#'+ option?.color}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div>
                <FormControl className="form-control">
                  <InputLabel id="sizeMaster">Size</InputLabel>
                  <Select
                    labelId="sizeMaster"
                    id="sizeMaster"
                    label="Size"
                  >
                    <MenuItem value="">Diamond</MenuItem>
                    <MenuItem value="1">Option 1</MenuItem>
                    <MenuItem value="2">Option 2</MenuItem>
                    <MenuItem value="3">Option 3</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>
          </div>
          <div className='smr_cartModal-Divider'>
            <Divider />
          </div>
          <Grid container spacing={2}>
            <Grid item xs={6} md={3}>
              <div className='smr_Modal-FilterList'>
                {generateFilterAccordions(filterArr, checkedItems, handleCheckboxChange)}
              </div>
            </Grid>
            <Grid item xs={6} md={9}>
              <div className='smr_Modal-cardList'>
                <Grid container spacing={2}>
                  {filteredItems?.map(product => (
                    <Grid item key={product.id} xs={12} sm={4} md={4}>
                      <Card className='smr_cartListCard' sx={{ maxWidth: 250, position: 'relative' }}>
                        <CardActionArea>
                          <CardMedia
                            component="img"
                            image={"https://cdnfs.optigoapps.com/content-global3/astoreCNARMLXHPFKS6TIY1/Design_Image/boKJ1XRq3zMDAwMzg4Mw==/Red_Thumb/0003883_08052024153602887.png"}
                            alt={product?.TitleLine}
                            className='smr_cartListImage'
                          />
                          <CardContent>
                            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                              <div>
                                <Typography variant="body2" className='smr_card-ContentData'>
                                  NWT: {product?.netwt}
                                </Typography>
                                <Typography variant="body2" className='smr_card-ContentData'>
                                  DWT: {product?.dwt}
                                </Typography>
                              </div>
                              <div>
                                <Typography variant="body2" className='smr_card-ContentData'>
                                  CWT: {product?.cwt}
                                </Typography>
                                <Typography variant="body2" className='smr_card-ContentData'>
                                  GWT: {product?.gwt}
                                </Typography>
                              </div>
                            </div>
                            <div className='designNocartList'>
                              <p className='smr_DesignNoTExt'>{product?.designno}</p>
                            </div>
                            <div className='closeCartIconDiv'>
                              <CloseIcon className='closeCartIcon' onClick={(e) => { e.stopPropagation(); onRemove(product); }} />
                            </div>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </div>
            </Grid>
          </Grid>
          <Divider sx={{ margin: '10px 0px' }} />
          <CardActions className='smr_projectUpdateCartBtn-group'>
            <div className="smr_projectUpdateCartBtn-group">
              <button className="smr_cartUpdate-btn" onClick={() => onUpdateCart(filteredItems)}>
                Update
              </button>
              <button className="smr_cartCancel-btn" onClick={onCancelCart}>
                Cancel
              </button>
            </div>
          </CardActions>
        </div>
      </div>
    </Modal>
  );
};

export default MyModal;

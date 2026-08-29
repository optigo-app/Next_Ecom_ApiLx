"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Divider,
  Input,
  Slider,
  Stack,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";
import ProductListApi from "@/app/(core)/utils/API/ProductListAPI/ProductListApi";
import { FilterListAPI } from "@/app/(core)/utils/API/FilterAPI/FilterListAPI";

export const resetRangeFilter = async ({
  filterName,
  setSliderValue,
  setTempSliderValue,
  handleRangeFilterApi,
  prodListType,
  cookie,
  setIsShowBtn,
  show,
  setShow,
  setAppliedRange,
}) => {
  try {
    const res1 = await FilterListAPI(prodListType, cookie);
    const optionsRaw = res1?.find((f) => f?.Name === filterName)?.options;

    if (optionsRaw) {
      const { Min = 0, Max = 100 } = JSON.parse(optionsRaw)?.[0] || {};
      const resetValue = [Min, Max];
      setSliderValue(resetValue);
      setTempSliderValue(resetValue);
      handleRangeFilterApi("");
      setAppliedRange(["", ""]);
      setIsShowBtn?.(false);
      if (show) setShow(false);
    }
  } catch (error) {
    console.error(`Failed to reset filter "${filterName}":`, error);
  }
};

export const RangeFilterView = ({
  ele,
  sliderValue,
  setSliderValue,
  handleRangeFilterApi,
  prodListType,
  cookie,
  setShow,
  show,
  setAppliedRange1,
  appliedRange1,
}) => {
  const parsedOptions = JSON.parse(ele?.options || "[]")?.[0] || {};
  const min = Number(parsedOptions.Min || 0);
  const max = Number(parsedOptions.Max || 100);
  const [tempSliderValue, setTempSliderValue] = useState(sliderValue);
  const [isShowBtn, setIsShowBtn] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current = tempSliderValue.map(
      (_, i) => inputRefs.current[i] ?? React.createRef()
    );
  }, [tempSliderValue]);

  const handleKeyDown = (index) => (e) => {
    if (e.key === "Enter") {
      if (index < tempSliderValue.length - 1) {
        inputRefs.current[index + 1]?.current?.focus();
      } else {
        handleSave();
      }
    }
  };

  useEffect(() => {
    if (Array.isArray(sliderValue) && sliderValue.length === 2) {
      setTempSliderValue(sliderValue);
    }
  }, [sliderValue]);

  const handleInputChange = (index) => (event) => {
    const value = event.target.value === "" ? "" : Number(event.target.value);
    const updated = [...tempSliderValue];
    updated[index] = value;
    setTempSliderValue(updated);
    setIsShowBtn(updated[0] !== sliderValue[0] || updated[1] !== sliderValue[1]);
  };

  const handleSliderChange = (_, newValue) => {
    setTempSliderValue(newValue);
    setIsShowBtn(newValue[0] !== sliderValue[0] || newValue[1] !== sliderValue[1]);
  };

  const handleSave = () => {
    const [minDiaWt, maxDiaWt] = tempSliderValue;

    if (minDiaWt == null || maxDiaWt == null || minDiaWt === "" || maxDiaWt === "") {
      toast.error("Please enter valid range values.", {
        hideProgressBar: true,
        duration: 5000,
      });
      return;
    }
    if (isNaN(minDiaWt) || isNaN(maxDiaWt)) {
      toast.error("Please enter valid range values.", {
        hideProgressBar: true,
        duration: 5000,
      });
      return;
    }
    if (minDiaWt < 0 || maxDiaWt < 0) {
      toast.error("Please enter valid range values.", {
        hideProgressBar: true,
        duration: 5000,
      });
      return;
    }
    if (Number(minDiaWt) === Number(maxDiaWt)) {
      toast.error("Please enter valid range values.", {
        hideProgressBar: true,
        duration: 5000,
      });
      return;
    }
    if (Number(minDiaWt) > Number(maxDiaWt)) {
      toast.error("Please enter valid range values.", {
        hideProgressBar: true,
        duration: 5000,
      });
      return;
    }
    if (minDiaWt < min) {
      toast.error("Please enter valid range values.", {
        hideProgressBar: true,
        duration: 5000,
      });
      return;
    }
    if (maxDiaWt > max) {
      toast.error("Please enter valid range values.", {
        hideProgressBar: true,
        duration: 5000,
      });
      return;
    }

    setSliderValue(tempSliderValue);
    setTempSliderValue(tempSliderValue);
    handleRangeFilterApi(tempSliderValue);
    setIsShowBtn(false);
    setAppliedRange1([min, max]);
    setShow(true);
  };

  return (
    <div style={{ position: "relative" }}>
      {appliedRange1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "4px",
            position: "absolute",
            top: "-12px",
            width: "100%",
          }}
        >
          <Typography variant="caption" color="text.secondary" fontSize="11px">
            {appliedRange1[0] !== "" ? `Min: ${appliedRange1[0]}` : ""}
          </Typography>
          <Typography variant="caption" color="text.secondary" fontSize="11px">
            {appliedRange1[1] !== "" ? `Max: ${appliedRange1[1]}` : ""}
          </Typography>
        </div>
      )}

      <Slider
        value={tempSliderValue}
        onChange={handleSliderChange}
        min={min}
        max={max}
        step={0.001}
        disableSwap
        valueLabelDisplay="off"
        sx={{ marginTop: 1, transition: "all 0.2s ease-out" }}
      />

      <div style={{ display: "flex", gap: "10px", justifyContent: "space-around" }}>
        {tempSliderValue.map((val, index) => (
          <Input
            key={index}
            value={val}
            inputRef={inputRefs.current[index]}
            onKeyDown={handleKeyDown(index)}
            onChange={handleInputChange(index)}
            inputProps={{ step: 0.001, min, max, type: "number" }}
            sx={{
              textAlign: "center",
              display: "flex",
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px",
              color: "#111",
              border: "1px solid #d3d3d3",
              borderRadius: 0,
              padding: "6px 10px",
              transition: "border-color 0.2s ease",
              "&:hover": { borderColor: "#c0c0c0" },
              "&.Mui-focused": { borderColor: "#000" },
              "& input": { textAlign: "center" },
            }}
          />
        ))}
      </div>

      <Stack direction="row" justifyContent="flex-end" gap={1} mt={1}>
        {show && (
          <Button
            variant="outlined"
            sx={{ paddingBottom: "0" }}
            onClick={() =>
              resetRangeFilter({
                filterName: "Diamond",
                setSliderValue,
                setTempSliderValue,
                handleRangeFilterApi,
                prodListType,
                cookie,
                setIsShowBtn,
                show,
                setShow,
                setAppliedRange: setAppliedRange1,
              })
            }
            color="error"
          >
            Reset
          </Button>
        )}
        {isShowBtn && (
          <Button variant="outlined" sx={{ paddingBottom: "0" }} onClick={handleSave} color="success">
            Apply
          </Button>
        )}
      </Stack>
    </div>
  );
};

export const RangeFilterView1 = ({
  ele,
  sliderValue1,
  setSliderValue1,
  handleRangeFilterApi1,
  prodListType,
  cookie,
  show1,
  setShow1,
  setAppliedRange2,
  appliedRange2,
}) => {
  const parsedOptions = JSON.parse(ele?.options || "[]")?.[0] || {};
  const min = parsedOptions.Min || "";
  const max = parsedOptions.Max || "";
  const [tempSliderValue, setTempSliderValue] = useState(sliderValue1);
  const [isShowBtn, setIsShowBtn] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current = tempSliderValue.map(
      (_, i) => inputRefs.current[i] ?? React.createRef()
    );
  }, [tempSliderValue]);

  const handleKeyDown = (index) => (e) => {
    if (e.key === "Enter") {
      if (index < tempSliderValue.length - 1) {
        inputRefs.current[index + 1]?.current?.focus();
      } else {
        handleSave();
      }
    }
  };

  useEffect(() => {
    if (Array.isArray(sliderValue1) && sliderValue1.length === 2) {
      setTempSliderValue(sliderValue1);
    }
  }, [sliderValue1]);

  const handleInputChange = (index) => (event) => {
    const newValue = event.target.value === "" ? "" : Number(event.target.value);
    const updated = [...tempSliderValue];
    updated[index] = newValue;
    setTempSliderValue(updated);
    setIsShowBtn(updated[0] !== sliderValue1[0] || updated[1] !== sliderValue1[1]);
  };

  const handleSliderChange = (_, newValue) => {
    setTempSliderValue(newValue);
    setIsShowBtn(newValue[0] !== sliderValue1[0] || newValue[1] !== sliderValue1[1]);
  };

  const handleSave = () => {
    const [minNetWt, maxNetWt] = tempSliderValue;

    if (minNetWt == null || maxNetWt == null || minNetWt === "" || maxNetWt === "") {
      toast.error("Please enter valid range values.", {
        hideProgressBar: true,
        duration: 5000,
      });
      return;
    }
    if (isNaN(minNetWt) || isNaN(maxNetWt)) {
      toast.error("Please enter valid range values.", {
        hideProgressBar: true,
        duration: 5000,
      });
      return;
    }
    if (minNetWt < 0 || maxNetWt < 0) {
      toast.error("Please enter valid range values.", {
        hideProgressBar: true,
        duration: 5000,
      });
      return;
    }
    if (Number(minNetWt) === Number(maxNetWt)) {
      toast.error("Please enter valid range values.", {
        hideProgressBar: true,
        duration: 5000,
      });
      return;
    }
    if (Number(minNetWt) > Number(maxNetWt)) {
      toast.error("Please enter valid range values.", {
        hideProgressBar: true,
        duration: 5000,
      });
      return;
    }
    if (minNetWt < min) {
      toast.error("Please enter valid range values.", {
        hideProgressBar: true,
        duration: 5000,
      });
      return;
    }
    if (maxNetWt > max) {
      toast.error("Please enter valid range values.", {
        hideProgressBar: true,
        duration: 5000,
      });
      return;
    }

    setSliderValue1(tempSliderValue);
    setTempSliderValue(tempSliderValue);
    handleRangeFilterApi1(tempSliderValue);
    setAppliedRange2([min, max]);
    setIsShowBtn(false);
    setShow1(true);
  };

  return (
    <div style={{ position: "relative" }}>
      {appliedRange2 && (
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px", position: "absolute", top: "-12px", width: "100%" }}>
          <Typography variant="caption" color="text.secondary" fontSize="11px">
            {appliedRange2[0] !== "" ? `Min: ${appliedRange2[0]}` : ""}
          </Typography>
          <Typography variant="caption" color="text.secondary" fontSize="11px">
            {appliedRange2[1] !== "" ? `Max: ${appliedRange2[1]}` : ""}
          </Typography>
        </div>
      )}

      <Slider
        value={tempSliderValue}
        onChange={handleSliderChange}
        valueLabelDisplay="off"
        min={min}
        max={max}
        step={0.001}
        disableSwap
        sx={{
          marginTop: "5px",
          transition: "all 0.2s ease-out",
          "& .MuiSlider-valueLabel": { display: "none" },
        }}
      />
      <div style={{ display: "flex", gap: "10px", justifyContent: "space-around" }}>
        {tempSliderValue.map((val, index) => (
          <Input
            key={index}
            inputRef={inputRefs.current[index]}
            onKeyDown={handleKeyDown(index)}
            value={val}
            onChange={handleInputChange(index)}
            inputProps={{ step: 0.001, min, max, type: "number" }}
            sx={{
              textAlign: "center",
              display: "flex",
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px",
              color: "#111",
              border: "1px solid #d3d3d3",
              borderRadius: 0,
              padding: "6px 10px",
              transition: "border-color 0.2s ease",
              "&:hover": { borderColor: "#c0c0c0" },
              "&.Mui-focused": { borderColor: "#000" },
              "& input": { textAlign: "center" },
            }}
          />
        ))}
      </div>
      <Stack flexDirection="row" justifyContent="flex-end" gap={1} mt={1}>
        {show1 && (
          <Button
            variant="outlined"
            sx={{ paddingBottom: "0" }}
            onClick={() =>
              resetRangeFilter({
                filterName: "NetWt",
                setSliderValue: setSliderValue1,
                setTempSliderValue,
                handleRangeFilterApi: handleRangeFilterApi1,
                prodListType,
                cookie,
                setIsShowBtn,
                show: show1,
                setShow: setShow1,
                setAppliedRange: setAppliedRange2,
              })
            }
            color="error"
          >
            Reset
          </Button>
        )}
        {isShowBtn && (
          <Button variant="outlined" sx={{ paddingBottom: "0" }} onClick={handleSave} color="success">
            Apply
          </Button>
        )}
      </Stack>
    </div>
  );
};

export const RangeFilterView2 = ({
  ele,
  sliderValue2,
  setSliderValue2,
  handleRangeFilterApi2,
  prodListType,
  cookie,
  show2,
  setShow2,
  setAppliedRange3,
  appliedRange3,
}) => {
  const parsedOptions = JSON.parse(ele?.options || "[]")?.[0] || {};
  const min = parsedOptions.Min ?? "";
  const max = parsedOptions.Max ?? "";
  const [tempSliderValue, setTempSliderValue] = useState(sliderValue2);
  const [isShowBtn, setIsShowBtn] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current = tempSliderValue.map(
      (_, i) => inputRefs.current[i] ?? React.createRef()
    );
  }, [tempSliderValue]);

  const handleKeyDown = (index) => (e) => {
    if (e.key === "Enter") {
      if (index < tempSliderValue.length - 1) {
        inputRefs.current[index + 1]?.current?.focus();
      } else {
        handleSave();
      }
    }
  };

  useEffect(() => {
    if (Array.isArray(sliderValue2) && sliderValue2.length === 2) {
      setTempSliderValue(sliderValue2);
    }
  }, [sliderValue2]);

  const handleInputChange = (index) => (event) => {
    const newValue = event.target.value === "" ? "" : Number(event.target.value);
    const updated = [...tempSliderValue];
    updated[index] = newValue;
    setTempSliderValue(updated);
    setIsShowBtn(updated[0] !== sliderValue2[0] || updated[1] !== sliderValue2[1]);
  };

  const handleSliderChange = (_, newValue) => {
    setTempSliderValue(newValue);
    setIsShowBtn(newValue[0] !== sliderValue2[0] || newValue[1] !== sliderValue2[1]);
  };

  const handleSave = () => {
    const [minWeight, maxWeight] = tempSliderValue;

    if (minWeight == null || maxWeight == null || minWeight === "" || maxWeight === "") {
      toast.error("Please enter valid range values.", {
        hideProgressBar: true,
        duration: 5000,
      });
      return;
    }
    if (isNaN(minWeight) || isNaN(maxWeight)) {
      toast.error("Please enter valid range values.", {
        hideProgressBar: true,
        duration: 5000,
      });
      return;
    }
    if (minWeight < 0 || maxWeight < 0) {
      toast.error("Please enter valid range values.", {
        hideProgressBar: true,
        duration: 5000,
      });
      return;
    }
    if (Number(minWeight) === Number(maxWeight)) {
      toast.error("Please enter valid range values.", {
        hideProgressBar: true,
        duration: 5000,
      });
      return;
    }
    if (Number(minWeight) > Number(maxWeight)) {
      toast.error("Please enter valid range values.", {
        hideProgressBar: true,
        duration: 5000,
      });
      return;
    }
    if (minWeight < min) {
      toast.error("Please enter valid range values.", {
        hideProgressBar: true,
        duration: 5000,
      });
      return;
    }
    if (maxWeight > max) {
      toast.error("Please enter valid range values.", {
        hideProgressBar: true,
        duration: 5000,
      });
      return;
    }

    setSliderValue2(tempSliderValue);
    setTempSliderValue(tempSliderValue);
    handleRangeFilterApi2(tempSliderValue);
    setAppliedRange3([min, max]);
    setIsShowBtn(false);
    setShow2(true);
  };

  return (
    <div style={{ position: "relative" }}>
      {appliedRange3 && (
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px", position: "absolute", top: "-12px", width: "100%" }}>
          <Typography variant="caption" color="text.secondary" fontSize="11px">
            {appliedRange3[0] !== "" ? `Min: ${appliedRange3[0]}` : ""}
          </Typography>
          <Typography variant="caption" color="text.secondary" fontSize="11px">
            {appliedRange3[1] !== "" ? `Max: ${appliedRange3[1]}` : ""}
          </Typography>
        </div>
      )}

      <Slider
        value={tempSliderValue}
        onChange={handleSliderChange}
        valueLabelDisplay="off"
        min={min}
        max={max}
        step={0.001}
        disableSwap
        sx={{
          marginTop: "5px",
          transition: "all 0.2s ease-out",
          "& .MuiSlider-valueLabel": { display: "none" },
        }}
      />

      <div style={{ display: "flex", gap: "10px", justifyContent: "space-around" }}>
        {tempSliderValue.map((val, index) => (
          <Input
            key={index}
            inputRef={inputRefs.current[index]}
            value={val}
            onKeyDown={handleKeyDown(index)}
            onChange={handleInputChange(index)}
            inputProps={{ step: 0.001, type: "number" }}
            sx={{
              textAlign: "center",
              display: "flex",
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px",
              color: "#111",
              border: "1px solid #d3d3d3",
              borderRadius: 0,
              padding: "6px 10px",
              transition: "border-color 0.2s ease",
              "&:hover": { borderColor: "#c0c0c0" },
              "&.Mui-focused": { borderColor: "#000" },
              "& input": { textAlign: "center" },
            }}
          />
        ))}
      </div>

      <Stack direction="row" justifyContent="flex-end" gap={1} mt={1}>
        {show2 && (
          <Button
            variant="outlined"
            sx={{ paddingBottom: "0" }}
            onClick={() =>
              resetRangeFilter({
                filterName: "Gross",
                setSliderValue: setSliderValue2,
                setTempSliderValue,
                handleRangeFilterApi: handleRangeFilterApi2,
                prodListType,
                cookie,
                setIsShowBtn,
                show: show2,
                setShow: setShow2,
                setAppliedRange: setAppliedRange3,
              })
            }
            color="error"
          >
            Reset
          </Button>
        )}
        {isShowBtn && (
          <Button variant="outlined" sx={{ paddingBottom: "0" }} onClick={handleSave} color="success">
            Apply
          </Button>
        )}
      </Stack>
    </div>
  );
};

export const PriceRangeInputs = ({
  priceValue,
  setpriceValue,
  lowestPrice,
  highestPrice,
  setLowestPrice,
  setHighestPrice,
  setProductListData,
  setAfterFilterCount,
  setPriceRangeValue,
  setIsOnlyProdLoading,
  selectedMetalId,
  selectedDiaId,
  selectedCsId,
  prodListType,
  cookie,
  filterChecked = {},
  isReset,
  setIsReset,
}) => {
  const [initialPriceValue] = useState(priceValue);
  const [tempPriceRange, setTempPriceRange] = useState(priceValue);
  const [isShowBtn, setIsShowBtn] = useState(false);
  const secondInputRef = useRef(null);

  const handleFirstKeyDown = (e) => {
    if (e.key === "Enter") {
      secondInputRef.current?.focus();
    }
  };

  const handleSecondKeyDown = (e) => {
    if (e.key === "Enter") {
      handleApply();
    }
  };

  useEffect(() => {
    const hasPriceChecked = Object.values(filterChecked).some(
      (item) => item.type === "Price" && item.checked
    );
    if (hasPriceChecked) {
      setTempPriceRange(priceValue);
    }
  }, [filterChecked]);

  const handlePriceRangeChange = (index) => (event) => {
    const value = event.target.value === "" ? "" : Number(event.target.value);
    const updatedRange = [...tempPriceRange];
    updatedRange[index] = value;
    setTempPriceRange(updatedRange);
    setIsShowBtn(
      updatedRange[0] !== initialPriceValue[0] ||
        updatedRange[1] !== initialPriceValue[1]
    );
  };

  const handleApply = async () => {
    const [min, max] = tempPriceRange;

    if (min == null || max == null || min === "" || max === "") {
      toast.error("Please enter valid range values.", {
        hideProgressBar: true,
        duration: 5000,
      });
      return;
    }
    if (isNaN(min) || isNaN(max)) {
      toast.error("Please enter valid range values.", {
        hideProgressBar: true,
        duration: 5000,
      });
      return;
    }
    if (min < 0 || max < 0) {
      toast.error("Please enter valid range values.", {
        hideProgressBar: true,
        duration: 5000,
      });
      return;
    }
    if (Number(min) > Number(max) || Number(min) === Number(max)) {
      toast.error("Please enter valid range values.", {
        hideProgressBar: true,
        duration: 5000,
      });
      return;
    }

    setPriceRangeValue(tempPriceRange);
    setIsShowBtn(false);
    setIsOnlyProdLoading(true);
    setIsReset(true);

    let output = {};
    const inputPriceField =
      JSON.stringify(tempPriceRange) !== JSON.stringify(["", ""]);

    if (inputPriceField) {
      output = { PriceMin: min, PriceMax: max };
    }

    const obj = { mt: selectedMetalId, dia: selectedDiaId, cs: selectedCsId };

    try {
      const res = await ProductListApi(
        output,
        1,
        obj,
        prodListType,
        cookie,
        "Recommended"
      );
      if (res) {
        setProductListData(res?.pdList);
        setAfterFilterCount(res?.pdResp?.rd1[0]?.designcount);
      }
    } catch (error) {
      console.error("Price range apply failed:", error);
    } finally {
      setIsOnlyProdLoading(false);
    }

    if (typeof window !== "undefined") {
      window.scroll({ top: 0, behavior: "smooth" });
    }
  };

  const handleReset = async () => {
    setIsShowBtn(false);
    setIsOnlyProdLoading(true);
    setIsReset(false);
    const obj = { mt: selectedMetalId, dia: selectedDiaId, cs: selectedCsId };

    try {
      const res = await ProductListApi(
        {},
        1,
        obj,
        prodListType,
        cookie,
        "Recommended"
      );
      if (res) {
        const productList = res?.pdList || [];
        setProductListData(productList);
        setAfterFilterCount(res?.pdResp?.rd1[0]?.designcount);

        setTempPriceRange(["", ""]);
        setPriceRangeValue(["", ""]);
      }
    } catch (error) {
      console.error("Price range reset failed:", error);
    } finally {
      setIsOnlyProdLoading(false);
    }

    if (typeof window !== "undefined") {
      window.scroll({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <Box
      sx={{
        border: "1px solid #ddd",
        borderRadius: 2,
        padding: 2,
        width: "100%",
      }}
    >
      <Typography variant="subtitle1" fontWeight={600} mb={1}>
        Price Range
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Stack
        direction="row"
        spacing={2}
        justifyContent="space-between"
        alignItems="center"
      >
        <Box sx={{ flex: 1 }}>
          <Typography variant="caption" color="text.secondary" mb={0.5}>
            Min Price
          </Typography>
          <Input
            fullWidth
            value={tempPriceRange[0]}
            onWheel={(e) => e.target.blur()}
            onChange={handlePriceRangeChange(0)}
            onKeyDown={handleFirstKeyDown}
            inputProps={{
              type: "number",
              style: { MozAppearance: "textfield" },
            }}
            sx={{
              "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                { WebkitAppearance: "none", margin: 0 },
            }}
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="caption" color="text.secondary" mb={0.5}>
            Max Price
          </Typography>
          <Input
            fullWidth
            inputRef={secondInputRef}
            value={tempPriceRange[1]}
            onWheel={(e) => e.target.blur()}
            onChange={handlePriceRangeChange(1)}
            onKeyDown={handleSecondKeyDown}
            inputProps={{
              type: "number",
              style: { MozAppearance: "textfield" },
            }}
            sx={{
              "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                { WebkitAppearance: "none", margin: 0 },
            }}
          />
        </Box>
      </Stack>

      <Stack direction="row" justifyContent="flex-end" mt={1} spacing={1}>
        {isReset && (
          <Button variant="outlined" onClick={handleReset} color="error">
            Reset
          </Button>
        )}
        {isShowBtn && (
          <Button variant="outlined" onClick={handleApply} color="success">
            Apply
          </Button>
        )}
      </Stack>
    </Box>
  );
};

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Slider, Input, Stack, Button, Typography } from "@mui/material";
import { toast } from "react-toastify";
import { FilterListAPI } from "@/app/(core)/utils/API/FilterAPI/FilterListAPI";

const RangeViewFilter = ({
    ele,
    sliderValue,
    setSliderValue,
    handleRangeFilterApi,
    prodListType,
    cookie,
    show,
    setShow,
    appliedRange,
    setAppliedRange,
    filterKey, // "Diamond" | "NetWt" | "Gross"
    apiPosition = 0, // 0 => first, 1 => second, 2 => third
    resetRangeFilter,
}) => {
    const parsedOptions = JSON.parse(ele?.options || "[]")?.[0] || {};
    const min = Number(parsedOptions.Min ?? 0);
    const max = Number(parsedOptions.Max ?? 100);

    const [tempSliderValue, setTempSliderValue] = useState(sliderValue);
    const [isShowBtn, setIsShowBtn] = useState(false);
    const inputRefs = useRef([]);

    // keep refs length equal to values length
    useEffect(() => {
        inputRefs.current = tempSliderValue.map(
            (_, i) => inputRefs.current[i] ?? React.createRef()
        );
    }, [tempSliderValue]);

    // sync when parent updates
    useEffect(() => {
        if (Array.isArray(sliderValue) && sliderValue.length === 2) {
            setTempSliderValue(sliderValue);
        }
    }, [sliderValue]);

    const handleInputChange = useCallback(
        (index) => (e) => {
            const val = e.target.value === "" ? "" : Number(e.target.value);
            const updated = [...tempSliderValue];
            updated[index] = val;
            setTempSliderValue(updated);
            setIsShowBtn(
                updated[0] !== sliderValue[0] || updated[1] !== sliderValue[1]
            );
        },
        [tempSliderValue, sliderValue]
    );

    const handleSliderChange = useCallback(
        (_, newValue) => {
            setTempSliderValue(newValue);
            setIsShowBtn(
                newValue[0] !== sliderValue[0] || newValue[1] !== sliderValue[1]
            );
        },
        [sliderValue]
    );

    const handleSave = useCallback(() => {
        const [minVal, maxVal] = tempSliderValue;

        // validations
        if (
            minVal == null ||
            maxVal == null ||
            minVal === "" ||
            maxVal === "" ||
            isNaN(minVal) ||
            isNaN(maxVal) ||
            minVal < 0 ||
            maxVal < 0 ||
            minVal === maxVal ||
            minVal > maxVal ||
            minVal < min ||
            maxVal > max
        ) {
            toast.error("Please enter valid range values.", {
                hideProgressBar: true,
                duration: 5000,
            });
            return;
        }

        setSliderValue(tempSliderValue);
        setTempSliderValue(tempSliderValue);

        // dynamic API params
        const args = [null, null, null];
        args[apiPosition] = tempSliderValue;
        handleRangeFilterApi(...args);

        setAppliedRange([min, max]);
        setIsShowBtn(false);
        setShow(true);
    }, [
        tempSliderValue,
        min,
        max,
        apiPosition,
        setSliderValue,
        handleRangeFilterApi,
        setAppliedRange,
        setShow,
    ]);

    const handleKeyDown = useCallback(
        (index) => (e) => {
            if (e.key === "Enter") {
                if (index < tempSliderValue.length - 1) {
                    inputRefs.current[index + 1]?.current?.focus();
                } else {
                    handleSave();
                }
            }
        },
        [tempSliderValue, handleSave]
    );

    return (
        <div style={{ position: "relative" }}>
            {appliedRange && (
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
                    <Typography variant="caption" fontSize="11px" color="text.secondary">
                        {appliedRange[0] !== "" ? `Min: ${appliedRange[0]}` : ""}
                    </Typography>
                    <Typography variant="caption" fontSize="11px" color="text.secondary">
                        {appliedRange[1] !== "" ? `Max: ${appliedRange[1]}` : ""}
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
                        sx={{ textAlign: "center" }}
                    />
                ))}
            </div>

            <Stack direction="row" justifyContent="flex-end" gap={1} mt={1}>
                {show && (
                    <Button
                        variant="outlined"
                        sx={{ paddingBottom: "0" }}
                        color="error"
                        onClick={() =>
                            resetRangeFilter({
                                filterName: filterKey,
                                setSliderValue,
                                setTempSliderValue,
                                handleRangeFilterApi,
                                prodListType,
                                cookie,
                                setIsShowBtn,
                                show,
                                setShow,
                                setAppliedRange,
                                apiPosition, // Pass apiPosition to resetRangeFilter
                            })
                        }
                    >
                        Reset
                    </Button>
                )}
                {isShowBtn && (
                    <Button
                        variant="outlined"
                        sx={{ paddingBottom: "0" }}
                        color="success"
                        onClick={handleSave}
                    >
                        Apply
                    </Button>
                )}
            </Stack>
        </div>
    );
};

export default RangeViewFilter;

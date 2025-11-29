"use client";

import { useState, useEffect, useCallback } from "react";

export function useProductFilter(
    filterData = [],
    {
        ProductListApi,
        setProductListData,
        setAfterFilterCount,
        setIsOnlyProdLoading,
        selectedMetalId,
        selectedDiaId,
        selectedCsId,
        prodListType,
        cookie,
        sortBySelect,
    } = {}
) {
    const [filterChecked, setFilterChecked] = useState({});
    const [afterCountStatus, setAfterCountStatus] = useState(false);
    const [currPage, setCurrPage] = useState(1);
    const [inputPage, setInputPage] = useState(1);

    // Sliders + inputs
    const [sliderValue, setSliderValue] = useState([]);
    const [sliderValue1, setSliderValue1] = useState([]);
    const [sliderValue2, setSliderValue2] = useState([]);
    const [inputDia, setInputDia] = useState([]);
    const [inputNet, setInputNet] = useState([]);
    const [inputGross, setInputGross] = useState([]);
    const [appliedRange1, setAppliedRange1] = useState(["", ""]);
    const [appliedRange2, setAppliedRange2] = useState(["", ""]);
    const [appliedRange3, setAppliedRange3] = useState(["", ""]);
    const [show, setShow] = useState(false);
    const [show1, setShow1] = useState(false);
    const [show2, setShow2] = useState(false);
    const [isReset, setIsReset] = useState(false);
    const [isClearAllClicked, setIsClearAllClicked] = useState(false);

    // ✅ Handle checkbox toggle
    const handleCheckboxChange = useCallback((e, listname, val) => {
        const { name, checked } = e.target;
        setAfterCountStatus(true);

        setFilterChecked((prev) => ({
            ...prev,
            [name]: {
                checked,
                type: listname,
                id: name?.replace(/[a-zA-Z]/g, ""),
                value: val,
            },
        }));
    }, []);

    // ✅ Extract only checked filters
    const FilterValueWithCheckedOnly = useCallback(() => {
        let onlyTrueFilterValue = Object.values(filterChecked).filter(
            (ele) => ele.checked
        );

        const priceValues = onlyTrueFilterValue
            .filter((item) => item.type === "Price")
            .map((item) => item.value);

        const output = {};

        onlyTrueFilterValue.forEach((item) => {
            if (!output[item.type]) {
                output[item.type] = "";
            }

            if (item.type === "Price") {
                output["Price"] = priceValues;
                return;
            }

            output[item.type] += `${item.id}, `;
        });

        for (const key in output) {
            if (key !== "Price") {
                output[key] = output[key].slice(0, -2);
            }
        }

        setCurrPage(1);
        setInputPage(1);
        sessionStorage.setItem("key", JSON.stringify(output));

        return output;
    }, [filterChecked]);

    // ✅ Clear all filters
    const handelFilterClearAll = useCallback(() => {
        const diafilter =
            filterData?.find((ele) => ele?.Name === "Diamond")?.options?.length > 0
                ? JSON.parse(
                    filterData.find((ele) => ele?.Name === "Diamond")?.options
                )[0]
                : [];
        const diafilter1 =
            filterData?.find((ele) => ele?.Name === "NetWt")?.options?.length > 0
                ? JSON.parse(
                    filterData.find((ele) => ele?.Name === "NetWt")?.options
                )[0]
                : [];
        const diafilter2 =
            filterData?.find((ele) => ele?.Name === "Gross")?.options?.length > 0
                ? JSON.parse(
                    filterData.find((ele) => ele?.Name === "Gross")?.options
                )[0]
                : [];

        const isFilterChecked = Object.values(filterChecked).some(
            (ele) => ele.checked
        );
        const isSliderChanged =
            JSON.stringify(sliderValue) !==
            JSON.stringify(
                diafilter?.Min != null || diafilter?.Max != null
                    ? [diafilter?.Min, diafilter?.Max]
                    : []
            ) ||
            JSON.stringify(sliderValue1) !==
            JSON.stringify(
                diafilter1?.Min != null || diafilter1?.Max != null
                    ? [diafilter1?.Min, diafilter1?.Max]
                    : []
            ) ||
            JSON.stringify(sliderValue2) !==
            JSON.stringify(
                diafilter2?.Min != null || diafilter2?.Max != null
                    ? [diafilter2?.Min, diafilter2?.Max]
                    : []
            );

        if (isFilterChecked || isSliderChanged) {
            setSliderValue(
                diafilter?.Min != null || diafilter?.Max != null
                    ? [diafilter.Min, diafilter.Max]
                    : []
            );
            setSliderValue1(
                diafilter1?.Min != null || diafilter1?.Max != null
                    ? [diafilter1?.Min, diafilter1?.Max]
                    : []
            );
            setSliderValue2(
                diafilter2?.Min != null || diafilter2?.Max != null
                    ? [diafilter2?.Min, diafilter2?.Max]
                    : []
            );
            setInputDia([diafilter?.Min, diafilter?.Max]);
            setInputNet([diafilter1?.Min, diafilter1?.Max]);
            setInputGross([diafilter2?.Min, diafilter2?.Max]);
            setAppliedRange1(["", ""]);
            setAppliedRange2(["", ""]);
            setAppliedRange3(["", ""]);
            setShow(false);
            setShow1(false);
            setShow2(false);
            setIsReset(false);
            setFilterChecked({});
            if (Object.keys(filterChecked).length > 0 || isSliderChanged) {
                setIsClearAllClicked(true);
            }
        }
    }, [filterData, filterChecked, sliderValue, sliderValue1, sliderValue2]);

    // ✅ Show "Clear All" button or not
    const showClearAllButton = useCallback(() => {
        const diafilter =
            filterData?.find((ele) => ele?.Name === "Diamond")?.options?.length > 0
                ? JSON.parse(
                    filterData.find((ele) => ele?.Name === "Diamond")?.options
                )[0]
                : [];
        const diafilter1 =
            filterData?.find((ele) => ele?.Name === "NetWt")?.options?.length > 0
                ? JSON.parse(
                    filterData.find((ele) => ele?.Name === "NetWt")?.options
                )[0]
                : [];
        const diafilter2 =
            filterData?.find((ele) => ele?.Name === "Gross")?.options?.length > 0
                ? JSON.parse(
                    filterData.find((ele) => ele?.Name === "Gross")?.options
                )[0]
                : [];

        const isFilterChecked = Object.values(filterChecked).some(
            (ele) => ele.checked
        );
        const isSliderChanged =
            JSON.stringify(sliderValue) !==
            JSON.stringify(
                diafilter?.Min != null || diafilter?.Max != null
                    ? [diafilter?.Min, diafilter?.Max]
                    : []
            ) ||
            JSON.stringify(sliderValue1) !==
            JSON.stringify(
                diafilter1?.Min != null || diafilter1?.Max != null
                    ? [diafilter1?.Min, diafilter1?.Max]
                    : []
            ) ||
            JSON.stringify(sliderValue2) !==
            JSON.stringify(
                diafilter2?.Min != null || diafilter2?.Max != null
                    ? [diafilter2?.Min, diafilter2?.Max]
                    : []
            );

        return isFilterChecked || isSliderChanged;
    }, [filterData, filterChecked, sliderValue, sliderValue1, sliderValue2]);

    // ✅ New: Range filter API handler
    const handleRangeFilterApi = useCallback(
        async (diaRangeval, netRangeval1, grossRangeval2) => {
            if (!ProductListApi) return;

            setIsOnlyProdLoading(true);
            setAfterCountStatus(true);

            const output = JSON?.parse(sessionStorage.getItem("key")) ?? {};
            const obj = { mt: selectedMetalId, dia: selectedDiaId, cs: selectedCsId };

            // Extract filters
            const diamondFilter =
                filterData?.find((ele) => ele?.Name === "Diamond")?.options?.length > 0
                    ? JSON.parse(filterData.find((ele) => ele?.Name === "Diamond")?.options)[0]
                    : [];
            const netWtFilter =
                filterData?.find((ele) => ele?.Name === "NetWt")?.options?.length > 0
                    ? JSON.parse(filterData.find((ele) => ele?.Name === "NetWt")?.options)[0]
                    : [];
            const grossFilter =
                filterData?.find((ele) => ele?.Name === "Gross")?.options?.length > 0
                    ? JSON.parse(filterData.find((ele) => ele?.Name === "Gross")?.options)[0]
                    : [];

            // Decide source values (param wins over sliderValue)
            const diaSource = diaRangeval ?? sliderValue;
            const netSource = netRangeval1 ?? sliderValue1;
            const grossSource = grossRangeval2 ?? sliderValue2;

            // Check if ranges changed
            const isDia =
                JSON.stringify(diaSource) !==
                JSON.stringify([diamondFilter?.Min, diamondFilter?.Max]);
            const isNet =
                JSON.stringify(netSource) !==
                JSON.stringify([netWtFilter?.Min, netWtFilter?.Max]);
            const isGross =
                JSON.stringify(grossSource) !==
                JSON.stringify([grossFilter?.Min, grossFilter?.Max]);

            // Build ranges
            const DiaRange = {
                DiaMin: isDia ? diaSource?.[0] ?? "" : "",
                DiaMax: isDia ? diaSource?.[1] ?? "" : "",
            };
            const netRange = {
                netMin: isNet ? netSource?.[0] ?? "" : "",
                netMax: isNet ? netSource?.[1] ?? "" : "",
            };
            const grossRange = {
                grossMin: isGross ? grossSource?.[0] ?? "" : "",
                grossMax: isGross ? grossSource?.[1] ?? "" : "",
            };

            try {
                const res = await ProductListApi(
                    output,
                    1,
                    obj,
                    prodListType,
                    cookie,
                    sortBySelect,
                    DiaRange,
                    netRange,
                    grossRange
                );

                if (res) {
                    setProductListData(res?.pdList);
                    setAfterFilterCount(res?.pdResp?.rd1?.[0]?.designcount ?? 0);
                }
            } catch (err) {
                console.error("handleRangeFilterApi error:", err);
            } finally {
                setIsOnlyProdLoading(false);
                setAfterCountStatus(false);
            }
        },
        [
            ProductListApi,
            filterData,
            selectedMetalId,
            selectedDiaId,
            selectedCsId,
            prodListType,
            cookie,
            sortBySelect,
            sliderValue,
            sliderValue1,
            sliderValue2,
        ]
    );

    return {
        filterChecked,
        afterCountStatus,
        setAfterCountStatus,
        currPage,
        setCurrPage,
        inputPage,
        setInputPage,
        sliderValue,
        setSliderValue,
        sliderValue1,
        setSliderValue1,
        sliderValue2,
        setSliderValue2,
        inputDia,
        setInputDia,
        inputNet,
        setInputNet,
        inputGross,
        setInputGross,
        appliedRange1,
        setAppliedRange1,
        appliedRange2,
        setAppliedRange2,
        appliedRange3,
        setAppliedRange3,
        show,
        setShow,
        show1,
        setShow1,
        show2,
        setShow2,
        isReset,
        setIsReset,
        isClearAllClicked,
        setIsClearAllClicked,
        handleCheckboxChange,
        FilterValueWithCheckedOnly,
        handelFilterClearAll,
        showClearAllButton,
        handleRangeFilterApi,
    };
}
import { useState } from "react";
import {
    Typography,
    Menu,
    MenuItem,
    Stack,
    Box,
    Skeleton
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useNextRouterLikeRR } from '@/app/(core)/hooks/useLocationRd';
import { COLORS } from "@/app/(core)/constants/MobileAppTheme";

const BreadCrumbs = ({
    result,
    IsBreadCumShow,
    menuDecode,
    count,
    afterCountStatus,

}) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    let location = useNextRouterLikeRR();
    let navigate = useNextRouterLikeRR().push;

    const handleBreadcums = (mparams) => {
        let key = Object?.keys(mparams)
        let val = Object?.values(mparams)

        let KeyObj = {};
        let ValObj = {};

        key.forEach((value, index) => {
            let keyName = `FilterKey${index === 0 ? '' : index}`;
            KeyObj[keyName] = value;
        });

        val.forEach((value, index) => {
            let keyName = `FilterVal${index === 0 ? '' : index}`;
            ValObj[keyName] = value;
        });

        let finalData = { ...KeyObj, ...ValObj }

        const queryParameters1 = [
            finalData?.FilterKey && `${finalData.FilterVal}`,
            finalData?.FilterKey1 && `${finalData.FilterVal1}`,
            finalData?.FilterKey2 && `${finalData.FilterVal2}`,
        ].filter(Boolean).join('/');

        const queryParameters = [
            finalData?.FilterKey && `${finalData.FilterVal}`,
            finalData?.FilterKey1 && `${finalData.FilterVal1}`,
            finalData?.FilterKey2 && `${finalData.FilterVal2}`,
        ].filter(Boolean).join(',');

        const otherparamUrl = Object.entries({
            b: finalData?.FilterKey,
            g: finalData?.FilterKey1,
            c: finalData?.FilterKey2,
        })
            .filter(([key, value]) => value !== undefined)
            .map(([key, value]) => value)
            .filter(Boolean)
            .join(',');

        let menuEncoded = `${queryParameters}/${otherparamUrl}`;

        const url = `/p/${BreadCumsObj()?.menuname}/${queryParameters1}/?M=${btoa(menuEncoded)}`;

        if (url) {
            navigate(url);
        }
    }

    const BreadCumsObj = () => {
        let BreadCum = menuDecode;
        if (!BreadCum || !Array.isArray(BreadCum) || BreadCum.length < 2) {
            return { menuname: decodeURI(location?.pathname)?.slice(3)?.split("/")[0] || "" };
        }

        const values = BreadCum[0]?.split(',') || [];
        const labels = BreadCum[1]?.split(',') || [];

        const updatedBreadCum = labels?.reduce((acc, label, index) => {
            acc[label] = values[index] || '';
            return acc;
        }, {});

        let res = Object?.entries(updatedBreadCum ?? {})?.reduce((acc, [key, value], index) => {
            acc[`FilterKey${index === 0 ? '' : index}`] = key.charAt(0).toUpperCase() + key.slice(1);
            acc[`FilterVal${index === 0 ? '' : index}`] = value;
            return acc;
        }, {});

        if (res) {
            res.menuname = decodeURI(location?.pathname)?.slice(3)?.split("/")[0]
        } else {
            res = { menuname: decodeURI(location?.pathname)?.slice(3)?.split("/")[0] || "" }
        }

        return res;
    }

    const bObj = BreadCumsObj();
    const breadcrumbItems = [];
    const typeCondition = result?.[0]?.split("=")?.[0];

    breadcrumbItems.push({
        label: "Home",
        onClick: () => navigate('/')
    });

    if (typeCondition === "A") {
        breadcrumbItems.push({
            label: location?.pathname?.split("/")[2]?.replaceAll('%20', ' ') || "",
            onClick: () => { }
        });
    }
    if (typeCondition === "T") {
        breadcrumbItems.push({ label: "Trending", onClick: () => { } });
    }
    if (typeCondition === "B") {
        breadcrumbItems.push({ label: "Best Seller", onClick: () => { } });
    }
    if (typeCondition === "N") {
        breadcrumbItems.push({ label: "New Arrival", onClick: () => { } });
    }
    if (typeCondition === "S") {
        breadcrumbItems.push({
            label: decodeURIComponent(location?.pathname?.split("/")[2] || ""),
            onClick: () => { }
        });
    }

    if (IsBreadCumShow) {
        // const bObj = BreadCumsObj();

        // If condition "S", we don't show menuname (matching your old logic)
        if (bObj?.menuname) {
            // breadcrumbItems.push({
            //     label: bObj.menuname,
            //     onClick: () => handleBreadcums({ [bObj.FilterKey]: bObj.FilterVal }),
            // });

            // Edited Start 2026-03-18
            // breadcrumbItems.push({
            //     label: bObj.FilterVal1,
            //     onClick: () =>
            //         handleBreadcums({
            //             [bObj.FilterKey]: bObj.FilterVal,
            //             [bObj.FilterKey1]: bObj.FilterVal1,
            //         }),
            // });
            breadcrumbItems.push({
                label: bObj.menuname,
                onClick: () => handleBreadcums({ [bObj.FilterKey]: bObj.FilterVal }),
            });
            // Edited End 2026-03-18
        }

        if (bObj?.FilterVal1) {
            breadcrumbItems.push({
                label: bObj.FilterVal1,
                onClick: () =>
                    handleBreadcums({
                        [bObj.FilterKey]: bObj.FilterVal,
                        [bObj.FilterKey1]: bObj.FilterVal1,
                    }),
            });
        }

        if (bObj?.FilterVal2) {
            breadcrumbItems.push({
                label: bObj.FilterVal2,
                onClick: () =>
                    handleBreadcums({
                        [bObj.FilterKey]: bObj.FilterVal,
                        [bObj.FilterKey1]: bObj.FilterVal1,
                        [bObj.FilterKey2]: bObj.FilterVal2,
                    }),
            });
        }
    }

    const uniqueBreadcrumbItems = breadcrumbItems;

    if (uniqueBreadcrumbItems.length === 0) return null;

    const currentItem = uniqueBreadcrumbItems[uniqueBreadcrumbItems.length - 1];


    return (
        <Stack spacing={0} sx={{}}>
            <Stack direction="row" alignItems="center" spacing={1}>
                <Typography sx={{ fontSize: "18px", fontWeight: 700, color: "#2E3035", textTransform: 'capitalize' }}>
                    {currentItem.label}
                </Typography>

                {afterCountStatus == true ? (
                    <Skeleton
                        variant="rounded"
                        width={90}
                        height={22}
                        className="pSkelton"
                    />) :
                    <Typography sx={{ fontSize: "14px", fontWeight: 600, color: "#8E919C" }}>
                        {count || 0} Items
                    </Typography>
                }
            </Stack>

            <Box
                onClick={(e) => setAnchorEl(e.currentTarget)}
                sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    cursor: "pointer",
                    width: "fit-content",
                    "&:hover": { opacity: 0.8 }
                }}
            >
                <Typography sx={{ fontSize: 14, color: COLORS.primary, fontWeight: 600 }}>
                    All Categories
                </Typography>
                <KeyboardArrowDownIcon sx={{ fontSize: 18, color: COLORS.primary, ml: 0.2 }} />
            </Box>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={() => setAnchorEl(null)}
                slotProps={{
                    paper: {
                        sx: {
                            mt: 0.5,
                            minWidth: 150,
                            borderRadius: 4,
                            px: 0,
                            boxShadow: '0px 6px 24px rgba(0,0,0,0.1)',
                            border: '1px solid #E0E0E0',
                        }
                    }
                }}
            >
                {uniqueBreadcrumbItems.map((item, index) => {
                    const isCurrent = index === uniqueBreadcrumbItems.length - 1;
                    return (
                        <MenuItem
                            key={index}
                            onClick={() => {
                                setAnchorEl(null);
                                if (item.onClick) item.onClick();
                            }}
                            sx={{
                                backgroundColor: isCurrent ? '#F0F7FF' : 'transparent',
                                color: isCurrent ? COLORS.primary : '#3E5060',
                                '&:hover': {
                                    backgroundColor: isCurrent ? '#E0F0FF' : '#F3F6F9'
                                },
                                minHeight: '32px'
                            }}
                        >
                            <Typography sx={{ fontSize: '13px', fontWeight: isCurrent ? 600 : 500, textTransform: 'capitalize' }}>
                                {item.label}
                            </Typography>
                        </MenuItem>
                    );
                })}
            </Menu>
        </Stack>
    )
}

export default BreadCrumbs;
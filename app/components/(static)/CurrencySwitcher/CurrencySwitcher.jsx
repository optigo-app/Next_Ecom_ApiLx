"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CheckIcon from "@mui/icons-material/Check";
import useCurrency from "@/app/(core)/hooks/useCurrency";
import { getCurrencyList, getCurrencyFlag } from "@/app/(core)/utils/Glob_Functions/Currency";
import { decodeEntities } from "@/app/(core)/utils/product/productListingHelpers";

const SymbolBadge = ({ symbol, size = 30, active = false }) => (
  <Box
    sx={{
      width: size,
      height: size,
      borderRadius: "50%",
      flexShrink: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: size * 0.44,
      fontWeight: 700,
      color: active ? "#fff" : "inherit",
      backgroundColor: active ? "var(--hm-badge-bg, #1a1a1a)" : "rgba(127,127,127,0.14)",
      border: "1px solid rgba(127,127,127,0.25)",
      overflow: "hidden",
    }}
  >
    {symbol}
  </Box>
);

/**
 * Circular flag badge for a currency. Falls back to the plain symbol
 * badge for currencies that have no real-world country (QA1, P, …).
 */
const CurrencyBadge = ({ currency, size = 30, active = false }) => {
  const flag = getCurrencyFlag(currency);
  if (!flag) {
    return (
      <SymbolBadge
        symbol={decodeEntities(currency?.Currencysymbol || currency?.Currencycode || "?")}
        size={size}
        active={active}
      />
    );
  }
  return (
    <Box
      component="img"
      src={flag}
      alt={currency?.Currencycode || ""}
      sx={{
        width: size,
        height: size,
        borderRadius: "50%",
        flexShrink: 0,
        objectFit: "cover",
        border: "1px solid rgba(127,127,127,0.25)",
        backgroundColor: "rgba(127,127,127,0.14)",
      }}
    />
  );
};

/**
 * Navbar currency chip + right-side offset drawer (UI-only conversion).
 * Selecting a currency stores it in localStorage and instantly re-renders
 * every `useCurrency` consumer — API payloads stay in the base currency.
 */
const CurrencySwitcher = ({ color = "inherit" }) => {
  const { currency, symbol, code, select } = useCurrency();
  const [open, setOpen] = useState(false);
  const [list, setList] = useState(() => getCurrencyList());
  // Render only after mount — server HTML must match the first client render
  // exactly, otherwise hydration discards the header tree and the chip vanishes.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // The CURRENCYCOMBO master can arrive after mount — refresh on open,
  // with one delayed retry so the drawer never stays empty.
  useEffect(() => {
    if (!open) return;
    setList(getCurrencyList());
    const t = setTimeout(() => {
      setList((prev) => (prev.length ? prev : getCurrencyList()));
    }, 800);
    return () => clearTimeout(t);
  }, [open]);

  const items = useMemo(() => {
    if (list.length) return list;
    return currency ? [currency] : [];
  }, [list, currency]);

  const displaySymbol = decodeEntities(symbol) || "¤";
  const displayCode = code || "";

  if (!mounted) return null;

  return (
    <>
      <Box
        component="button"
        type="button"
        aria-label="Change currency"
        onClick={() => setOpen(true)}
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: 0.6,
          px: 1,
          py: 0.5,
          border: "1px solid currentColor",
          borderRadius: "999px",
          bgcolor: "transparent",
          color,
          cursor: "pointer",
          font: "inherit",
          lineHeight: 1,
          opacity: 0.85,
          transition: "opacity 0.2s ease",
          "&:hover": { opacity: 1 },
        }}
      >
        {currency ? (
          <CurrencyBadge currency={currency} size={20} />
        ) : (
          <SymbolBadge symbol={displaySymbol} size={20} />
        )}
        {displayCode && (
          <Typography component="span" sx={{ fontSize: 12, fontWeight: 600, letterSpacing: 0.5 }}>
            {displayCode}
          </Typography>
        )}
        <KeyboardArrowDownIcon sx={{ fontSize: 16 }} />
      </Box>

      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          "& .MuiDrawer-paper": {
            top: { xs: 56, sm: 72 },
            right: { xs: 8, sm: 16 },
            bottom: { xs: 8, sm: 16 },
            height: "auto",
            width: { xs: "88%", sm: 340 },
            maxWidth: 380,
            borderRadius: "12px",
            border: "1px solid rgba(0,0,0,0.08)",
            boxShadow: "0 16px 48px rgba(0,0,0,0.18)",
            backgroundColor: "#fff",
            color: "#1a1a1a",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 2,
            py: 1.5,
            borderBottom: "1px solid rgba(0,0,0,0.08)",
            position: "sticky",
            top: 0,
            bgcolor: "#fff",
            zIndex: 1,
          }}
        >
          <Typography sx={{ fontSize: 15, fontWeight: 700 }}>Currency</Typography>
          <IconButton aria-label="Close" size="small" onClick={() => setOpen(false)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <List disablePadding sx={{ py: 0.5, overflowY: "auto" }}>
          {items.length === 0 && (
            <Typography sx={{ px: 2, py: 3, fontSize: 13, color: "#777" }}>
              Loading currencies…
            </Typography>
          )}
          {items.map((c) => {
            const active = currency?.Currencyid === c?.Currencyid;
            return (
              <ListItemButton
                key={c?.Currencyid ?? c?.Currencycode}
                onClick={() => {
                  select(c);
                  setOpen(false);
                }}
                sx={{
                  px: 2,
                  py: 1.2,
                  gap: 1.5,
                  bgcolor: active ? "rgba(0,0,0,0.05)" : "transparent",
                  "&:hover": { bgcolor: "rgba(0,0,0,0.07)" },
                }}
              >
                <CurrencyBadge currency={c} active={active} />
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography sx={{ fontSize: 13.5, fontWeight: 600, lineHeight: 1.25 }}>
                    {c?.Currencycode}
                    {c?.Currencyname ? ` · ${c.Currencyname}` : ""}
                  </Typography>
                </Box>
                {active && <CheckIcon sx={{ fontSize: 18, color: "var(--hm-text, #1a1a1a)" }} />}
              </ListItemButton>
            );
          })}
        </List>
      </Drawer>
    </>
  );
};

export default CurrencySwitcher;

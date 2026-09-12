import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  TextField,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  InputAdornment,
  ClickAwayListener,
  Popper,
  Fade,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PhoneIcon from "@mui/icons-material/Phone";

const CountryPhoneInput = ({ 
  countries = [], 
  value = "", 
  onChange, 
  error = "",
  label = "Mobile Number",
  placeholder = "Enter mobile number",
  required = false 
}) => {
  const defaultCountry = countries.find(c => c.IsDefault === 1) || countries[0];
  const [selectedCountry, setSelectedCountry] = useState(defaultCountry);
  const [phoneNumber, setPhoneNumber] = useState(value);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [validationError, setValidationError] = useState(error);
  const anchorRef = useRef(null);

  useEffect(() => {
    setPhoneNumber(value);
  }, [value]);

  useEffect(() => {
    setValidationError(error);
  }, [error]);

  // Filter countries based on search
  const filteredCountries = countries.filter(country =>
    country.countryname.toLowerCase().includes(searchQuery.toLowerCase()) ||
    country.mobileprefix.includes(searchQuery)
  );

  const validatePhoneNumber = (number, country) => {
    if (!number && required) {
      return "Phone number is required";
    }
    if (number && number.length !== country.PhoneLength) {
      return `Phone number must be exactly ${country.PhoneLength} digits`;
    }
    return "";
  };

  const handlePhoneNumberChange = (e) => {
    let val = e.target.value.replace(/[^0-9]/g, "");
    
    // Limit to country's phone length
    if (val.length > selectedCountry.PhoneLength) {
      val = val.slice(0, selectedCountry.PhoneLength);
    }
    
    setPhoneNumber(val);
    
    // Validate
    const error = validatePhoneNumber(val, selectedCountry);
    setValidationError(error);
    
    // Call parent onChange
    if (onChange) {
      onChange({
        phoneNumber: val,
        countryCode: selectedCountry.mobileprefix,
        country: selectedCountry,
        isValid: !error,
        fullNumber: val ? `+${selectedCountry.mobileprefix}${val}` : ""
      });
    }
  };

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setDropdownOpen(false);
    setSearchQuery("");
    
    // Revalidate with new country
    const error = validatePhoneNumber(phoneNumber, country);
    setValidationError(error);
    
    if (onChange) {
      onChange({
        phoneNumber,
        countryCode: country.mobileprefix,
        country: country,
        isValid: !error,
        fullNumber: phoneNumber ? `+${country.mobileprefix}${phoneNumber}` : ""
      });
    }
  };

  const handleBlur = () => {
    const error = validatePhoneNumber(phoneNumber, selectedCountry);
    setValidationError(error);
  };

  return (
    <Box sx={{ width: "100%", position: "relative" }}>
      {/* Label */}
      {label && (
        <Typography
          variant="body2"
          sx={{
            mb: 1,
            fontWeight: 500,
            color: "#18181b",
            fontSize: "14px",
          }}
        >
          {label} {required && <span style={{ color: "#ef4444" }}>*</span>}
        </Typography>
      )}

      {/* Input Container */}
      <Box
        sx={{
          display: "flex",
          gap: 1.5,
          width: "100%",
        }}
      >
        {/* Country Code Selector */}
        <Box
          ref={anchorRef}
          sx={{
            minWidth: 50,
            position: "relative",
          }}
        >
          <TextField
            value={`+${selectedCountry.mobileprefix}`}
            onClick={() => setDropdownOpen(!dropdownOpen)}
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor: "#f9fafb",
                  "& fieldset": {
                    borderColor: "#d1d5db",
                  },
                },
                "&.Mui-focused": {
                  backgroundColor: "#ffffff",
                  "& fieldset": {
                    borderColor: "#8b5cf6",
                    borderWidth: "2px",
                  },
                },
                "& fieldset": {
                  borderColor: "#e5e7eb",
                  transition: "all 0.2s ease",
                },
              },
              "& .MuiOutlinedInput-input": {
                color: "#18181b",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: "15px",
              },
            }}
            InputProps={{
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end">
                  <KeyboardArrowDownIcon
                    sx={{
                      color: "#6b7280",
                      fontSize: 20,
                      transition: "transform 0.2s ease",
                      transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Phone Number Input */}
        <TextField
          fullWidth
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
          onBlur={handleBlur}
          error={!!validationError}
          helperText={validationError}
          placeholder={placeholder}
          inputProps={{ 
            maxLength: selectedCountry.PhoneLength,
            inputMode: "numeric",
            pattern: "[0-9]*"
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PhoneIcon sx={{ color: "#6b7280", fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor: "#ffffff",
              borderRadius: "8px",
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: "#f9fafb",
                "& fieldset": {
                  borderColor: "#d1d5db",
                },
              },
              "&.Mui-focused": {
                backgroundColor: "#ffffff",
                "& fieldset": {
                  borderColor: "#8b5cf6",
                  borderWidth: "2px",
                },
              },
              "&.Mui-error": {
                "& fieldset": {
                  borderColor: "#ef4444",
                },
              },
              "& fieldset": {
                borderColor: "#e5e7eb",
                transition: "all 0.2s ease",
              },
            },
            "& .MuiOutlinedInput-input": {
              color: "#18181b",
              fontSize: "15px",
              fontWeight: 500,
            },
            "& .MuiFormHelperText-root": {
              color: "#ef4444",
              fontSize: "12px",
              mt: 0.75,
              mx: 0,
            },
          }}
        />
      </Box>

      {/* Popper Dropdown */}
      <Popper
        open={dropdownOpen}
        anchorEl={anchorRef.current}
        placement="bottom-start"
        transition
        style={{ zIndex: 99999 }}
        modifiers={[
          {
            name: 'offset',
            options: {
              offset: [0, 8],
            },
          },
        ]}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={200}>
            <Paper
              elevation={12}
              sx={{
                width: anchorRef.current ? anchorRef.current.offsetWidth + 140 : 320,
                maxWidth: 400,
                maxHeight: 360,
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
            >
              <ClickAwayListener onClickAway={() => setDropdownOpen(false)}>
                <Box>
                  {/* Search Input */}
                  <Box sx={{ p: 1.5, borderBottom: "1px solid #f3f4f6" }}>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Search country..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon sx={{ color: "#9ca3af", fontSize: 18 }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "#f9fafb",
                          borderRadius: "8px",
                          "& fieldset": {
                            borderColor: "#e5e7eb",
                          },
                          "&:hover fieldset": {
                            borderColor: "#d1d5db",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#8b5cf6",
                            borderWidth: "1px",
                          },
                        },
                        "& .MuiOutlinedInput-input": {
                          color: "#18181b",
                          fontSize: "14px",
                          padding: "8px 12px",
                        },
                      }}
                    />
                  </Box>

                  {/* Country List */}
                  <List
                    sx={{
                      maxHeight: 280,
                      overflowY: "auto",
                      py: 0.5,
                      "&::-webkit-scrollbar": {
                        width: "8px",
                      },
                      "&::-webkit-scrollbar-track": {
                        background: "#f9fafb",
                      },
                      "&::-webkit-scrollbar-thumb": {
                        background: "#d1d5db",
                        borderRadius: "4px",
                        "&:hover": {
                          background: "#9ca3af",
                        },
                      },
                    }}
                  >
                    {filteredCountries.length > 0 ? (
                      filteredCountries.map((country) => (
                        <ListItem key={country.id} disablePadding>
                          <ListItemButton
                            onClick={() => handleCountrySelect(country)}
                            selected={selectedCountry.id === country.id}
                            sx={{
                              py: 1.5,
                              px: 2,
                              transition: "all 0.15s ease",
                              "&:hover": {
                                backgroundColor: "#f3f4f6",
                              },
                              "&.Mui-selected": {
                                backgroundColor: "#8b5cf6",
                                "&:hover": {
                                  backgroundColor: "#7c3aed",
                                },
                              },
                            }}
                          >
                            <ListItemText
                              primary={
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                  <Typography
                                    sx={{
                                      color: selectedCountry.id === country.id ? "#ffffff" : "#18181b",
                                      fontSize: "14px",
                                      fontWeight: 500,
                                      flex: 1,
                                    }}
                                  >
                                    {country.countryname}
                                  </Typography>
                                  <Typography
                                    sx={{
                                      color: selectedCountry.id === country.id ? "#e9d5ff" : "#6b7280",
                                      fontSize: "14px",
                                      fontWeight: 600,
                                      fontFamily: "monospace",
                                    }}
                                  >
                                    +{country.mobileprefix}
                                  </Typography>
                                </Box>
                              }
                            />
                          </ListItemButton>
                        </ListItem>
                      ))
                    ) : (
                      <Box sx={{ py: 4, textAlign: "center" }}>
                        <Typography sx={{ color: "#9ca3af", fontSize: "14px" }}>
                          No countries found
                        </Typography>
                      </Box>
                    )}
                  </List>
                </Box>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </Box>
  );
};

export default CountryPhoneInput;
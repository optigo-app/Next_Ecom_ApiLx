import { getSession } from "../../FetchSessionData";



export const accountDetailPages = () => {
    let arr = [
        { id: 1163, tabLabel: "Quote", tabComp: "QuotationQuote", compPath: "./QuotationQuote/QuotationQuote" },
        { id: 1164, tabLabel: "Job", tabComp: "QuotationJob", compPath: "./quotationFilters/QuotationJob" },
        { id: 1157, tabLabel: "Sales", tabComp: "Sales", compPath: "../sales/Sales/Sales" },
        { id: 1314, tabLabel: "Sales Report", tabComp: "SalesReport", compPath: "../sales/salesReport/SalesReport" },
        { id: 17020, tabLabel: "Design Wise Sales Report", tabComp: "DesignWiseSalesReport", compPath: "../sales/DesignWiseSalesReport/DesignWiseSalesReport" },
        { id: 1159, tabLabel: "Account Ledger", tabComp: "AccountLedger", compPath: "./accountLedger/AccountLedger" },
        { id: 18129, tabLabel: "Memo", tabComp: "PendingMemo", compPath: "./PendingMemo/PendingMemo" }, //demo id
    ];

    let getValArr = [];
    const AccountFlag = getSession('myAccountFlags');
    arr?.forEach((e, i) => {
        let getVal = AccountFlag?.find(ele => ele?.pageid === e?.id);
        getVal !== undefined && (getVal?.isvisible === 1 && getValArr?.push(e))
        // getValArr?.push({ label: e?.tabLabel,id: e?.id, comp: e?.tabComp, value: false }))  
        // getValArr?.push({ label: e?.tabLabel,id: e?.id, comp: e?.tabComp, value: false });
    });
    return getValArr;
}

export const accountValidation = () => {
    let getVal = getSession("storeInit")?.["IsMyaccount"];
        const AccountFlag = getSession('myAccountFlags');
    let getVals = [1163, 1164, 1157, 1314, 17020, 1159, 18129];
    let pageIsOn = false;
    getVals?.forEach((e, i) => {
        let getValss = AccountFlag?.find(ele => ele?.pageid === e);
        if (getValss !== undefined) {
            if (getValss?.isvisible === 1) {
                pageIsOn = true;
            }
        }
    })
    return (getVal === 1 && pageIsOn === true) ? true : false;
}

export function formatAmount(amount) {
    const formattedAmount = parseFloat(+amount).toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    return formattedAmount;
}
export function formatAmount2(amount) {
    // Convert the amount to a number, round it down, and then format it
    const amountNumber = Math.floor(parseFloat(amount));
    const formattedAmount = amountNumber.toLocaleString('en-IN');

    return formattedAmount;
}
export const checkMonth = (val) => {
    // month = "January" month = "February" month = "March" month = "April" month = "May" month = "June" month = "July" month = "August" month = "September" month = "October" month = "November" month = "December"
    let month = "";
    switch (val) {
        case 0:
            month = "01"
            break;
        case 1:
            month = "02"
            break;
        case 2:
            month = "03"
            break;
        case 3:
            month = "04"
            break;
        case 4:
            month = "05"
            break;
        case 5:
            month = "06"
            break;
        case 6:
            month = "07"
            break;
        case 7:
            month = "08"
            break;
        case 8:
            month = "09"
            break;
        case 9:
            month = "10"
            break;
        case 10:
            month = "11"
            break;
        case 11:
            month = "12"
            break;

        default:
            break;
    }

    return month;
};

export const NumberWithCommas = (value, val) => {
    const roundedValue = Number(value).toFixed(val || 2);
    const stringValue = roundedValue.toString();
    const [integerPart, decimalPart] = stringValue.split('.');
    let formattedString = integerPart
        .split('')
        .reverse()
        .map((char, index) => (index > 0 && index % 2 === 0 ? ',' + char : char))
        .reverse()
        .join('');
    if (decimalPart !== undefined && val && val !== 0) {
        formattedString += '.' + decimalPart.padEnd(val || 2, '0');
    }
    formattedString = formattedString.replace(/^,+/, '');
    return formattedString;
};

// export const customComparator_Col = (a, b) => {
//     const regex = /([^\d]+)(\d+)/;
//     const [, wordA, numA] = a?.match(regex);
//     const [, wordB, numB] = b?.match(regex);
    
//     if (wordA !== wordB) {
//         return wordA?.localeCompare(wordB);
//     }
    
//     return parseInt(numB, 10) - parseInt(numA, 10);
// };

export const customComparator_Col = (a, b) => {
    const regex = /([^\d]*)(\d+)/; // Adjusted regex to handle cases where there might not be a match
    const matchA = a?.match(regex);
    const matchB = b?.match(regex);
    
    if (!matchA || !matchB) {
      return a?.localeCompare(b); // Default to string comparison if regex does not match
    }
    
    const [, wordA, numA] = matchA;
    const [, wordB, numB] = matchB;
  
    if (wordA !== wordB) {
      return wordA?.localeCompare(wordB);
    }
    
    return parseInt(numA, 10) - parseInt(numB, 10);
  };

export function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
        return order;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}
  
//address form validation
export const validateAddressFormAccount = (formData) => {
    const errorsCopy = {}; // Initialize errors object

    if (!formData.firstName.trim()) {
        errorsCopy.firstName = 'First Name is required';
    } else if (!/^[a-zA-Z\s]+$/.test(formData.firstName.trim())) {
        errorsCopy.firstName = 'First Name must contain only letters';
    } else if (formData.firstName.trim().length < 2) {
        errorsCopy.firstName = 'Enter minimum 2 characters';
    } else if (formData.firstName.trim().length > 45) {
        errorsCopy.firstName = 'Enter maximum 45 characters';
    }

    if (!formData.lastName.trim()) {
        errorsCopy.lastName = 'Last Name is required';
    } else if (!/^[a-zA-Z\s]+$/.test(formData.lastName.trim())) {
        errorsCopy.lastName = 'Last Name must contain only letters';
    } else if (formData.lastName.trim().length < 2) {
        errorsCopy.lastName = 'Enter minimum 2 characters';
    } else if (formData.lastName.trim().length > 45) {
        errorsCopy.lastName = 'Enter maximum 45 characters';
    }

    if (!formData.mobileNo.trim()) {
        errorsCopy.mobileNo = 'Mobile No. is required';
    } else if (!/^\d{10}$/.test(formData.mobileNo.trim())) {
        errorsCopy.mobileNo = 'Mobile No. must contain exactly 10 numbers';
    }

    if (!formData.address.trim()) {
        errorsCopy.address = 'Address is required';
    }

    if (!formData.country.trim()) {
        errorsCopy.country = 'Country is required';
    } else if (!/^[a-zA-Z\s]+$/.test(formData.country.trim())) {
        errorsCopy.country = 'Country name must contain only letters';
    }

    if (!formData.state.trim()) {
        errorsCopy.state = 'State is required';
    } else if (!/^[a-zA-Z\s]+$/.test(formData.state.trim())) {
        errorsCopy.state = 'State name must contain only letters';
    }

    if (!formData.city.trim()) {
        errorsCopy.city = 'City is required';
    } else if (!/^[a-zA-Z\s]+$/.test(formData.city.trim())) {
        errorsCopy.city = 'City name must contain only letters';
    }

    if (!formData.zipCode.trim()) {
        errorsCopy.zipCode = 'ZIP Code is required';
    } else if (!/^\d+$/.test(formData.zipCode.trim())) {
        errorsCopy.zipCode = 'ZIP Code must contain only numeric values';
    } else if (formData.zipCode.trim().length !== 6) {
        errorsCopy.zipCode = 'ZIP Code must be exactly 6 digits';
    }

    return errorsCopy;
}
//address form fields on change validations
export const validateAddressFieldAccount = (fieldName, value) => {
    let error = '';

    switch (fieldName) {
        case 'firstName':
            if (!value.trim()) {
                error = 'First Name is required';
            } else if (!/^[a-zA-Z\s]+$/.test(value.trim())) {
                error = 'First Name must contain only letters';
            } else if (value.trim().length < 2) {
                error = 'Enter minimum 2 characters';
            } else if (value.trim().length > 45) {
                error = 'Enter maximum 45 characters';
            }
            break;
        case 'lastName':
            if (!value.trim()) {
                error = 'Last Name is required';
            } else if (!/^[a-zA-Z\s]+$/.test(value.trim())) {
                error = 'Last Name must contain only letters';
            } else if (value.trim().length < 2) {
                error = 'Enter minimum 2 characters';
            } else if (value.trim().length > 45) {
                error = 'Enter maximum 45 characters';
            }
            break;
        case 'address':
            error = value.trim() ? '' : 'Address is required';
            break;
        case 'country':
            if (!value.trim()) {
                error = 'Country is required';
            } else if (!/^[a-zA-Z\s]+$/.test(value.trim())) {
                error = 'Country name must contain only letters';
            }
            break;
        case 'state':
            if (!value.trim()) {
                error = 'State is required';
            } else if (!/^[a-zA-Z\s]+$/.test(value.trim())) {
                error = 'State name must contain only letters';
            }
            break;
        case 'city':
            if (!value.trim()) {
                error = 'City is required';
            } else if (!/^[a-zA-Z\s]+$/.test(value.trim())) {
                error = 'City name must contain only letters';
            }
            break;
        case 'zipCode':
            if (!value.trim()) {
                error = 'ZIP Code is required';
            } else if (!/^\d+$/.test(value.trim())) {
                error = 'ZIP Code must contain only numeric values';
            } else if (value.trim().length !== 6) {
                error = 'ZIP Code must be exactly 6 digits';
            }
            break;
        case 'mobileNo':
            if (!value.trim()) {
                error = 'Mobile Number is required';
            } else if (!/^\d+$/.test(value.trim())) {
                error = 'Mobile Number must contain only numeric values';
            } else if (value.trim().length !== 10) {
                error = 'Mobile Number must be exactly 10 digits';
            }
            break;
        default:
            break;
    }

    return error;
};



//your profile validation function account
// src/utils/validationUtils.js

export const validateUserDataYPAccount = (editedUserData) => {
    let tempErrors = {};

    // First Name validation
    if (!editedUserData.firstname?.trim().length) {
        tempErrors.firstname = "First Name is required";
    } else if (!/^[a-zA-Z\s]+$/.test(editedUserData.firstname.trim())) {
        tempErrors.firstname = "First Name must contain only letters";
    } else if (editedUserData.firstname.trim().length < 2) {
        tempErrors.firstname = "Enter minimum 2 characters";
    } else if (editedUserData.firstname.trim().length > 45) {
        tempErrors.firstname = "Enter maximum 45 characters";
    } else {
        tempErrors.firstname = "";
    }

    // Last Name validation
    if (!editedUserData.lastname?.trim().length) {
        tempErrors.lastname = "Last Name is required";
    } else if (!/^[a-zA-Z\s]+$/.test(editedUserData.lastname.trim())) {
        tempErrors.lastname = "Last Name must contain only letters";
    } else if (editedUserData.lastname.trim().length < 2) {
        tempErrors.lastname = "Enter minimum 2 characters";
    } else if (editedUserData.lastname.trim().length > 45) {
        tempErrors.lastname = "Enter maximum 45 characters";
    } else {
        tempErrors.lastname = "";
    }

    // Mobile Number validation
    if (!editedUserData.mobileno?.trim().length) {
        tempErrors.mobileno = "Mobile Number is required";
    } else if (!/^\d{10}$/.test(editedUserData.mobileno.trim())) {
        tempErrors.mobileno = "Mobile Number must contain exactly 10 digits and only numbers";
    } else {
        tempErrors.mobileno = "";
    }

    // User ID validation
    if (!editedUserData.userid) {
        tempErrors.userid = "User ID is required";
    }

    // Street Address validation
    if (!editedUserData.street) {
        tempErrors.street = "Address is required";
    }

    // Check if all errors are empty strings or undefined
    const isValid = Object.values(tempErrors).every(x => !x);

    return { errors: tempErrors, isValid: isValid };
};

export const validateChangeYPAccount = (id, value) => {
    let error = '';

    switch (id) {
        case 'firstname':
            if (!value?.trim().length) {
                error = "First Name is required";
            } else if (!/^[a-zA-Z\s]+$/.test(value?.trim())) {
                error = "First Name must contain only letters";
            } else if (value.trim().length < 2) {
                error = "Enter minimum 2 characters";
            } else if (value.trim().length > 45) {
                error = "Enter maximum 45 characters";
            }
            break;

        case 'lastname':
            if (!value?.trim().length) {
                error = "Last Name is required";
            } else if (!/^[a-zA-Z\s]+$/.test(value?.trim())) {
                error = "Last Name must contain only letters";
            } else if (value.trim().length < 2) {
                error = "Enter minimum 2 characters";
            } else if (value.trim().length > 45) {
                error = "Enter maximum 45 characters";
            }
            break;

        case 'street':
            if (!value.trim()) {
                error = 'Address is required';
            }
            break;

        case 'mobileno':
            if (!value.trim()) {
                error = 'Mobile Number is required';
            } else if (!/^\d+$/.test(value.trim())) {
                error = 'Mobile Number must contain only numeric values';
            } else if (value?.trim()?.length !== 10) {
                error = 'Mobile Number must be exactly 10 digits';
            }
            break;

        default:
            break;
    }

    return error;
};

// validation on submit password
export const validateChangePassword = ({ oldPassword, password, confirmPassword }) => {
    const errors = {};

    if (!oldPassword.trim()) {
        errors.oldPassword = 'Old Password is required';
    }

    if (!password.trim()) {
        errors.password = 'Password is required';
    }

    if (!confirmPassword.trim()) {
        errors.confirmPassword = 'Confirm Password is required';
    } else if (confirmPassword !== password) {
        errors.confirmPassword = 'Passwords do not match';
    }

    return {
        errors,
        isValid: Object.keys(errors).length === 0,
    };
};

// // validation on change password
// export const handlePasswordInputChangeAcc = (e, fieldName, setters, errors, setErrors) => {
//     const { value } = e.target;
//     const { setPassword, setConfirmPassword, setOldPassword } = setters;

//     switch (fieldName) {
//         case 'oldPassword':
//             setOldPassword(value);
//             if (!value.trim()) {
//                 setErrors(prevErrors => ({ ...prevErrors, oldPassword: 'Old Password is required' }));
//             } else {
//                 setErrors(prevErrors => ({ ...prevErrors, oldPassword: '' }));
//             }
//             break;

//         case 'password':
//             setPassword(value);
//             if (!value.trim()) {
//                 setErrors(prevErrors => ({ ...prevErrors, password: 'Password is required' }));
//             } else {
//                 setErrors(prevErrors => ({ ...prevErrors, password: '' }));
//             }
//             break;

//         case 'confirmPassword':
//             setConfirmPassword(value);
//             if (!value.trim()) {
//                 setErrors(prevErrors => ({ ...prevErrors, confirmPassword: 'Confirm Password is required' }));
//             } else if (value !== setters.password) {
//                 setErrors(prevErrors => ({ ...prevErrors, confirmPassword: 'Passwords do not match' }));
//             } else {
//                 setErrors(prevErrors => ({ ...prevErrors, confirmPassword: '' }));
//             }
//             break;

//         default:
//             break;
//     }
// };

export const handlePasswordInputChangeAcc = (e, fieldName, values, setErrors) => {
    const { value } = e.target;
    const { password, confirmPassword } = values;

    switch (fieldName) {
        case 'oldPassword':
            values.setOldPassword(value);
            if (!value.trim()) {
                setErrors(prevErrors => ({ ...prevErrors, oldPassword: 'Old Password is required' }));
            } else {
                setErrors(prevErrors => ({ ...prevErrors, oldPassword: '' }));
            }
            break;

        case 'password':
            values.setPassword(value);
            if (!value.trim()) {
                setErrors(prevErrors => ({ ...prevErrors, password: 'Password is required' }));
            } else {
                setErrors(prevErrors => ({ ...prevErrors, password: '' }));
            }

            // Revalidate confirmPassword since password has changed
            if (confirmPassword && value !== confirmPassword) {
                setErrors(prevErrors => ({ ...prevErrors, confirmPassword: 'Passwords do not match' }));
            } else {
                setErrors(prevErrors => ({ ...prevErrors, confirmPassword: '' }));
            }
            break;

        case 'confirmPassword':
            values.setConfirmPassword(value);
            if (!value.trim()) {
                setErrors(prevErrors => ({ ...prevErrors, confirmPassword: 'Confirm Password is required' }));
            } else if (value !== password) {
                setErrors(prevErrors => ({ ...prevErrors, confirmPassword: 'Passwords do not match' }));
            } else {
                setErrors(prevErrors => ({ ...prevErrors, confirmPassword: '' }));
            }
            break;

        default:
            break;
    }
};


//Date wise sorting
export function sortByDate(arr, key) {
    if (!Array.isArray(arr)) return [];
    
    return arr.sort((a, b) => {
      const dateA = new Date(a[key]);
      const dateB = new Date(b[key]);
  
      // Sort in descending order: Newest first
      return dateB - dateA;
    });
}

export function sortByKeyDescending(arr, key) {
    return arr.sort((a, b) => {
      // Extract numeric part after 'QT' or other prefixes and compare as numbers
      const keyA = parseInt(a[key].substring(2), 10); 
      const keyB = parseInt(b[key].substring(2), 10);
      
      return keyB - keyA; // Sort in descending order
    });
  }
  export function sortByKeyDescendingJS(arr, key) {
    return arr.sort((a, b) => {
      // Extract numeric part after 'JS' or other prefixes and compare as numbers
      const keyA = parseInt(a[key].substring(2), 10); 
      const keyB = parseInt(b[key].substring(2), 10);
      
      return keyB - keyA; // Sort in descending order (last entered first)
    });
  }
  export function sortByKeyDescendingJobno(arr, key) {
    return arr.sort((a, b) => {
      // Compare jobno as numbers
      const keyA = parseInt(a[key], 10); 
      const keyB = parseInt(b[key], 10);
      
      return keyB - keyA; // Sort in descending order
    });
  }
  
  
//Quotation createData function
export const quotationCreateData = (SrNo, Date, SKUNo, TotalDesign, Amount, PrintUrl, Currencycode, CurrencyExchRate) => {
    return {
        SrNo,
        Date,
        SKUNo,
        TotalDesign,
        Amount,
        PrintUrl,
        Currencycode, CurrencyExchRate
    };
}

//sales createData function
export const salesCreateData = (SrNo, Date, StockDocumentNo, TotalDesign, Amount, PrintUrl, Currencycode, CurrencyExchRate) => {
    return {
        SrNo,
        Date,
        StockDocumentNo,
        TotalDesign,
        Amount,
        PrintUrl,
        Currencycode, CurrencyExchRate
    };
}

//salesreport createData function
export function salesReportCreateData(
    SrNo,
    EntryDate,
    StockDocumentNo,
    SKUNo,
    designno,
    MetalType,
    MetalAmount,
    DiamondAmount,
    ColorStoneAmount,
    LabourAmount,
    OtherAmount,
    UnitCost,
    Category,
    GrossWt,
    NetWt,
    DiaPcs,
    DiaWt,
    CsPcs,
    CsWt,
    imgsrc,
    Netwt_24k
  ) {
    return {
      SrNo,
      EntryDate,
      StockDocumentNo,
      SKUNo,
      designno,
      MetalType,
      MetalAmount,
      DiamondAmount,
      ColorStoneAmount,
      LabourAmount,
      OtherAmount,
      UnitCost,
      Category,
      GrossWt,
      NetWt,
      DiaPcs,
      DiaWt,
      CsPcs,
      CsWt,
      imgsrc,
      Netwt_24k,
    };
}
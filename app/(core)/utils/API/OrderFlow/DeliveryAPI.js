import { getSession } from '../../FetchSessionData';
import { CommonAPI } from '../CommonAPI/CommonAPI';

export const fetchAddresses = async () => {
    try {
        const storedData = getSession('loginUserDetail');
        const storeInit = getSession('storeInit');


        const { FrontEnd_RegNo } = storeInit;

        const combinedValue = JSON.stringify({
            FrontEnd_RegNo: `${FrontEnd_RegNo}`, Customerid: `${storedData.id}`
        });
        const body = {
            "con": `{\"id\":\"\",\"mode\":\"GETSHIPINGADDRESS\",\"appuserid\":\"${storedData?.userid}\"}`,
            "f": "Delivery (FetchAddress)",
            "p": combinedValue,
        };
        const response = await CommonAPI(body);
        if (response?.Data?.rd) {
            return response.Data.rd;
        } else {
            return [];
        }
    } catch (error) {
        console.error('fetchAddresses Error:', error);
        return [];
    }
};

export const addAddress = async (formData) => {
    try {
        const storedData = getSession('loginUserDetail');
        const storeInit = getSession('storeInit');

        const { FrontEnd_RegNo } = storeInit;

        const combinedValue = JSON.stringify({
            addrid: ``, firstname: `${formData.firstName}`, lastname: `${formData.lastName}`, street: `${formData.address}`, addressprofile: `${formData.firstName + formData.lastName}`, city: `${formData.city}`, state: `${formData.state}`, country: `${formData.country}`, zip: `${formData.zipCode}`, mobileno: `${formData.mobileNo}`, FrontEnd_RegNo: `${FrontEnd_RegNo}`, Customerid: `${storedData.id}`
        });
        const body = {
            "con": `{\"id\":\"\",\"mode\":\"ADDADDRESS\",\"appuserid\":\"${storedData.userid}\"}`,
            "f": "Delivery (AddAddress)",
            "p": combinedValue,
        };
        const response = await CommonAPI(body);
        return response?.Data?.rd;
    } catch (error) {
        console.error('addAddress Error:', error);
        return null;
    }
};

export const editAddress = async (index, formData) => {
    try {
        const storedData = getSession('loginUserDetail');
        const storeInit = getSession('storeInit');

        const { FrontEnd_RegNo } = storeInit;
        const addressData = getSession('addressData');

        const combinedValue = JSON.stringify({
            addrid: `${index}`, firstname: `${formData.firstName}`, lastname: `${formData.lastName}`, street: `${formData.address}`, addressprofile: `${formData.firstName + formData.lastName}`, city: `${formData.city}`, state: `${formData.state}`, country: `${formData.country}`, zip: `${formData.zipCode}`, mobileno: `${formData.mobileNo}`, FrontEnd_RegNo: `${FrontEnd_RegNo}`, Customerid: `${storedData.id}`
        });
        const body = {
            "con": `{\"id\":\"\",\"mode\":\"EDITADDRESS\",\"appuserid\":\"${storedData.userid}\"}`,
            "f": "Delivery (EditAddress)",
            "p": combinedValue,
        };
        const response = await CommonAPI(body);
        return response?.Data?.rd;
    } catch (error) {
        console.error('editAddress Error:', error);
        return null;
    }
};

export const deleteAddress = async (addressId) => {
    try {
        const storedData = getSession('loginUserDetail');
        const storeInit = getSession('storeInit');


        const { FrontEnd_RegNo } = storeInit;

        const combinedValue = JSON.stringify({
            addrid: `${addressId}`, FrontEnd_RegNo: `${FrontEnd_RegNo}`, Customerid: `${storedData.id}`
        });
        const body = {
            "con": `{\"id\":\"\",\"mode\":\"DELADDRESS\",\"appuserid\":\"${storedData.userid}\"}`,
            "f": "Delivery (DeleteAddress)",
            "p": combinedValue,
        };
        const response = await CommonAPI(body);
        return response?.Data?.rd;
    } catch (error) {
        console.error('deleteAddress Error:', error);
        return false;
    }
};

export const setDefaultAddress = async (address) => {
    try {
        const storedData = getSession('loginUserDetail');
        const storeInit = getSession('storeInit');



        const { FrontEnd_RegNo } = storeInit;
        const addressId = address?.id;

        const combinedValue = JSON.stringify({
            addrid: `${addressId}`, FrontEnd_RegNo: `${FrontEnd_RegNo}`, Customerid: `${storedData.id}`
        });
        const body = {
            "con": `{\"id\":\"\",\"mode\":\"SETDEFAULTADDRESS\",\"appuserid\":\"${storedData.userid}\"}`,
            "f": "Delivery (SetDefaultAddress)",
            "p": combinedValue,
        };
        const response = await CommonAPI(body);
        return response?.Data?.rd;
    } catch (error) {
        console.error('setDefaultAddress Error:', error);
        return address;
    }
};

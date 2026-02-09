import { CommonAPI } from "../CommonAPI/CommonAPI";

export const getAddressData = async (FrontEnd_RegNo, customerid, data) => {
    try {
        const combinedValue = JSON.stringify({
            FrontEnd_RegNo: `${FrontEnd_RegNo}`, Customerid: `${customerid}`
        });
        const encodedCombinedValue = btoa(combinedValue);
        const body = {
            "con": `{\"id\":\"\",\"mode\":\"GETTBLADDRESSDATA\",\"appuserid\":\"${data?.userid}\"}`,
            "f": "Delivery (fetchData)",
            //  p: encodedCombinedValue,
            // "dp":combinedValue
            p: combinedValue
        };
        const response = await CommonAPI(body);
        return response
    } catch (error) {
        console.log(error);
    }
}

export const handleAddAddress = async (formData, FrontEnd_RegNo, customerid, storeInit, data) => {
    try {

        const combinedValue = JSON.stringify({
            firstname: `${formData.firstName}`, lastname: `${formData.lastName}`, street: `${formData.address}`,
            addressprofile: `${formData.firstName + formData.lastName}`, city: `${formData.city}`, state: `${formData.state}`,
            country: `${formData.country}`, zip: `${formData.zipCode}`, mobileno: `${formData.mobileNo}`, FrontEnd_RegNo: `${FrontEnd_RegNo}`, Customerid: `${customerid}`
        });

        // const encodedCombinedValue = btoa(combinedValue);
        const encodedCombinedValue = (combinedValue);


        const body = {
            "con": `{\"id\":\"\",\"mode\":\"addAddress\",\"appuserid\":\"${data?.userid}\"}`,
            "f": "Delivery (addAddress)",
            p: encodedCombinedValue
        };

        const response = await CommonAPI(body);
        return response;

    } catch (error) {
        console.log(error);
    }
}

export const handleEditAddress = async (editId, formData, FrontEnd_RegNo, customerid, storeInit, data) => {
    try {
        const combinedValue = JSON.stringify({
            addrid: `${editId}`,
            firstname: `${formData.firstName}`,
            lastname: `${formData.lastName}`,
            street: `${formData.address}`,
            addressprofile: `${formData.firstName + formData.lastName}`,
            city: `${formData.city}`,
            state: `${formData.state}`,
            country: `${formData.country}`,
            zip: `${formData.zipCode}`,
            mobileno: `${formData.mobileNo}`,
            FrontEnd_RegNo: `${FrontEnd_RegNo}`,
            Customerid: `${customerid}`
        });

        const b = {
            addrid: `${editId}`,
            firstname: `${formData.firstName}`,
            lastname: `${formData.lastName}`,
            street: `${formData.address}`,
            addressprofile: `${formData.firstName + formData.lastName}`,
            city: `${formData.city}`,
            state: `${formData.state}`,
            country: `${formData.country}`,
            zip: `${formData.zipCode}`,
            mobileno: `${formData.mobileNo}`,
            FrontEnd_RegNo: `${FrontEnd_RegNo}`,
            Customerid: `${customerid}`
        }

        const encodedCombinedValue = (combinedValue);
        const body = {
            "con": `{\"id\":\"\",\"mode\":\"EDITADDRESS\",\"appuserid\":\"${data?.userid}\"}`,
            "f": "Delivery (EditAddress)",
            p: encodedCombinedValue
        };
        const response = await CommonAPI(body);
        return response;

    } catch (error) {
        console.log(error);
    }
}

export const handleDeleteAddress = async (deleteId, data, FrontEnd_RegNo, customerid) => {
    try {

        const combinedValue = JSON.stringify({
            addrid: `${deleteId}`, FrontEnd_RegNo: `${FrontEnd_RegNo}`, Customerid: `${customerid}`
        });

        // const encodedCombinedValue = btoa(combinedValue);
        const encodedCombinedValue = (combinedValue);

        const body = {
            "con": `{\"id\":\"\",\"mode\":\"DELADDRESS\",\"appuserid\":\"${data?.userid}\"}`,
            "f": "Delivery (removeFromCartList)",
            p: encodedCombinedValue
        };

        const response = await CommonAPI(body);

        return response;

    } catch (error) {
        console.log(error);
    }
}

export const handleDefaultSelectionAddress = async (loginCred, addressId, FrontEnd_RegNo) => {

    try {

        let p_ = JSON.stringify({ "addrid": addressId, "FrontEnd_RegNo": FrontEnd_RegNo, "Customerid": loginCred?.id });

        const body = {
            "con": `{\"id\":\"\",\"mode\":\"SETDEFAULTADDRESS\",\"appuserid\":\"${loginCred?.email}\"}`,
            "f": "Delivery (fetchData)",
            p: (p_),
        };

        const response = await CommonAPI(body);
        return response;

    } catch (error) {
        console.log(error);
    }

}
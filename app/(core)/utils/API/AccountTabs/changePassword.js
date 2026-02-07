import { CommonAPI } from "../CommonAPI/CommonAPI";

export const handleChangePassword = async(hashedOldPassword, hashedPassword, hashedConfirmPassword, FrontEnd_RegNo, customerID, email) => {
    try {
        const combinedValue = JSON.stringify({
            oldpassword: `${hashedOldPassword}`, newpassword: `${hashedPassword}`, confirmpassword: `${hashedConfirmPassword}`, FrontEnd_RegNo: `${FrontEnd_RegNo}`, Customerid: `${customerID}`
        });

        // const encodedCombinedValue = btoa(combinedValue);
        const encodedCombinedValue = (combinedValue);
        const body = {
            "con": `{\"id\":\"\",\"mode\":\"CHANGEPASS\",\"appuserid\":\"${email}\"}`,
            "f": "Account (changePassword)",
            "p": encodedCombinedValue
        }

        const response = await CommonAPI(body);
        return response;
    } catch (error) {
        console.log(error);
    }
}
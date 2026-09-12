import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import PriorityHighRoundedIcon from "@mui/icons-material/PriorityHighRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import BlockRoundedIcon from "@mui/icons-material/BlockRounded";
import FmdBadRoundedIcon from "@mui/icons-material/FmdBadRounded";

const eventMessages = [
  {
    eventName: "Approval",
    status: "not_working",
    message: "Successfully Login.",
    icon: CheckRoundedIcon,
  },
  {
    eventName: "Reject",
    status: "not_working",
    message: "Your account request wasn’t approved. Please contact admin.",
    icon: PriorityHighRoundedIcon,
  },
  {
    eventName: "RoamingOff",
    status: "working",
    message:
      "It looks like you're trying to sign in from a location that isn't allowed for your account. Please contact the administrator.",
    icon: FmdBadRoundedIcon,
  },
  {
    eventName: "EcatSuspended",
    status: "working",
    message: "Your account is temporarily suspended. Please contact the admin.",
    icon: BlockRoundedIcon,
  },
  {
    eventName: "LoginOff",
    status: "working",
    message: "You don’t have access to log in. Please contact the admin.",
    icon: BlockRoundedIcon,
  },
  {
    eventName: "EcatOff",
    status: "working",
    message:
      "Your account does not have login access. Please contact the administrator.",
    icon: BlockRoundedIcon,
  },
  {
    eventName: "ProcatOff",
    status: "working",
    message:
      "Your account does not have login access. Please contact the administrator.",
    icon: BlockRoundedIcon,
  },
  {
    eventName: "Active",
    status: "working",
    message: "No message shown on the front end. Login is successful.",
    icon: CheckRoundedIcon,
  },
  {
    eventName: "Deactive",
    status: "working",
    message:
      "Your account has been deactivated. Please contact the administrator for assistance.",
    icon: BlockRoundedIcon,
  },
  {
    eventName: "ExpiryReminder",
    status: "working",
    message:
      "Your account will expire soon. Please renew your account subscription to avoid service interruption.",
    icon: AccessTimeRoundedIcon,
  },
  {
    eventName: "ExpireAccount",
    status: "working",
    message: "Your account has expired. Please contact the admin.",
    icon: AccessTimeRoundedIcon,
  },
  {
    eventName: "IncorrectPassword",
    status: "working",
    message: "Incorrect password. Please try again.",
    icon: PriorityHighRoundedIcon,
  },
  {
    eventName: "InvalidUser",
    status: "working",
    message: "User not found. Please check your details.",
    icon: PriorityHighRoundedIcon,
  },
  {
    eventName: "TimeOff",
    status: "Account Expired",
    message: "Your account has expired. Please contact the administrator.",
    icon: AccessTimeRoundedIcon,
  },
  {
    eventName: "Pending",
    status: "working",
    message:
      "Your account is currently under verification. Our Team will review your request.",
    icon: AccessTimeRoundedIcon,
  },
];

export const eventUIMap = {
  Approved: {
    type: "Approved",
    title: "Approved by Admin",
    icon: CheckRoundedIcon,
    color: "success",
  },
  Approval: {
    type: "Approval",
    title: "Approved by Admin",
    icon: CheckRoundedIcon,
    color: "success",
  },
  Pending: {
    type: "Pending",
    title: "Approval Pending",
    icon: AccessTimeRoundedIcon,
    color: "warning",
  },
  Reject: {
    type: "Reject",
    title: "Request Not Approved",
    icon: PriorityHighRoundedIcon,
    color: "error",
  },
  IncorrectPassword: {
    type: "Incorrect Password",
    title: "Login Failed",
    icon: PriorityHighRoundedIcon,
    color: "error",
  },
  InvalidUser: {
    type: "Invalid User",
    title: "User Not Found",
    icon: PriorityHighRoundedIcon,
    color: "error",
  },
  Deactive: {
    type: "Deactive",
    title: "Account Inactive",
    icon: BlockRoundedIcon,
    color: "error",
  },
  ExpireAccount: {
    type: "Expire Account",
    title: "Account Expired",
    icon: AccessTimeRoundedIcon,
    color: "error",
  },
  RoamingOff: {
    type: "Roaming Off",
    title: "Access Restricted",
    icon: FmdBadRoundedIcon,
    color: "error",
  },
  EcatSuspended: {
    type: "Ecat Suspended",
    title: "Account Suspended",
    icon: BlockRoundedIcon,
    color: "error",
  },
  EcatOff: {
    type: "Ecat Off",
    title: "Access Restricted",
    icon: BlockRoundedIcon,
    color: "error",
  },
  ProcatOff: {
    type: "Procat Off",
    title: "Access Restricted",
    icon: BlockRoundedIcon,
    color: "error",
  },
  Active: {
    type: "Active",
    title: "Login Successful",
    icon: CheckRoundedIcon,
    color: "success",
  },
  TimeOff: {
    type: "TimeOff",
    title: "Account Expired",
    icon: AccessTimeRoundedIcon,
    color: "warning",
  },
};

export function getEventMessage(apiResponse) {
  try {
    const eventName = apiResponse?.Data?.rd?.[0]?.EventName;

    if (!eventName) {
      return {
        eventName: null,
        message: "No event found in response.",
      };
    }

    const event = eventMessages.find((e) => e.eventName === eventName);

    if (!event) {
      return {
        eventName,
        message: "No matching event configuration found.",
        status: false,
      };
    }

    return {
      eventName,
      message: event.message,
      status: event.status,
    };
  } catch (error) {
    return {
      eventName: null,
      message: "Something went wrong while processing the response.",
      status: false,
    };
  }
}


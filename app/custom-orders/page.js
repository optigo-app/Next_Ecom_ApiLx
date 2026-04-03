import React from "react";
import OrderForm from "@/app/theme/fgstore.web/CustomOrder";
import OrderFormApp from "@/app/theme/fgstore.mapp/home/CustomOrder";
import { LocalSetup } from "../env";

const page = () => {
  if (LocalSetup === "fgstore.mapp") return <OrderFormApp />;
  return <OrderForm />;
};

export default page;

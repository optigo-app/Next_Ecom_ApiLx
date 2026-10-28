'use client';
import React from 'react';
import { useRegisterPage } from "@/app/(core)/hooks/Auth/useRegisterPage";
import B2CRegister from './B2CRegister';
import B2BRegister from './B2bRegister';
import B2BLRegister from './B2C.base';

const Page = ({ searchParams, storeInit: propStoreInit, params }) => {
  const { storeInit, isB2B } = useRegisterPage(propStoreInit);

  return isB2B ? (
    <B2BRegister searchParams={searchParams} params={params} storeInit={storeInit} />
  ) : (
    <B2CRegister searchParams={searchParams} params={params} storeInit={storeInit} />
  );
};

export default Page;

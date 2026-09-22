'use client';
import React, { useEffect, useState } from 'react';
import B2CRegister from './B2CRegister';
import B2BRegister from './B2bRegister';
import B2BLRegister from './B2C.base';

const Page = ({ searchParams, storeInit: propStoreInit, params }) => {
  const [storeInit, setStoreInit] = useState(propStoreInit);

  useEffect(() => {
    if (!storeInit) {
      try {
        const local = sessionStorage.getItem('storeInit');
        if (local) setStoreInit(JSON.parse(local));
      } catch (e) {
        console.error(e);
      }
    }
  }, [storeInit]);

  const isB2B = storeInit?.IsSignUpWithCompanyInfo === 1;

  return isB2B ? (
    <B2BRegister searchParams={searchParams} params={params} storeInit={storeInit} />
  ) : (
    <B2CRegister searchParams={searchParams} params={params} storeInit={storeInit} />
  );
};

export default Page;
import React, { useEffect, useState } from 'react';
import "./DWSRprintComp.scss";
import { handleOrderImageError } from '@/app/(core)/utils/API/AccountTabs/OrderHistory';

const DWSRprintComp = () => {
    // console.log(JSON.parse(sessionStorage.getItem('dwsrdata')));;
    // const location = useLocation();
    // const bigData = location.state?.bigData;

    const [bigData, setBigData] = useState([]);
    const [companyHeader, setCompanyHeader] = useState('');

    // Retrieve bigData from sessionStorage
    useEffect(() => {
        const storedData = JSON.parse(sessionStorage.getItem('dwsrdata'));
        if (storedData) {
            setBigData(storedData?.data);
            setCompanyHeader(storedData?.headerData)
        }
    }, []);

  return (
    <>
    <div className='dsr_Account_SMR'>
        <div className=' dsr_container'>
            <div className='print_btn_none_dsr' style={{display:'flex', justifyContent:'flex-end', paddingBottom:'10px'}}><button className='printBtnDSR'  onClick={() => window.print()}>Print</button></div>
            <div className='dsr_headtitle'>DESIGN WISE SALES PRINT</div>
            <div>
                <div style={{fontSize:'16px', fontWeight:'bold'}} className='pd_dwse header_content_dsr2'>{companyHeader?.CompanyFullName}</div>
                <div className='pd_dwse header_content_dsr'>{companyHeader?.CompanyAddress}</div>
                <div className='pd_dwse header_content_dsr'>{companyHeader?.CompanyAddress2}</div>
                <div className='pd_dwse header_content_dsr'>{companyHeader?.CompanyAddress2} - {companyHeader?.CompanyPinCode} , {companyHeader?.CompanyState}({companyHeader?.CompanyCountry})</div>
                <div className='pd_dwse header_content_dsr'>T {companyHeader?.CompanyTellNo}</div>
                <div className='pd_dwse header_content_dsr'>{companyHeader?.CompanyEmail} | {companyHeader?.CompanyWebsite}</div>
            </div>
            <div className='card_loop_dsr'>
                {
                    bigData?.map((e, i) => {
                        return (
                            <React.Fragment key={i}>
                                <div className='card_section_dsr'>
                                    <div><img src={e?.imgsrc} alt='#designImg' className='viewImage_dsr' onError={handleOrderImageError} /></div>
                                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                                        <div className='card_content_dsr2'>{e?.designno}</div>
                                        <div className='card_content_dsr3'>Netwt: {e?.DesignNetWt?.toFixed(3)}</div>
                                    </div>
                                    <div className='card_content_dsr w_100_dsr_page'>Dia/cs wt:{e?.diamondwt?.toFixed(3)}/{e?.colorstonewt?.toFixed(3)}</div>
                                    <div className='card_content_dsr w_100_dsr_page'>Purchase Count:{e?.salescount}</div>
                                </div>
                            </React.Fragment>
                        )
                    })
                }
            </div>
        </div>
    </div>
    </>
  )
}

export default DWSRprintComp


"use client";

import React from 'react'
import './Collection.modul.scss'
 

const OldCollection = ( ) => {
    const categories = {
        image: [
          `/category/elvee/categorybanner01.png`,
          `/category/elvee/categorybanner02.png`,
          `/category/elvee/categorybanner03.png`,
          `/category/elvee/categorybanner04.png`,
      
         
        ]
      }

    return (
        <div className='el_Collection_main' id="elveeGiftMainId" name='elveeGiftMainId'>
            <p className='gorGiftBoxMainTitleMobile'>Gifting Made Easy</p>
            <div className='gorGiftMain'>
                <div className='gorGiftBox1'>
                    <div>
                        <h2 className='gorGiftBoxMainTitleWeb'>WOMEN</h2>
                        <img loading="lazy" src={categories?.image?.[0]} className='gorGiftBox1Images' height="45%" width="45%" alt='gift-for-womens' />
                        {/* <img loading="lazy" src={`${storImagePath()}/images/HomePage/Promo/Set/1/promoSetBanner1Img1.jpg`} className='gorGiftBox1Images' /> */}
                    </div>
                    <div className='gorGiftBox1Sub1'>
                        <h2 className='gorGiftBoxMainTitleWeb'>KIDS</h2>
                        <img loading="lazy" src={categories?.image?.[1]} className='gorGiftBox1Images' height="45%" width="45%" alt='gift-for-kids' />
                    </div>
                </div>
                <div className='gorGiftBox1'>
                    <div>
                        <h2 className='gorGiftBoxMainTitleWeb'>MEN</h2>
                        <img loading="lazy" src={categories?.image?.[2]} className='gorGiftBox1Images' height="45%" width="45%" alt='gift-for-men' />
                    </div>
                    <div className='gorGiftBox2Sub1' >
                        <h2 className='gorGiftBoxMainTitleWeb'>GIFTS</h2>
                        <img loading="lazy" src={categories?.image?.[3]} className='gorGiftBox1Images' height="45%" width="45%" alt='gifts' />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OldCollection

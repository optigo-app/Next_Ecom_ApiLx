
"use client";


import React from 'react'
import './SocialMedia.modul.scss'
import { Button } from '@mui/material';
import { AiFillInstagram } from 'react-icons/ai';
import { useNextRouterLikeRR } from '@/app/(core)/hooks/useLocationRd';
 

const SocialMedia = () => {
    const { push } = useNextRouterLikeRR();
    const navigation = push;

    const photos = [
        {
            image: "/WebSiteStaticImage/social/diamondtine/socialmediabanner1.png",
        },
        {
            image: "/WebSiteStaticImage/social/diamondtine/socialmediabanner2.png",
        },
        {
            image: "/WebSiteStaticImage/social/diamondtine/socialmediabanner3.png",
        },
        {
            image: "/WebSiteStaticImage/social/diamondtine/socialmediabanner4.png",
        },
        {
            image: "/WebSiteStaticImage/social/diamondtine/socialmediabanner5.png",
        },
    ];

    

    const Url = `https://www.instagram.com/`;
    const Url2 = `https://www.instagram.com/`;
    const DomainConnect = 1 ? Url : Url2;


    const HandleGoogleAn = (ClickedPostNo) => {
        GoogleAnalytics.event({
            action: "Social Media Post Analtyics",
            category: `Social Media Post`,
            label: `User Clicked On Post Number ${ClickedPostNo}`,
        });
    }

    return (
        <div className='dt_SocialMedia' onContextMenu={(e) => e.preventDefault()}>
            <p className='smr_bestseler1Title'>Follow Us On Instagram</p>
            <div className='dt_SocialmediawidgetsComponentsCard'>
                <div className="dt_instagram_gallery">
                    {photos?.map((photo, index) => (
                        <div key={index} className="dt_instagram_photo" onClick={() => {
                            navigation(DomainConnect);
                            HandleGoogleAn(index + 1)
                        }}>
                            {/* <img src={storImagePath() + photo?.image} alt={`Instagram Photo ${index + 1}`} loading='lazy' /> */}
                            <img src={photo?.image} alt={`Instagram Photo ${index + 1}`} loading='lazy' />
                            <div className="dt_socialMedioverlay"></div>
                        </div>
                    ))}
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Button onClick={() => navigation(DomainConnect)} variant="contained" color="secondary" style={{ backgroundColor: '#a8807c', marginTop: '1rem', boxShadow: 'none' }} startIcon={<AiFillInstagram />}>
                    Follow us
                </Button>
            </div>

        </div>
    )
}

export default SocialMedia
"use client";
import React, { useState } from 'react';
import './AppointmentPage.scss';
import AppointmentForm from './AppointmentForm';

export const services = [
    {
        title: 'Free Shipping',
        description: 'Now it\'s easier for customers to get the beautiful and sustainable diamonds they want without paying extra for shipping.',
        image: '/images/HomePage/OurServices/free-ship.png',
        link: '#',
        btnText: "Read More"
    },
    {
        title: 'Free 30 Day Returns',
        description: 'Forevery offers a hassle-free jewelry shopping experience with its 30-DAY Returns policy. Get ready to shop confidently.',
        image: '/images/HomePage/OurServices/free-return.png',
        link: '#',
        btnText: "Read More"
    },
    {
        title: 'Free Lifetime Warranty',
        description: 'Shop with Confidence; a lifetime warranty covers every piece of fine jewelry you buy.',
        image: '/images/HomePage/OurServices/waranty.png',
        link: '#',
        btnText: "Read More"
    },
    {
        title: '60-Days Free Resizing',
        description: 'Within 60 days of purchase, resize your jewelry to the perfect fit without any additional costs.',
        image: '/images/HomePage/OurServices/resizing.png',
        link: '#',
        btnText: "Read More"
    },
    {
        title: 'Free Engraving',
        description: 'Add sentimental value to the piece and make it a unique and meaningful gift.',
        image: '/images/HomePage/OurServices/engraving.png',
        link: '#',
        btnText: "Read More"
    }
];

const AppointmentPage = ({assetBase}) => {
    const [selectedItem, setSelectedItem] = useState({});
    const items = [
        { id: 1, title: 'Engagement Ring', image: '/Appointment/appointment-jewel-1.png' },
        { id: 2, title: 'Wedding Ring', image: '/Appointment/appointment-jewel-2.png' },
        { id: 3, title: 'Diamonds', image: '/Appointment/appointment-jewel-3.png' },
        { id: 4, title: 'Fine Jewelry', image: '/Appointment/appointment-jewel-4.png' },
        { id: 5, title: 'High End Jewelry', image: '/Appointment/appointment-jewel-5.png' },
        { id: 6, title: 'Letter Diamonds', image: '/Appointment/appointment-jewel-6.png' }
    ];

    const hanldeBook = (item) => {
        setSelectedItem(item);
    }

    return (
        <div className="smr_appointment-page">
            <div
                className="smr_bg-imageCart"
                style={{
                    backgroundImage: `url(${assetBase}/Appointment/MainBanner.png)`,
                }}
            >
                <div className="smr_overlay" />
                <div className="smr_text-container">
                    <div className="smr_textContainerData">
                        <h1
                            className="smr_designCounttext"
                        >
                            BOOK AN APPOINTMENT<br />
                        </h1>
                    </div>
                </div>
            </div>
            <p className="smr_intro">
                Welcome to Forevery your premier destination for exquisite labgrown diamonds.
                Schedule an appointment today to experience the brilliance and beauty of our lab-grown diamonds and let Forevery help you find the perfect piece to cherish forever.
                Experience the brilliance of lab-grown diamonds with Forevery.
                Book an appointment now to view our exquisite collection and discover the sustainable and ethical beauty of labgrown diamonds.
            </p>
            <div className="smr_itemsMainDiv">
                {Object.keys(selectedItem).length === 0 && selectedItem.constructor === Object &&
                    <div className="smr_itemsSubDiv">
                        <h3>The kind of jewelry you are interested in?</h3>
                        <div className="smr_items-grid">
                            {items.map(item => {
                                const image = `${assetBase}${item?.image}`;
                                 return <div className="smr_item-card" key={item.id}>
                                    <div className="smr_imageDiv">
                                        <img src={image} alt={item?.title} />
                                    </div>
                                    <div className="smr_item-content">
                                        <h2>{item?.title}</h2>
                                        <button className='smr_btn_a'  onClick={() => hanldeBook(item)}>BOOK NOW</button>
                                    </div>
                                </div>
                            })}
                        </div>
                    </div>
                }
                {Object.keys(selectedItem).length !== 0 && selectedItem.constructor === Object &&
                    <AppointmentForm selectedItem={selectedItem}  setSelectedItem={setSelectedItem}/>
                }
            </div>
        </div>
    );
};

export default AppointmentPage;

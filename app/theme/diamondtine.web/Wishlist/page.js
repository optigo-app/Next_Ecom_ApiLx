import React from 'react'
import Wishlist from './WishList'
import ElveeWishlist from './Wishlist/Wishlist'


const page = ({ storeInit }) => {
  return (
    <ElveeWishlist storeInit={storeInit} />
  )
}

export default page
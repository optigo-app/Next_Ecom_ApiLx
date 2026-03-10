import React from 'react'
import PaymentComponent from '@/app/(core)/utils/PaymentComponent/PaymentComponentMobile'
import MobileNavbar from './NavigationBar'

const Payment = ({ storeinit }) => {
  return (
    <div>
      <MobileNavbar/>
      <PaymentComponent bgcolor={"black"} storeinit={storeinit} />
      </div>
  )
}

export default Payment
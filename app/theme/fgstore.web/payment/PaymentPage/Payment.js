import React from 'react'
import PaymentComponent from '@/app/(core)/utils/PaymentComponent/PaymentComponent'

const Payment = ({ storeinit }) => {
  return (
    <div><PaymentComponent bgcolor={"#103cb4"} storeinit={storeinit} /></div>
  )
}

export default Payment
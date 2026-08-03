import React from 'react'
import PaymentComponent from '@/app/(core)/utils/PaymentComponent/PaymentComponent'

const Payment = ({ storeinit }) => {
  return (
    <div><PaymentComponent bgcolor={"#0d1232"} storeinit={storeinit} /></div>
  )
}

export default Payment
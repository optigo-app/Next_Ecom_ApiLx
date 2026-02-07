import Lookbook from './Lookbook'

const page = ({ storeInit }) => {
    return (
        <Lookbook key={`lookbook-${storeInit?.token}`} storeInit={storeInit} />
    )
}

export default page
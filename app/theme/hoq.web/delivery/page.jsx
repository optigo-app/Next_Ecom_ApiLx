import AddressManagement from "./_deliComp/Delivery";

const ProductList = async ({ params, searchParams, storeinit }) => {
    return (
        <>
            <AddressManagement params={params} searchParams={searchParams} storeinit={storeinit} />
        </>
    );
};

export default ProductList;



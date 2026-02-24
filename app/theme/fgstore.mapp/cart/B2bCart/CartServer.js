import CartPageClient from "./Cart";
import { useStore } from "@/app/(core)/contexts/StoreProvider";

export default function CartPage({ storeinit, visiterId }) {
    const { islogin, setCartCountNum } = useStore();

    return (
        <div>
            <CartPageClient
                visiterId={visiterId}
                islogin={islogin}
                setCartCountNum={setCartCountNum}
                storeinit={storeinit}
            />
        </div>
    );
}

import React, { Suspense } from "react";
import ProfilePage from "../theme/fgstore.mapp/ProfilePage/page";

// ProfilePage uses useSearchParams() which requires a Suspense boundary
// in Next.js App Router when rendered from a Server Component route.
const page = () => {
    return (
        <Suspense fallback={null}>
            <ProfilePage />
        </Suspense>
    );
};

export default page;

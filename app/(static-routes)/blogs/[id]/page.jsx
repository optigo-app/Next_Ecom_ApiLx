import React from 'react';
import { notFound } from 'next/navigation';
import blogData from '../../../theme/elvee.web/Blogs/BlogData';
import { getActiveTheme } from "@/app/(core)/lib/getActiveTheme";
import { themeMap } from "@/app/(core)/utils/ThemeMap";


// export async function generateStaticParams() {
//   return blogData.map((article) => ({
//     id: article.id.toString(),
//   }));
// }

export default async function BlogDynamicServerPage({ params }) {
  //  Await params to access the dynamic id from the URL matching /blogs/[id]
  const { id } = await params;


  const articleExists = blogData.some((article) => article.id.toString() === id.toString());
  if (!articleExists) {
    notFound();
  }

 

  try {

    const theme = await getActiveTheme().catch(() => "default");
        const themeData = themeMap[theme] || themeMap["default"];
    const DetailPage = (
      await import(`@/app/theme/${themeData.page}/Blogs/BlogDetail.jsx`)
    ).default;

    return <DetailPage id={id} />;
  } catch (error) {
    console.error("Failed to dynamically load the BlogDetail component layout:", error);
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Unable to load article layout structure.</h2>
      </div>
    );
  }
}
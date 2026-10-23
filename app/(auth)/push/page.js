import React from "react";
import PushDashboardClient from "./PushDashboardClient";

export const dynamic = "force-dynamic";

/**
 * No-Index Metadata to ensure this admin/push development route
 * is completely hidden and excluded from all search engines.
 */
export const metadata = {
  title: "Database Sync & Push Control Panel",
  description: "Internal developer panel for pushing and syncing SQLite database catalogs and policies.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function PushPage() {
  return <PushDashboardClient />;
}

"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Box, Typography } from "@mui/material";
import { ALBUM_PARAM } from "@/app/(core)/utils/album/albumScopeUrl";
import { useStore } from "@/app/(core)/contexts/StoreProvider";
import { useAlbumAuth } from "@/app/(core)/hooks/main/useAlbumAuth";

/**
 * Slim album context header for the product listing.
 * Renders nothing unless the URL carries ?album=<key>.
 * The listing itself is filtered server-side (see db/procedures/albumScope.js).
 * Also signs in guests opening a shared-album link directly, so the listing
 * uses that customer's pricing table (same flow as the overlay).
 */
export default function AlbumScopeBar({ domain }) {
  const searchParams = useSearchParams();
  const albumKey = searchParams.get(ALBUM_PARAM);
  const [album, setAlbum] = useState(null);
  const { islogin } = useStore();

  useEffect(() => {
    if (!albumKey) return;
    const controller = new AbortController();
    const d = domain ? `domain=${encodeURIComponent(domain)}&` : "";
    fetch(`/api/sqlite/exclusive-albums?${d}album=${encodeURIComponent(albumKey)}&includeDesigns=false`, { signal: controller.signal })
      .then((r) => r.json())
      .then((data) => setAlbum({ row: data?.Data?.rd?.[0] || null, blocked: data?.Data?.blockedStatus || null }))
      .catch(() => {});
    return () => controller.abort();
  }, [albumKey, domain]);

  useAlbumAuth(album?.row?.CustomerId, Boolean(albumKey) && !islogin && Boolean(album?.row));

  if (!albumKey || !album?.row) return null;

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: 1.5, mb: 2, px: { xs: 1, md: 0 } }}>
      <Box>
        <Typography sx={{ fontSize: "0.7rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "#8a7a70" }}>
          Shared album
        </Typography>
        <Typography sx={{ fontSize: "1.25rem", fontWeight: 500, color: "#0f3d4c" }}>
          {album.row.albumName || "Album"}
        </Typography>
        {album.blocked && (
          <Typography sx={{ fontSize: "0.8rem", color: "#b42318" }}>This album is {album.blocked}.</Typography>
        )}
      </Box>
    </Box>
  );
}

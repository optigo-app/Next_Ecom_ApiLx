"use client";

import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { useServerInsertedHTML } from "next/navigation";
import { useState } from "react";

export function EmotionRegistry({ children }) {
  const [cache] = useState(() => {
    const c = createCache({ key: "css", prepend: true });
    c.compat = true; // required for MUI SSR
    return c;
  });

  useServerInsertedHTML(() => {
    const inserted = cache.inserted;
    const names = Object.keys(inserted);

    if (names.length === 0) return null;

    return (
      <style
        data-emotion={`css ${names.join(" ")}`}
        dangerouslySetInnerHTML={{
          __html: names.map((name) => inserted[name]).join(" "),
        }}
      />
    );
  });

  return <CacheProvider value={cache}>{children}</CacheProvider>;
}

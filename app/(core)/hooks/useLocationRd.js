"use client";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export function useNextRouterLikeRR() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const PrefetchLink = (href) => (
    <Link href={href} prefetch={true} style={{ display: "none" }} />
  );

  const decodedObject = () => {
    const obj = {};
    for (const [key, value] of searchParams.entries()) {
      obj[key] = decodeURIComponent(value);
    }
    return obj;
  };

  return {
    push: (url) => router.push(url),
    replace: (url) => router.replace(url),
    back: () => router.back(),
    pathname,
    search: searchParams.toString() ? `?${searchParams.toString()}` : "",
    get searchParams() {
      return decodedObject();
    },
    get queryString() {
      return searchParams.toString(); // gives `email=info%40codedthemes.com`
    },
  };
}


export function useNavigate() {
  const nav = useNextRouterLikeRR();
  return (url) => nav.push(url);
}
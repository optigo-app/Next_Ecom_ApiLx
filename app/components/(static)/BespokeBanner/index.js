import Link from "next/link";
import Image from "next/image";
import "./BespokeBanner.scss";
import { assetBase } from "@/app/(core)/lib/ServerHelper";

const BespokeBanner = () => {


  return (
    <div className="hero-container">
      <div className="hero-content">
        <div
          className="text-content"
        >
          <h1 className="title_bep">
            Crafting Timeless Bespoke Jewelry for Every Occasion
          </h1>
          <p>
            Experience the art of bespoke jewelry, where every piece is designed
            exclusively for you. From personalized necklaces and bracelets to
            custom rings and earrings, our artisans combine traditional
            craftsmanship with modern design. Choose your gemstones, metals, and
            styles to create a piece that reflects your unique personality and
            style.
          </p>
          <Link
            href="/bespoke-jewelry"
            className="shop-button"
          >
            CREATE YOUR BESPOKE PIECE
            <span className="arrow">→</span>
          </Link>
        </div>

        <div
          className="image-content"
        >
          <Image
            src={`/${assetBase}/images/HomePage/bespoke/2.png`}
            alt="Luxury Diamond Jewelry"
            className="hero-image"
            width={900}
            height={700}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 900px"
            loading="lazy"
            quality={75}
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
          />
        </div>
      </div>
    </div>
  );
};

export default BespokeBanner;

import Image from "next/image";
import Link from "next/link";
import { BsArrowRight } from "react-icons/bs";
import { assetBase } from "@/app/(core)/lib/ServerHelper";
import "./AppointmentBanner.scss";

const AppointmentBanner = () => {
  const Banner = `/${assetBase}/Appointment/appointment.jpg`;

  return (
    <section className="smr_AppointmentBanner">
      <div className="center_mode_banner">
        <div className="image_banner_smr">
          <Image
            src={Banner}
            alt="Appointment banner"
            className="banner-img"
            width={1200}
            height={600}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1200px"
            loading="lazy"
            quality={80}
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
          />

          <div className="content_detail_smr">
            <h1>Book an Appointment</h1>
            <p>
              At Diamond, we believe in offering personalized experiences to
              each of our clients. Our team is dedicated to providing
              exceptional service and ensuring that your visit is nothing short
              of outstanding. Let us make your appointment memorable with our
              expert guidance and attention to detail. Schedule your visit today
              and let us help you shine.
            </p>
            <Link href="/appointment" className="banner-btn">
              Visit Us <BsArrowRight className="moving-arrow" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppointmentBanner;

'use client';

import "./FaqSection.modul.scss";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import {
  productfaqData,
  careRepairFAQ,
  ordersPaymentsFAQ,
  returnsExchangeFAQ,
} from "@/app/components/(static)/Constants/FaqList";
import { IoChevronDown } from "react-icons/io5";
import { IoChevronUp } from "react-icons/io5";
import { useState } from "react";

const FaqSection = () => {
  return (
    <div className="hoq_main_FaqSection">
      <FAQComponent
        data={productfaqData}
        title={
          "orem . Aliquam dicta beatae praesentiumx odit?" ||
          "Product & Diamond FAQ"
        }
      />
      <FAQComponent
        data={ordersPaymentsFAQ}
        title={
          "orem . Aliquam dicta beatae praesentiumx odit?" ||
          "Orders & Payments"
        }
      />
      <FAQComponent
        data={careRepairFAQ}
        title={
          "orem . Aliquam dicta beatae praesentiumx odit?" || "Care & Repair"
        }
      />
      <FAQComponent
        data={returnsExchangeFAQ}
        title={
          "orem . Aliquam dicta beatae praesentiumx odit?" ||
          "Returns & Exchange"
        }
      />
    </div>
  );
};

export default FaqSection;

const FAQComponent = ({ data = [], title }) => {
  const [expandedAccordion, setExpandedAccordion] = useState(null);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpandedAccordion(isExpanded ? panel : null);
  };
  return (
    <section>
      <div className="head">
        <h1>{title}</h1>
      </div>
      {data.map((faqItem, index) => (
        <div className="custom-accordian" key={index}>
          <Accordion
            key={index}
            expanded={expandedAccordion === `panel-${index}`}
            onChange={handleChange(`panel-${index}`)}
          >
            <AccordionSummary
              aria-controls={`panel-${index}-content`}
              id={`panel-${index}-header`}
              expandIcon={
                expandedAccordion === `panel-${index}` ? (
                  <IoChevronUp size={14} />
                ) : (
                  <IoChevronDown size={14} />
                )
              }
            >
              <h1 className="question">
                {`orem . Aliquam dicta beatae praesentium temporibus ex odit?` ||
                  faqItem.question}
              </h1>
            </AccordionSummary>
            <AccordionDetails>
              <p className="answer">
                {`orem . Aliquam dicta beatae praesentium temporibus ex odit?
orem . Aliquam dicta beatae praesentium temporibus ex odit?
orem . Aliquam dicta beatae praesentium temporibus ex odit?
orem . Aliquam dicta beatae praesentium temporibus ex odit?` || faqItem.answer}
              </p>
            </AccordionDetails>
          </Accordion>
        </div>
      ))}
    </section>
  );
};

"use client";

import React, { useState } from "react";

export default function NewsletterForm({ storeData }) {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const isValidEmail = (val) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

    if (!email.trim()) {
      setResult("Email is required.");
      setLoading(false);
      return;
    }
    if (!isValidEmail(email)) {
      setResult("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      const newslater = storeData?.newslatter;
      if (newslater && email) {
        const newsletterUrl = `${newslater}${email}`;
        const res = await fetch(newsletterUrl);
        const text = await res.text();
        setResult(text);
        setEmail("");

        setTimeout(() => setResult(null), 3000);
      }
    } catch (err) {
      setResult("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="email-input" onSubmit={handleSubmit}>
      <div className="email-input-with-error">
        <input
          type="email"
          placeholder="Type Your Email"
          aria-label="Email address for newsletter"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {loading ? (
          <span className="for-error-message-news">Loading...</span>
        ) : (
          result && (
            <span
              className="for-error-message-news"
              style={{
                color: result.startsWith("Thank You!") ? "#04AF70" : "#D32F2F", // Slightly softer red
              }}
            >
              {result}
            </span>
          )
        )}
      </div>
      <button
        type="submit"
        className="btn_for_new"
        disabled={loading}
      >
        {loading ? "Subscribing..." : "I'm Ready for Jewelry Updates"}
      </button>
    </form>
  );
}
// "use client";

// import React, { useState } from "react";

// export default function NewsletterForm({ storeData }) {
//   const [email, setEmail] = useState("");
//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     const isValidEmail = (val) =>
//       /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

//     if (!email.trim()) {
//       setResult("Email is required.");
//       setLoading(false);
//       return;
//     }
//     if (!isValidEmail(email)) {
//       setResult("Please enter a valid email address.");
//       setLoading(false);
//       return;
//     }

//     try {
//       const newslater = storeData?.newslatter;
//       if (newslater && email) {
//         const newsletterUrl = `${newslater}${email}`;
//         const res = await fetch(newsletterUrl);
//         const text = await res.text();
//         setResult(text);
//         setEmail("");

//         setTimeout(() => setResult(null), 3000);
//       }
//     } catch (err) {
//       setResult("Something went wrong.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form className="email-input" onSubmit={handleSubmit}>
//       <div className="email-input-with-error">
//         <input
//           type="email"
//           placeholder="Type Your Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />
//         {loading ? (
//           <span className="for-error-message-news">Loading...</span>
//         ) : (
//           result && (
//             <span
//               className="for-error-message-news"
//               style={{
//                 color: result.startsWith("Thank You!") ? "#04AF70" : "#FF0000",
//               }}
//             >
//               {result}
//             </span>
//           )
//         )}
//       </div>
//       <button type="submit" className="btn_for_new">
//         I'm Ready for Jewelry Updates
//       </button>
//     </form>
//   );
// }

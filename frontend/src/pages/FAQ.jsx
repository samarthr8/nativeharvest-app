import { useState } from "react";
import SEO from "../components/SEO";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "Do you use any artificial preservatives?",
      answer: "Absolutely not. At NativeHarvest, we rely entirely on traditional preservation methods. Our pickles are sun-cured and preserved naturally using high-quality cold-pressed oils, sea salt, and authentic Indian spices, just like our grandmothers used to make."
    },
    {
      question: "What is the shelf life of your products?",
      answer: "Since our products are completely natural, we recommend consuming them within 9 to 12 months from the date of manufacture. To ensure longevity, always use a dry spoon and store the jars in a cool, dry place away from direct sunlight."
    },
    {
      question: "Are your cold-pressed oils refined?",
      answer: "No, our oils are 100% unrefined, unbleached, and cold-pressed (Kachi Ghani). This traditional extraction method ensures that the oil retains its natural aroma, flavor, and essential nutrients that are otherwise destroyed by industrial heat and chemicals."
    },
    {
      question: "How long does shipping take?",
      answer: "We ship our small batches directly from our facility in Madhya Pradesh. Deliveries typically take 5-7 business days depending on your location in India. You can track your package anytime using the 'Track Order' link on our website."
    },
    {
      question: "Do you accept returns or exchanges?",
      answer: "Because we deal in consumable food products, we cannot accept returns for opened items due to hygiene and safety reasons. However, if your glass jars arrive damaged or broken in transit, please contact us within 48 hours with a photograph, and we will immediately issue a replacement or refund."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div style={{ background: "#f5f7f6", minHeight: "100vh", padding: "60px 20px" }}>
      <SEO
        title="FAQ | NativeHarvest India"
        description="Frequently asked questions about NativeHarvest products, shipping, payments, and returns."
      />
      <div style={{
        maxWidth: "800px",
        margin: "0 auto",
        background: "white",
        padding: "50px 40px",
        borderRadius: "16px",
        boxShadow: "0 6px 20px rgba(0,0,0,0.05)"
      }}>
        
        <h1 style={{ color: "#2f6f4e", textAlign: "center", marginBottom: "15px", fontSize: "32px" }}>
          Frequently Asked Questions
        </h1>
        <p style={{ textAlign: "center", opacity: 0.7, marginBottom: "40px", fontSize: "16px" }}>
          Everything you need to know about our traditional methods, products, and shipping.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            
            return (
              <div 
                key={index} 
                style={{
                  border: "1px solid #eee",
                  borderRadius: "10px",
                  overflow: "hidden",
                  transition: "all 0.3s ease"
                }}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "20px",
                    background: isOpen ? "#f9fbfxa" : "white",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    fontSize: "16px",
                    fontWeight: "600",
                    color: isOpen ? "#2f6f4e" : "#333"
                  }}
                >
                  {faq.question}
                  <span style={{ 
                    fontSize: "20px", 
                    color: "#2f6f4e",
                    transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                    transition: "transform 0.3s ease"
                  }}>
                    +
                  </span>
                </button>
                
                {isOpen && (
                  <div style={{
                    padding: "0 20px 20px 20px",
                    background: "#f9fbfxa",
                    color: "#555",
                    lineHeight: "1.6",
                    fontSize: "15px"
                  }}>
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: "center", marginTop: "40px", paddingTop: "30px", borderTop: "1px solid #eee" }}>
          <p style={{ fontSize: "15px", opacity: 0.8 }}>
            Still have questions? We are here to help.
          </p>
          <a href="mailto:nativeharvestindia@gmail.com" style={{ color: "#2f6f4e", fontWeight: "600", textDecoration: "none", marginTop: "8px", display: "inline-block" }}>
            nativeharvestindia@gmail.com
          </a>
        </div>

      </div>
    </div>
  );
};

export default FAQ;
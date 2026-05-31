import React, { useState } from "react";
import "./Contact.css"

function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Added handleChange
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:8000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        alert("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        alert("Failed to send message");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      />



      <div className="contact-form-container">
        <h2>Get In Touch</h2>
        <p className="subtitle">We'd love to hear from you. Send us a message!</p>
        
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              <i className="fas fa-user"></i> Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Pradeep Yadav"
              required
            />
          </div>

          <div className="form-group">
            <label>
              <i className="fas fa-envelope"></i> Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="yadav@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label>
              <i className="fas fa-message"></i> Message
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your message here..."
              required
            />
          </div>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <div className="spinner"></div>
                Sending...
              </>
            ) : (
              <>
                <i className="fas fa-paper-plane"></i>
                Send Message
              </>
            )}
          </button>
        </form>
      </div>
    </>
  );
}

export default ContactForm;

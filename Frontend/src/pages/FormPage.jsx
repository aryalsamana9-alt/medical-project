import { useState } from "react";
import { formAPI } from "../api";

export default function FormPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ type: "", text: "" });

    if (!name.trim() || !email.trim() || !message.trim()) {
      setFeedback({ type: "error", text: "Please fill in all fields." });
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setFeedback({ type: "error", text: "Please enter a valid email address." });
      return;
    }

    setLoading(true);
    try {
      await formAPI.submitForm({
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
      });
      setFeedback({ type: "success", text: "Form submitted successfully! 🎉" });
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      const msg = err.response?.data?.detail || "Failed to submit form. Please try again.";
      setFeedback({ type: "error", text: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content-page">
      <div className="page-header">
        <h1>📝 Contact Form</h1>
        <p>Send us a message or inquiry. We will get back to you soon.</p>
      </div>

      {feedback.text && (
        <div className={`alert alert-${feedback.type}`}>{feedback.text}</div>
      )}

      <form onSubmit={handleSubmit} className="form-card">
        <div className="form-group">
          <label htmlFor="formName">Your Name</label>
          <input
            id="formName"
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="formEmail">Your Email</label>
          <input
            id="formEmail"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="formMessage">Message</label>
          <textarea
            id="formMessage"
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            required
          />
        </div>

        <button type="submit" className="btn-primary btn-full" disabled={loading}>
          {loading ? "Submitting..." : "Submit Form"}
        </button>
      </form>
    </div>
  );
}
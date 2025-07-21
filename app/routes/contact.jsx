import {Form, useLoaderData} from '@remix-run/react';

/**
 * @type {MetaFunction}
 */
export const meta = () => {
  return [{title: 'Contact Us'}];
};

/**
 * @param {LoaderFunctionArgs}
 */
export async function loader() {
  return {
    page: {
      title: 'Contact Us',
      content: "Let's discuss your next marble masterpiece",
    },
  };
}

export default function ContactPage() {
  const {page} = useLoaderData();

  return (
    <div className="contact-page">
      <div className="contact-hero">
        <h1>{page.title}</h1>
        <p>{page.content}</p>
      </div>

      <div className="contact-content">
        <div className="contact-info">
          <div className="contact-info-section">
            <h3>Visit Our Gallery</h3>
            <p>11 Old Dock Road</p>
            <p>Yaphank, NY 11980</p>
            <p>United States</p>
          </div>

          <div className="contact-info-section">
            <h3>Business Hours</h3>
            <p>Monday - Friday: 8:30 AM - 4:00 PM</p>
            <p>Saturday: 10:00 AM - 4:00 PM</p>
            <p>Sunday: Closed</p>
          </div>

          <div className="contact-info-section">
            <h3>Get in Touch</h3>
            <p>Phone: (631) 467-1011</p>
            <p>Email: info@carveandco.com</p>
          </div>
        </div>

        <div className="contact-form-container">
          <h2>Send Us a Message</h2>
          <Form method="post" className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                placeholder="John Doe"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                placeholder="john@example.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="(555) 123-4567"
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <select id="subject" name="subject" required>
                <option value="">Select a subject</option>
                <option value="consultation">Schedule Consultation</option>
                <option value="quote">Request Quote</option>
                <option value="support">Customer Support</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                required
                rows="5"
                placeholder="Tell us about your project..."
              />
            </div>

            <button type="submit" className="submit-button">
              Send Message
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
}

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */

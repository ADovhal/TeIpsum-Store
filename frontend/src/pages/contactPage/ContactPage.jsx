import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const result = await res.json();
    setStatus(result.success ? 'success' : 'error');
  };

  return (
    <div style={{ display: 'flex', height: '80vh', padding: '20px', gap: '20px' }}>
      <div style={{ flex: 1 }}>
        <iframe
          title="shop location"
          src="https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=Lodz,Poland"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
        />
      </div>
      <form onSubmit={handleSubmit} style={{ flex: 1, justifyContent: 'center', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h2>Stay in contact with us</h2>
        <p style={{ justifyContent: 'center', display: 'flex' }}>We appreciate your feedback and suggestions for improvement!</p>

        <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Your Email" value={formData.email} onChange={handleChange} required />
        <textarea name="message" placeholder="Your Message" value={formData.message} onChange={handleChange} rows={6} required />
        <div style={{ justifyContent: 'center', display: 'flex' }}><button type="submit" className='button' style={{width: '200px', height: '50px'}}>Send</button></div>
        {status === 'success' && <p style={{ color: 'green' }}>Thank you for your message!</p>}
        {status === 'error' && <p style={{ color: 'red' }}>Something went wrong. Please try again later.</p>}
      </form>
    </div>
  );
}

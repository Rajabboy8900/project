import { motion } from 'framer-motion';
import { useState } from 'react';
import '../styles/contact.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', message: '' });
    }, 3000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section className="contact" id="contact">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2>Get in Touch</h2>
          <div className="underline"></div>
        </motion.div>

        <motion.div
          className="contact-content"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.div className="contact-text" variants={itemVariants}>
            <p>Have a project in mind? Let's work together and create something amazing.</p>
            <div className="contact-links">
              <motion.a
                href="rajabbboyrajabov@gmail.com"
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                rajabbboyrajabov@gmail.com
              </motion.a>
              <motion.a
                href="tel:+998978546100"
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.95 }}
              >
               +998978546100
              </motion.a>
            </div>
          </motion.div>

          <motion.form className="contact-form" onSubmit={handleSubmit} variants={itemVariants}>
            <div className="form-group">
              <input
                type="text"
                name="name"
                placeholder="Rajabboy"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="rajabbboyrajabov@gmail.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <textarea
                name="message"
                placeholder="Your message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <motion.button
              type="submit"
              className="submit-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isSubmitted}
            >
              {isSubmitted ? 'Sent!' : 'Send Message'}
            </motion.button>

            {isSubmitted && (
              <motion.p
                className="success-message"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                Thanks for reaching out! I'll get back to you soon.
              </motion.p>
            )}
          </motion.form>
        </motion.div>
      </div>
    </section>
  );
}

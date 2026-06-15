import { motion } from 'framer-motion';
import { useState } from 'react';
import '../styles/contact.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [status, setStatus] = useState({ type: '', msg: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1, y: 0,
      transition: { duration: 0.6 },
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', msg: '' });

    const token = import.meta.env.TELEGRAM_BOT_TOKEN;
    const chatId = import.meta.env.TELEGRAM_CHAT_ID;

    const telegramMessage = `
📩 **Yangi Xabar!**
👤 **Ism:** ${formData.name}
📧 **Email:** ${formData.email}
📝 **Xabar:** ${formData.message}
    `;

    try {
      const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: telegramMessage,
          parse_mode: 'Markdown',
        }),
      });

      if (response.ok) {
        setStatus({ type: 'success', msg: "Xabar yuborildi! Tez orada javob beraman. ✅" });
        setFormData({ name: '', email: '', message: '' });
      } else {
        throw new Error();
      }
    } catch (error) {
      setStatus({ type: 'error', msg: "Xatolik yuz berdi. Iltimos, qayta urinib ko'ring. ❌" });
    } finally {
      setIsSubmitting(false);
      // 5 soniyadan keyin status xabarini o'chirish
      setTimeout(() => setStatus({ type: '', msg: '' }), 5000);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
              <motion.a href="mailto:rajabbboyrajabov@gmail.com" whileHover={{ x: 5 }}>
                rajabbboyrajabov@gmail.com
              </motion.a>
              <motion.a href="tel:+998978546100" whileHover={{ x: 5 }}>
                +998978546100
              </motion.a>
            </div>
          </motion.div>

          <motion.form className="contact-form" onSubmit={handleSubmit} variants={itemVariants}>
            <div className="form-group">
              <input
                type="text"
                name="name"
                placeholder="Ismingiz"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Emailingiz"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <textarea
                name="message"
                placeholder="Xabaringiz"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <motion.button
              type="submit"
              className="submit-btn"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Yuborilmoqda...' : 'Send Message'}
            </motion.button>

            {status.msg && (
              <motion.p
                className={`status-message ${status.type}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {status.msg}
              </motion.p>
            )}
          </motion.form>
        </motion.div>
      </div>
    </section>
  );
}
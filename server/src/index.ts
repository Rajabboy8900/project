import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import https from 'https';
import { authMiddleware, AuthRequest } from './middleware/auth';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Helper function to send Telegram messages using Node native https module
function sendTelegramMessage(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn('Telegram credentials not configured.');
    return;
  }

  const data = JSON.stringify({
    chat_id: chatId,
    text: text,
    parse_mode: 'Markdown',
  });

  const options = {
    hostname: 'api.telegram.org',
    port: 443,
    path: `/bot${token}/sendMessage`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data),
    },
  };

  const req = https.request(options, (res) => {
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
      console.log('Telegram response:', body);
    });
  });

  req.on('error', (error) => {
    console.error('Telegram error:', error);
  });

  req.write(data);
  req.end();
}

// PUBLIC ROUTES

// Get all skills
app.get('/api/skills', async (req, res) => {
  try {
    const skills = await prisma.skill.findMany();
    res.json(skills);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch skills' });
  }
});

// Get all projects
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await prisma.project.findMany();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Submit contact form
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }

  try {
    const savedMessage = await prisma.message.create({
      data: { name, email, message },
    });

    // Send to Telegram
    const telegramText = `📩 *Yangi Xabar!*\n\n👤 *Ism:* ${name}\n📧 *Email:* ${email}\n📝 *Xabar:* ${message}`;
    sendTelegramMessage(telegramText);

    res.json({ success: true, message: 'Message sent successfully!', data: savedMessage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save message' });
  }
});

// Admin Login
app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    const admin = await prisma.admin.findUnique({ where: { username } });
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );

    res.json({ success: true, token });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// PROTECTED ADMIN ROUTES (authMiddleware applied)

// Skills CRUD
app.post('/api/skills', authMiddleware, async (req: AuthRequest, res) => {
  const { name, category } = req.body;
  if (!name || !category) {
    return res.status(400).json({ error: 'Name and category are required' });
  }
  try {
    const skill = await prisma.skill.create({ data: { name, category } });
    res.json(skill);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create skill' });
  }
});

app.put('/api/skills/:id', authMiddleware, async (req: AuthRequest, res) => {
  const { id } = req.params;
  const { name, category } = req.body;
  try {
    const skill = await prisma.skill.update({
      where: { id: Number(id) },
      data: { name, category },
    });
    res.json(skill);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update skill' });
  }
});

app.delete('/api/skills/:id', authMiddleware, async (req: AuthRequest, res) => {
  const { id } = req.params;
  try {
    await prisma.skill.delete({ where: { id: Number(id) } });
    res.json({ success: true, message: 'Skill deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete skill' });
  }
});

// Projects CRUD
app.post('/api/projects', authMiddleware, async (req: AuthRequest, res) => {
  const { title, description, tags, link } = req.body;
  if (!title || !description || !tags) {
    return res.status(400).json({ error: 'Title, description, and tags are required' });
  }
  try {
    const project = await prisma.project.create({
      data: { title, description, tags, link: link || '#' },
    });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create project' });
  }
});

app.put('/api/projects/:id', authMiddleware, async (req: AuthRequest, res) => {
  const { id } = req.params;
  const { title, description, tags, link } = req.body;
  try {
    const project = await prisma.project.update({
      where: { id: Number(id) },
      data: { title, description, tags, link },
    });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update project' });
  }
});

app.delete('/api/projects/:id', authMiddleware, async (req: AuthRequest, res) => {
  const { id } = req.params;
  try {
    await prisma.project.delete({ where: { id: Number(id) } });
    res.json({ success: true, message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// Get all messages (Admin only)
app.get('/api/messages', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const messages = await prisma.message.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Delete a message
app.delete('/api/messages/:id', authMiddleware, async (req: AuthRequest, res) => {
  const { id } = req.params;
  try {
    await prisma.message.delete({ where: { id: Number(id) } });
    res.json({ success: true, message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

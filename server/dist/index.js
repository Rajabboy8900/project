"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcryptjs"));
const jwt = __importStar(require("jsonwebtoken"));
const https_1 = __importDefault(require("https"));
const auth_1 = require("./middleware/auth");
dotenv_1.default.config();
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Helper function to parse user agent for device, OS, and browser
function parseUserAgent(uaString) {
    let device = 'Desktop';
    let os = 'Unknown OS';
    let browser = 'Unknown Browser';
    const ua = uaString.toLowerCase();
    // 1. Detect Device
    if (/mobile|android|iphone|ipad|phone/i.test(ua)) {
        device = 'Mobile';
    }
    else if (/tablet|playbook|silk/i.test(ua)) {
        device = 'Tablet';
    }
    // 2. Detect OS
    if (ua.includes('windows'))
        os = 'Windows';
    else if (ua.includes('macintosh') || ua.includes('mac os'))
        os = 'macOS';
    else if (ua.includes('iphone') || ua.includes('ipad'))
        os = 'iOS';
    else if (ua.includes('android'))
        os = 'Android';
    else if (ua.includes('linux'))
        os = 'Linux';
    // 3. Detect Browser
    if (ua.includes('firefox'))
        browser = 'Firefox';
    else if (ua.includes('chrome') && !ua.includes('chromium'))
        browser = 'Chrome';
    else if (ua.includes('safari') && !ua.includes('chrome'))
        browser = 'Safari';
    else if (ua.includes('edge'))
        browser = 'Edge';
    else if (ua.includes('opera') || ua.includes('opr'))
        browser = 'Opera';
    return { device, os, browser };
}
// Helper function to send Telegram messages
function sendTelegramMessage(text) {
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
    const req = https_1.default.request(options, (res) => {
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
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch skills' });
    }
});
// Get all projects
app.get('/api/projects', async (req, res) => {
    try {
        const projects = await prisma.project.findMany();
        res.json(projects);
    }
    catch (error) {
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
        const telegramText = `📩 *Yangi Xabar!*\n\n👤 *Ism:* ${name}\n📧 *Email:* ${email}\n📝 *Xabar:* ${message}`;
        sendTelegramMessage(telegramText);
        res.json({ success: true, message: 'Message sent successfully!', data: savedMessage });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to save message' });
    }
});
// Analytics: Track view & save visitor details
app.post('/api/analytics/view', async (req, res) => {
    try {
        // 1. Increment global view count
        await prisma.analytics.update({
            where: { id: 1 },
            data: { pageViews: { increment: 1 } },
        });
        // 2. Parse and save visitor details
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
        const userAgent = req.headers['user-agent'] || 'unknown';
        const { device, os, browser } = parseUserAgent(userAgent);
        const log = await prisma.visitorLog.create({
            data: {
                ip: ip.split(',')[0].trim(),
                userAgent,
                device,
                browser,
                os,
            },
        });
        res.json({ success: true, log });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to track view' });
    }
});
// Analytics: Track click
app.post('/api/analytics/click', async (req, res) => {
    const { type } = req.body;
    if (!type || !['telegram', 'github', 'linkedin'].includes(type)) {
        return res.status(400).json({ error: 'Invalid click type' });
    }
    try {
        const updateData = {};
        if (type === 'telegram')
            updateData.telegramClicks = { increment: 1 };
        if (type === 'github')
            updateData.githubClicks = { increment: 1 };
        if (type === 'linkedin')
            updateData.linkedinClicks = { increment: 1 };
        const stats = await prisma.analytics.update({
            where: { id: 1 },
            data: updateData,
        });
        res.json(stats);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to track click' });
    }
});
// Get all blogs
app.get('/api/blogs', async (req, res) => {
    try {
        const blogs = await prisma.blogPost.findMany({
            orderBy: { createdAt: 'desc' },
        });
        res.json(blogs);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch blogs' });
    }
});
// Get single blog
app.get('/api/blogs/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const blog = await prisma.blogPost.findUnique({
            where: { id: Number(id) },
        });
        if (!blog)
            return res.status(404).json({ error: 'Blog post not found' });
        res.json(blog);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch blog post' });
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
        const token = jwt.sign({ id: admin.id, username: admin.username }, process.env.JWT_SECRET || 'secret', { expiresIn: '24h' });
        res.json({ success: true, token });
    }
    catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});
// PROTECTED ADMIN ROUTES
// Get global analytics summary
app.get('/api/analytics', auth_1.authMiddleware, async (req, res) => {
    try {
        const stats = await prisma.analytics.findUnique({ where: { id: 1 } });
        res.json(stats);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch analytics' });
    }
});
// Get recent visitor logs (Admin only)
app.get('/api/analytics/logs', auth_1.authMiddleware, async (req, res) => {
    try {
        const logs = await prisma.visitorLog.findMany({
            orderBy: { createdAt: 'desc' },
            take: 50,
        });
        res.json(logs);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch visitor logs' });
    }
});
// Skills CRUD
app.post('/api/skills', auth_1.authMiddleware, async (req, res) => {
    const { name, category } = req.body;
    if (!name || !category) {
        return res.status(400).json({ error: 'Name and category are required' });
    }
    try {
        const skill = await prisma.skill.create({ data: { name, category } });
        res.json(skill);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create skill' });
    }
});
app.put('/api/skills/:id', auth_1.authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { name, category } = req.body;
    try {
        const skill = await prisma.skill.update({
            where: { id: Number(id) },
            data: { name, category },
        });
        res.json(skill);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update skill' });
    }
});
app.delete('/api/skills/:id', auth_1.authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.skill.delete({ where: { id: Number(id) } });
        res.json({ success: true, message: 'Skill deleted' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete skill' });
    }
});
// Projects CRUD
app.post('/api/projects', auth_1.authMiddleware, async (req, res) => {
    const { title, description, tags, link, longDescription, githubLink, imageUrl } = req.body;
    if (!title || !description || !tags) {
        return res.status(400).json({ error: 'Title, description, and tags are required' });
    }
    try {
        const project = await prisma.project.create({
            data: {
                title,
                description,
                tags,
                link: link || '#',
                longDescription,
                githubLink,
                imageUrl
            },
        });
        res.json(project);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create project' });
    }
});
app.put('/api/projects/:id', auth_1.authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { title, description, tags, link, longDescription, githubLink, imageUrl } = req.body;
    try {
        const project = await prisma.project.update({
            where: { id: Number(id) },
            data: { title, description, tags, link, longDescription, githubLink, imageUrl },
        });
        res.json(project);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update project' });
    }
});
app.delete('/api/projects/:id', auth_1.authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.project.delete({ where: { id: Number(id) } });
        res.json({ success: true, message: 'Project deleted' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete project' });
    }
});
// Blogs CRUD
app.post('/api/blogs', auth_1.authMiddleware, async (req, res) => {
    const { title, summary, content, category, readTime } = req.body;
    if (!title || !summary || !content || !category) {
        return res.status(400).json({ error: 'Title, summary, content, and category are required' });
    }
    try {
        const blog = await prisma.blogPost.create({
            data: {
                title,
                summary,
                content,
                category,
                readTime: Number(readTime) || 3
            },
        });
        res.json(blog);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create blog post' });
    }
});
app.put('/api/blogs/:id', auth_1.authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { title, summary, content, category, readTime } = req.body;
    try {
        const blog = await prisma.blogPost.update({
            where: { id: Number(id) },
            data: {
                title,
                summary,
                content,
                category,
                readTime: Number(readTime)
            },
        });
        res.json(blog);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update blog post' });
    }
});
app.delete('/api/blogs/:id', auth_1.authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.blogPost.delete({ where: { id: Number(id) } });
        res.json({ success: true, message: 'Blog post deleted' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete blog post' });
    }
});
// Messages List
app.get('/api/messages', auth_1.authMiddleware, async (req, res) => {
    try {
        const messages = await prisma.message.findMany({
            orderBy: { createdAt: 'desc' },
        });
        res.json(messages);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});
app.delete('/api/messages/:id', auth_1.authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.message.delete({ where: { id: Number(id) } });
        res.json({ success: true, message: 'Message deleted' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete message' });
    }
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

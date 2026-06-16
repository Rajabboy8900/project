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
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    // Clear existing data
    await prisma.admin.deleteMany({});
    await prisma.skill.deleteMany({});
    await prisma.project.deleteMany({});
    await prisma.blogPost.deleteMany({});
    await prisma.analytics.deleteMany({});
    console.log('Seeding database with advanced schemas...');
    // Create Admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.admin.create({
        data: {
            username: 'admin',
            password: hashedPassword,
        },
    });
    console.log(`Created admin: ${admin.username}`);
    // Create Analytics initial row
    await prisma.analytics.create({
        data: {
            id: 1,
            pageViews: 0,
            telegramClicks: 0,
            githubClicks: 0,
            linkedinClicks: 0,
        },
    });
    console.log('Initialized analytics counters.');
    // Create a Sample Blog Post
    const blog = await prisma.blogPost.create({
        data: {
            title: 'NestJS arxitekturasi va uning afzalliklari',
            summary: 'Ushbu maqolada NestJS freymvorkining asosiy modullari, arxitekturaviy yondashuvlari va nima uchun Node.js dasturchilari uni tanlashi kerakligi haqida gaplashamiz.',
            content: `### NestJS nima?

NestJS — bu samarali, ishonchli va kengaytiriladigan Node.js server-side ilovalarni yaratish uchun freymvork. U zamonaviy JavaScript va to'liq **TypeScript** tilini qo'llab-quvvatlaydi.

#### Asosiy afzalliklari:
1. **Modullilik (Modular Architecture):** NestJS loyihani alohida modullarga bo'lib yozishni talab qiladi. Bu kodni toza va oson test qilinadigan qiladi.
2. **Dependency Injection (DI):** Angular dizayni asosida yaratilgan DI tizimi dependencylarni osongina boshqarish imkonini beradi.
3. **TypeScript qo'llab-quvvatlanishi:** To'liq TypeScript asosida yozilganligi sababli xatoliklarni compile vaqtidayoq aniqlash oson.

\`\`\`typescript
@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
\`\`\`

NestJS yirik jamoalar va murakkab CRM, E-commerce yoki SaaS tizimlar uchun eng zo'r tanlov hisoblanadi.`,
            category: 'Backend',
            readTime: 4,
        },
    });
    console.log(`Created sample blog post: "${blog.title}"`);
    // Create Skills
    const skillsData = [
        // Backend
        { name: 'JavaScript', category: 'Backend' },
        { name: 'TypeScript', category: 'Backend' },
        { name: 'Node.js', category: 'Backend' },
        { name: 'Express.js', category: 'Backend' },
        { name: 'NestJS', category: 'Backend' },
        { name: 'Java (intermediate)', category: 'Backend' },
        { name: 'Spring Boot', category: 'Backend' },
        { name: 'Spring WebFlux (basic)', category: 'Backend' },
        { name: 'SQL', category: 'Backend' },
        { name: 'HTML (basic)', category: 'Backend' },
        { name: 'CSS (basic)', category: 'Backend' },
        // Databases
        { name: 'PostgreSQL', category: 'Databases' },
        { name: 'MongoDB', category: 'Databases' },
        { name: 'Mongoose', category: 'Databases' },
        { name: 'TypeORM', category: 'Databases' },
        { name: 'MySQL', category: 'Databases' },
        // DevOps
        { name: 'Docker', category: 'DevOps' },
        { name: 'AWS', category: 'DevOps' },
        { name: 'CI/CD', category: 'DevOps' },
        { name: 'Linux', category: 'DevOps' },
        // Tools
        { name: 'Git', category: 'Tools' },
        { name: 'REST APIs', category: 'Tools' },
        { name: 'GraphQL', category: 'Tools' },
        { name: 'Postman', category: 'Tools' },
        { name: 'VS Code', category: 'Tools' },
    ];
    for (const skill of skillsData) {
        await prisma.skill.create({ data: skill });
    }
    console.log(`Created ${skillsData.length} skills.`);
    // Create Projects
    const projectsData = [
        {
            title: 'FastFood Delivery Backend',
            description: 'Complete backend architecture for a delivery service, including authentication, JWT/refresh tokens, role-based access, products, categories, orders, branches, and couriers. Built with TypeScript, Node.js, and Prisma.',
            longDescription: 'Bu loyiha tezkor yetkazib berish (FastFood Delivery) xizmatlari uchun yaratilgan to\'liq API tizimidir. Tizimda xaridorlar, kurerlar, filiallar va administratorlar uchun alohida roliklar mavjud. Buyurtma yaratilganda real-vaqtda kurerlarga bildirishnoma boradi. Shuningdek, JWT tokenlar bilan xavfsizlik va refresh token mexanizmi o\'rnatilgan. Baza bilan tezkor ishlash uchun Prisma ORM va PostgreSQL ishlatilgan.',
            tags: 'TypeScript,Node.js,Prisma,PostgreSQL',
            link: '#',
            githubLink: 'https://github.com/Rajabboy8900',
            imageUrl: '/icon.png',
        },
        {
            title: 'CRM Management System',
            description: 'Advanced CRM backend with modules for students, groups, payments, attendance, filtering, pagination, notifications, and full admin authentication. Built using NestJS and PostgreSQL.',
            longDescription: 'O\'quv markazlari faoliyatini avtomatlashtirish uchun mo\'ljallangan yirik CRM tizimi backendi. O\'quvchilar guruhlari, davomat nazorati, oylik to\'lovlar tizimi va sms-xabarnomalar moduli mavjud. NestJS freymvorkining eng so\'nggi arxitekturaviy yondashuvlari (CQRS, microservices) asosida yozilgan. Tizimda to\'liq audit va loglar yuritiladi.',
            tags: 'NestJS,PostgreSQL,Prisma,JWT',
            link: '#',
            githubLink: 'https://github.com/Rajabboy8900',
            imageUrl: '/icon.png',
        },
        {
            title: 'Telegram Quiz Bot Backend',
            description: 'Telegram bot backend supporting quiz logic, scoring system, difficulty levels, user statistics, and real-time question delivery. Built with Telegraf and PostgreSQL.',
            longDescription: 'Foydalanuvchilar o\'rtasida bilimlar darajasini sinash uchun Telegram viktorina bot. Telegraf.js kutubxonasi yordamida yozilgan. Tezkor hisob-kitoblar va keshlar uchun Redis ishlatilgan. Har bir foydalanuvchining shaxsiy reytingi va yutuqlari ma\'lumotlar bazasida saqlanadi. Savollar dinamik ravishda toifalarga qarab taqsimlanadi.',
            tags: 'Node.js,Telegraf,PostgreSQL,Redis',
            link: '#',
            githubLink: 'https://github.com/Rajabboy8900',
            imageUrl: '/icon.png',
        },
        {
            title: 'E-Learning Platform Backend',
            description: 'Backend system featuring courses, lessons, teacher dashboard, authentication, payments, and user progress tracking. Designed for scalable education systems.',
            longDescription: 'Onlayn ta\'lim platformalari uchun mo\'ljallangan yengil va tezkor backend. Kurslar, darslar (video/matn), o\'qituvchilar reytingi va to\'lov tizimlari (Click/Payme) integratsiyasi mavjud. MongoDB ma\'lumotlar bazasida ulanishlar NoSQL yondashuvi bilan amalga oshirilgan.',
            tags: 'Node.js,Express,MongoDB,JWT',
            link: '#',
            githubLink: 'https://github.com/Rajabboy8900',
            imageUrl: '/icon.png',
        },
        {
            title: 'Hotel Booking Backend',
            description: 'Reservation backend with room availability, booking management, user authentication, payment integration, and admin dashboard features.',
            longDescription: 'Mehmonxona xonalarini band qilish va bron tizimi. Xonalarning bo\'sh-bandligini real-vaqtda tekshirish, bron sanalarini hisoblash, to\'lov kvitansiyalarini avtomatik yuborish funksiyalari mavjud. NestJS va TypeORM orqali PostgreSQL bilan ishlangan.',
            tags: 'TypeScript,NestJS,PostgreSQL',
            link: '#',
            githubLink: 'https://github.com/Rajabboy8900',
            imageUrl: '/icon.png',
        },
        {
            title: 'Real-Time Chat API',
            description: 'WebSocket-powered chat backend with typing indicators, message history, private rooms, and Redis-based session management.',
            longDescription: 'Real-vaqt rejimida ishlaydigan chat serveri. Xabarlar yo\'qolib ketmasligi uchun chat tarixi bazada saqlanadi. Foydalanuvchi yozayotganini ko\'rsatuvchi "typing..." indikatori, xona yaratish va xabarlarni shifrlash (crypto) mantiqi o\'rnatilgan. WebSocket (Socket.io) orqali ishlaydi.',
            tags: 'Node.js,WebSocket,Redis,JWT',
            link: '#',
            githubLink: 'https://github.com/Rajabboy8900',
            imageUrl: '/icon.png',
        },
        {
            title: 'URL Shortener Service',
            description: 'High-performance URL shortener API supporting analytics, click tracking, and custom aliases.',
            longDescription: 'Katta hajmdagi uzun havolalarni qisqartirib beruvchi va ularning har bir bosilishini (click tracking) hisoblab boruvchi yuqori samarali xizmat. Tashrif buyuruvchilarning geolokatsiyasi va qurilmalarini aniqlash tahlili mavjud.',
            tags: 'Node.js,Express,MongoDB',
            link: '#',
            githubLink: 'https://github.com/Rajabboy8900',
            imageUrl: '/icon.png',
        },
    ];
    for (const project of projectsData) {
        await prisma.project.create({ data: project });
    }
    console.log(`Created ${projectsData.length} projects.`);
    console.log('Seeding complete! Admin user: admin / admin123');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});

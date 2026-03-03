import dotenv from 'dotenv';
import express from "express";
import pool from './src/db/pool.js';
import projectRoutes from './src/routes/project.routes.js';
import tenantRoutes from './src/routes/tenant.routes.js';
import itemRoutes from './src/routes/item.routes.js';
import userRoutes from './src/routes/user.routes.js';
import authRoutes from './src/routes/auth.routes.js';
import {tenantContextMiddleware} from './src/middleware/tenantContext.js';
import {authMiddleware} from './src/middleware/auth.middleware.js';
import {errorHandler} from './src/middleware/error.middleware.js';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:4200',
    methods: ['GET','POST','PUT','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization'],
    credentials: true
}));
// app.use(tenantContextMiddleware);

app.use('/projects', authMiddleware, projectRoutes);
app.use('/tenants', tenantRoutes);
app.use('/items', authMiddleware, itemRoutes);
app.use('/users', authMiddleware, userRoutes);
app.use('/auth', authRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

server.on("error", (err) => {
    console.error("Server failed to start:", err);
    process.exit(1);
});
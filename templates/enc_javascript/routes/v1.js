import { Router } from 'express';
import authRoutes from "./v1/auth.route.js";
import adminRoutes from "./v1/admin.route.js";

const router = Router();

router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);

export default router; // ✅ ESM export
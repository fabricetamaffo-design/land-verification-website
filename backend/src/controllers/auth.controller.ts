import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { signToken } from '../utils/jwt';

const prisma = new PrismaClient();

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function register(req: Request, res: Response): Promise<void> {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.errors[0].message });
    return;
  }

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    res.status(409).json({ message: 'An account with this email already exists.' });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { name, email, passwordHash },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  res.status(201).json({ message: 'Account created successfully. Please log in.', user });
}

export async function login(req: Request, res: Response): Promise<void> {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid email or password format.' });
    return;
  }

  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.isActive) {
    res.status(401).json({ message: 'Invalid credentials.' });
    return;
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ message: 'Invalid credentials.' });
    return;
  }

  const token = signToken({ userId: user.id, role: user.role });

  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
}

export async function forgotPassword(req: Request, res: Response): Promise<void> {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ message: 'Email is required.' });
    return;
  }

  const user = await prisma.user.findUnique({ where: { email } });

  // Always return success to avoid email enumeration
  if (!user || !user.isActive) {
    res.json({ message: 'If this email is registered, a reset link has been generated.' });
    return;
  }

  // Sign a short-lived reset token using last 8 chars of current passwordHash as a one-time guard
  const resetToken = jwt.sign(
    { userId: user.id, type: 'password_reset', ph: user.passwordHash.slice(-8) },
    process.env.JWT_SECRET!,
    { expiresIn: '1h' }
  );

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

  // In production: send email with resetUrl. For demo: return it directly.
  res.json({
    message: 'Password reset link generated successfully.',
    resetUrl,
  });
}

export async function resetPassword(req: Request, res: Response): Promise<void> {
  const { token, password } = req.body;

  if (!token || !password) {
    res.status(400).json({ message: 'Token and new password are required.' });
    return;
  }
  if (password.length < 8) {
    res.status(400).json({ message: 'Password must be at least 8 characters.' });
    return;
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      type: string;
      ph: string;
    };

    if (payload.type !== 'password_reset') {
      res.status(400).json({ message: 'Invalid reset token.' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user || !user.isActive) {
      res.status(400).json({ message: 'User not found.' });
      return;
    }

    // Verify the token hasn't already been used (password hasn't changed)
    if (user.passwordHash.slice(-8) !== payload.ph) {
      res.status(400).json({ message: 'This reset link has already been used. Please request a new one.' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });

    res.json({ message: 'Password reset successfully. Please log in with your new password.' });
  } catch {
    res.status(400).json({ message: 'Invalid or expired reset link. Please request a new one.' });
  }
}

export async function changePassword(req: Request, res: Response): Promise<void> {
  const userId = (req as any).user?.userId;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    res.status(400).json({ message: 'Current and new password are required.' });
    return;
  }
  if (newPassword.length < 8) {
    res.status(400).json({ message: 'New password must be at least 8 characters.' });
    return;
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    res.status(404).json({ message: 'User not found.' });
    return;
  }

  const valid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!valid) {
    res.status(400).json({ message: 'Current password is incorrect.' });
    return;
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });

  res.json({ message: 'Password changed successfully.' });
}

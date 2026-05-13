import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../db/pool';

const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-secret';
const SALT_ROUNDS = 10;

function signToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

// POST /api/auth/register
export const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password, name } = req.body as { email: string; password: string; name: string };

  if (!email || !password || !name) {
    res.status(400).json({ message: 'email, password and name are required' });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({ message: 'Password must be at least 6 characters' });
    return;
  }

  try {
    const exists = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if ((exists.rowCount ?? 0) > 0) {
      res.status(409).json({ message: 'Email already in use' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id, email, name',
      [email, passwordHash, name],
    );

    const user = result.rows[0] as { id: string; email: string; name: string };
    const token = signToken(user.id);

    res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (err) {
    console.error('register error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// POST /api/auth/login
export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body as { email: string; password: string };

  if (!email || !password) {
    res.status(400).json({ message: 'email and password are required' });
    return;
  }

  try {
    const result = await pool.query(
      'SELECT id, email, name, password_hash FROM users WHERE email = $1',
      [email],
    );

    if ((result.rowCount ?? 0) === 0) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    const user = result.rows[0] as { id: string; email: string; name: string; password_hash: string };
    const valid = await bcrypt.compare(password, user.password_hash);

    if (!valid) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    const token = signToken(user.id);
    res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (err) {
    console.error('login error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// GET /api/auth/me
export const me = async (req: Request & { userId?: string }, res: Response): Promise<void> => {
  try {
    const result = await pool.query(
      'SELECT id, email, name FROM users WHERE id = $1',
      [req.userId],
    );
    if ((result.rowCount ?? 0) === 0) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('me error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

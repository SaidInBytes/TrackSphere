import { Request, Response } from 'express';
import { pool } from '../db/pool';
import type { Report, CreateReportDto, UpdateReportDto } from '../types/report';

// Maps snake_case DB row → camelCase Report
function rowToReport(row: Record<string, unknown>): Report {
  return {
    id:          row.id as string,
    title:       row.title as string,
    description: row.description as string,
    category:    row.category as string,
    status:      row.status as Report['status'],
    priority:    row.priority as Report['priority'],
    location:    row.location as string,
    createdBy:   row.created_by as string,
    createdAt:   (row.created_at as Date).toISOString(),
    updatedAt:   (row.updated_at as Date).toISOString(),
  };
}

// GET /api/reports
export const getReports = async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query('SELECT * FROM reports ORDER BY created_at DESC');
    res.json(result.rows.map(rowToReport));
  } catch (err) {
    console.error('getReports error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// GET /api/reports/:id
export const getReportById = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query('SELECT * FROM reports WHERE id = $1', [req.params.id]);
    if (result.rowCount === 0) {
      res.status(404).json({ message: 'Report not found' });
      return;
    }
    res.json(rowToReport(result.rows[0]));
  } catch (err) {
    console.error('getReportById error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// POST /api/reports
export const createReport = async (req: Request, res: Response): Promise<void> => {
  const body = req.body as CreateReportDto;

  if (!body.title || !body.category || !body.status || !body.priority) {
    res.status(400).json({ message: 'title, category, status and priority are required' });
    return;
  }

  try {
    const result = await pool.query(
      `INSERT INTO reports (title, description, category, status, priority, location, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        body.title,
        body.description ?? '',
        body.category,
        body.status,
        body.priority,
        body.location ?? '',
        body.createdBy ?? '',
      ],
    );
    res.status(201).json(rowToReport(result.rows[0]));
  } catch (err) {
    console.error('createReport error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// PUT /api/reports/:id
export const updateReport = async (req: Request, res: Response): Promise<void> => {
  const updates = req.body as UpdateReportDto;

  try {
    const result = await pool.query(
      `UPDATE reports
       SET title       = COALESCE($1, title),
           description = COALESCE($2, description),
           category    = COALESCE($3, category),
           status      = COALESCE($4, status),
           priority    = COALESCE($5, priority),
           location    = COALESCE($6, location),
           created_by  = COALESCE($7, created_by),
           updated_at  = NOW()
       WHERE id = $8
       RETURNING *`,
      [
        updates.title,
        updates.description,
        updates.category,
        updates.status,
        updates.priority,
        updates.location,
        updates.createdBy,
        req.params.id,
      ],
    );

    if (result.rowCount === 0) {
      res.status(404).json({ message: 'Report not found' });
      return;
    }
    res.json(rowToReport(result.rows[0]));
  } catch (err) {
    console.error('updateReport error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// DELETE /api/reports/:id
export const deleteReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query('DELETE FROM reports WHERE id = $1', [req.params.id]);
    if (result.rowCount === 0) {
      res.status(404).json({ message: 'Report not found' });
      return;
    }
    res.status(204).send();
  } catch (err) {
    console.error('deleteReport error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};


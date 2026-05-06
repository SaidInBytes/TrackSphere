import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import type { Report, CreateReportDto, UpdateReportDto } from '../types/report';

// In-memory store — replace with DB queries when PostgreSQL is added
let reports: Report[] = [
  {
    id: uuidv4(),
    title: 'Broken streetlight on Main St',
    description: 'The streetlight has been out for two weeks.',
    category: 'Infrastructure',
    status: 'open',
    priority: 'high',
    location: 'Main St, Block 4',
    createdBy: 'Anna Svensson',
    createdAt: new Date('2024-05-01T09:00:00').toISOString(),
    updatedAt: new Date('2024-05-01T09:00:00').toISOString(),
  },
  {
    id: uuidv4(),
    title: 'Graffiti on community center wall',
    description: 'Large graffiti appeared overnight on the north wall.',
    category: 'Vandalism',
    status: 'in-progress',
    priority: 'medium',
    location: 'Community Center, North Wall',
    createdBy: 'Erik Lindgren',
    createdAt: new Date('2024-05-03T11:30:00').toISOString(),
    updatedAt: new Date('2024-05-04T08:00:00').toISOString(),
  },
  {
    id: uuidv4(),
    title: 'Pothole on Park Ave',
    description: 'Large pothole causing vehicle damage.',
    category: 'Infrastructure',
    status: 'closed',
    priority: 'critical',
    location: 'Park Ave, near nr 12',
    createdBy: 'Maria Johansson',
    createdAt: new Date('2024-04-20T14:00:00').toISOString(),
    updatedAt: new Date('2024-05-02T16:00:00').toISOString(),
  },
];

// GET /api/reports
export const getReports = (_req: Request, res: Response): void => {
  res.json(reports);
};

// GET /api/reports/:id
export const getReportById = (req: Request, res: Response): void => {
  const report = reports.find((r) => r.id === req.params.id);
  if (!report) {
    res.status(404).json({ message: 'Report not found' });
    return;
  }
  res.json(report);
};

// POST /api/reports
export const createReport = (req: Request, res: Response): void => {
  const body = req.body as CreateReportDto;

  // Basic validation
  if (!body.title || !body.category || !body.status || !body.priority) {
    res.status(400).json({ message: 'title, category, status and priority are required' });
    return;
  }

  const now = new Date().toISOString();
  const newReport: Report = {
    id: uuidv4(),
    ...body,
    createdAt: now,
    updatedAt: now,
  };

  reports.push(newReport);
  res.status(201).json(newReport);
};

// PUT /api/reports/:id
export const updateReport = (req: Request, res: Response): void => {
  const index = reports.findIndex((r) => r.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ message: 'Report not found' });
    return;
  }

  const updates = req.body as UpdateReportDto;
  reports[index] = {
    ...reports[index],
    ...updates,
    id: reports[index].id,          // id is immutable
    createdAt: reports[index].createdAt, // createdAt is immutable
    updatedAt: new Date().toISOString(),
  };

  res.json(reports[index]);
};

// DELETE /api/reports/:id
export const deleteReport = (req: Request, res: Response): void => {
  const index = reports.findIndex((r) => r.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ message: 'Report not found' });
    return;
  }

  reports.splice(index, 1);
  res.status(204).send();
};

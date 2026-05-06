export type ReportStatus = 'open' | 'in-progress' | 'closed';
export type ReportPriority = 'low' | 'medium' | 'high' | 'critical';

export interface Report {
  id: string;
  title: string;
  description: string;
  category: string;
  status: ReportStatus;
  priority: ReportPriority;
  location: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// Payload for creating a new report (id and dates are server-generated)
export type CreateReportDto = Omit<Report, 'id' | 'createdAt' | 'updatedAt'>;

// Payload for updating — all fields optional except what the client sends
export type UpdateReportDto = Partial<CreateReportDto>;

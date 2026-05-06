// Core Report type used throughout the application
export type ReportStatus = 'open' | 'closed' | 'in-progress';
export type ReportPriority = 'low' | 'medium' | 'high' | 'critical';

export interface Report {
  id: string;
  title: string;
  description: string;
  status: ReportStatus;
  priority: ReportPriority;
  createdAt: string; // ISO date string
  updatedAt: string;
  createdBy: string;
  category: string;
}

// Form payload when creating a new report (no id/timestamps — server assigns those)
export interface CreateReportPayload {
  title: string;
  description: string;
  status: ReportStatus;
  priority: ReportPriority;
  category: string;
  createdBy: string;
}

// Stats derived from a list of reports
export interface ReportStats {
  total: number;
  open: number;
  closed: number;
  inProgress: number;
}

// Date range filter state
export interface DateRange {
  from: string; // ISO date string (YYYY-MM-DD)
  to: string;
}

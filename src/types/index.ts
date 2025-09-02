// Central export file for all TypeScript types
// This will be populated as we create type definitions

export * from './auth';
export * from './campaign';
export * from './user';
export * from './payment';
export * from './api';

// Common utility types
export type Status = 'pending' | 'loading' | 'success' | 'error';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

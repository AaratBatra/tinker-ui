/**
 * Field Validation Utilities
 */

import { FieldConfig, LeadData } from './types';

export interface ValidationError {
  field: string;
  message: string;
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\d\s\-\+\(\)]{7,}$/;
  return phoneRegex.test(phone);
};

export const validateField = (
  field: FieldConfig,
  value: string | number | string[] | null | undefined
): ValidationError | null => {
  // Check required
  if (field.required) {
    if (value === null || value === undefined || value === '') {
      return {
        field: field.columnName,
        message: `${field.displayName} is required`,
      };
    }

    if (Array.isArray(value) && value.length === 0) {
      return {
        field: field.columnName,
        message: `${field.displayName} is required`,
      };
    }
  }

  if (!value) return null;

  // Type-specific validation
  switch (field.dataType) {
    case 'EMAIL':
      if (typeof value === 'string' && !validateEmail(value)) {
        return {
          field: field.columnName,
          message: 'Invalid email format',
        };
      }
      break;

    case 'PHONE':
      if (typeof value === 'string' && !validatePhone(value)) {
        return {
          field: field.columnName,
          message: 'Invalid phone format',
        };
      }
      break;

    case 'NUMBER':
      const num = typeof value === 'string' ? parseFloat(value) : value;
      if (isNaN(num)) {
        return {
          field: field.columnName,
          message: `${field.displayName} must be a valid number`,
        };
      }
      if (field.minValue && num < parseFloat(field.minValue)) {
        return {
          field: field.columnName,
          message: `${field.displayName} must be at least ${field.minValue}`,
        };
      }
      if (field.maxValue && num > parseFloat(field.maxValue)) {
        return {
          field: field.columnName,
          message: `${field.displayName} must not exceed ${field.maxValue}`,
        };
      }
      break;

    case 'DATE':
      if (typeof value === 'string') {
        const date = new Date(value);
        if (isNaN(date.getTime())) {
          return {
            field: field.columnName,
            message: 'Invalid date format',
          };
        }
      }
      break;
  }

  return null;
};

export const validateForm = (
  fields: FieldConfig[],
  data: LeadData
): ValidationError[] => {
  const errors: ValidationError[] = [];

  fields.forEach((field) => {
    const error = validateField(field, data[field.columnName]);
    if (error) {
      errors.push(error);
    }
  });

  return errors;
};

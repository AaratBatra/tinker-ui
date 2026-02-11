'use client';

import React from "react"

import { useState } from 'react';
import { FieldConfig, LeadData, LOV_DATA } from '@/lib/types';
import { validateField } from '@/lib/validation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface LeadFormProps {
  fields: FieldConfig[];
  initialData?: LeadData;
  onSubmit: (data: LeadData) => void | Promise<void>;
  isLoading?: boolean;
}

export function LeadForm({
  fields,
  initialData = {},
  onSubmit,
  isLoading = false,
}: LeadFormProps) {
  const [formData, setFormData] = useState<LeadData>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());

  const visibleFields = fields.filter((f) => f.visible);

  const handleChange = (columnName: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [columnName]: value,
    }));

    // Clear error when user starts typing
    if (errors[columnName]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[columnName];
        return next;
      });
    }
  };

  const handleBlur = (field: FieldConfig) => {
    setTouched((prev) => new Set(prev).add(field.columnName));

    const error = validateField(field, formData[field.columnName]);
    if (error) {
      setErrors((prev) => ({
        ...prev,
        [error.field]: error.message,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const newErrors: Record<string, string> = {};
    visibleFields.forEach((field) => {
      const error = validateField(field, formData[field.columnName]);
      if (error) {
        newErrors[error.field] = error.message;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    await onSubmit(formData);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Lead Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {visibleFields.map((field) => {
              const value = formData[field.columnName];
              const error = errors[field.columnName];
              const isTouched = touched.has(field.columnName);
              const isError = isTouched && !!error;

              return (
                <div
                  key={field.columnName}
                  className={field.dataType === 'TEXTAREA' ? 'md:col-span-2' : ''}
                >
                  <Label htmlFor={field.columnName} className="mb-2 block">
                    {field.displayName}
                    {field.required && <span className="ml-1 text-red-600">*</span>}
                  </Label>

                  {field.helpText && (
                    <p className="mb-2 text-xs text-gray-500">{field.helpText}</p>
                  )}

                  {/* Text Input */}
                  {field.dataType === 'TEXT' && (
                    <Input
                      id={field.columnName}
                      type="text"
                      placeholder={field.placeholderText || `Enter ${field.displayName.toLowerCase()}`}
                      value={value || ''}
                      onChange={(e) =>
                        handleChange(field.columnName, e.target.value)
                      }
                      onBlur={() => handleBlur(field)}
                      disabled={!field.editable || isLoading}
                      className={isError ? 'border-red-600' : ''}
                      maxLength={field.dbLength || undefined}
                    />
                  )}

                  {/* Email Input */}
                  {field.dataType === 'EMAIL' && (
                    <Input
                      id={field.columnName}
                      type="email"
                      placeholder={field.placeholderText || 'email@example.com'}
                      value={value || ''}
                      onChange={(e) =>
                        handleChange(field.columnName, e.target.value)
                      }
                      onBlur={() => handleBlur(field)}
                      disabled={!field.editable || isLoading}
                      className={isError ? 'border-red-600' : ''}
                    />
                  )}

                  {/* Phone Input */}
                  {field.dataType === 'PHONE' && (
                    <Input
                      id={field.columnName}
                      type="tel"
                      placeholder={field.placeholderText || '+1 (555) 000-0000'}
                      value={value || ''}
                      onChange={(e) =>
                        handleChange(field.columnName, e.target.value)
                      }
                      onBlur={() => handleBlur(field)}
                      disabled={!field.editable || isLoading}
                      className={isError ? 'border-red-600' : ''}
                      maxLength={field.dbLength || undefined}
                    />
                  )}

                  {/* Number Input */}
                  {field.dataType === 'NUMBER' && (
                    <Input
                      id={field.columnName}
                      type="number"
                      placeholder={field.placeholderText || '0'}
                      value={value || ''}
                      onChange={(e) =>
                        handleChange(
                          field.columnName,
                          e.target.value ? parseFloat(e.target.value) : ''
                        )
                      }
                      onBlur={() => handleBlur(field)}
                      disabled={!field.editable || isLoading}
                      className={isError ? 'border-red-600' : ''}
                      min={field.minValue || undefined}
                      max={field.maxValue || undefined}
                      step={field.dbScale ? 10 ** -field.dbScale : undefined}
                    />
                  )}

                  {/* Date Input */}
                  {field.dataType === 'DATE' && (
                    <Input
                      id={field.columnName}
                      type="date"
                      value={value || ''}
                      onChange={(e) =>
                        handleChange(field.columnName, e.target.value)
                      }
                      onBlur={() => handleBlur(field)}
                      disabled={!field.editable || isLoading}
                      className={isError ? 'border-red-600' : ''}
                    />
                  )}

                  {/* Dropdown */}
                  {field.dataType === 'DROPDOWN' && (
                    <Select
                      value={value as string}
                      onValueChange={(val) =>
                        handleChange(field.columnName, val)
                      }
                      disabled={!field.editable || isLoading}
                    >
                      <SelectTrigger
                        className={isError ? 'border-red-600' : ''}
                      >
                        <SelectValue
                          placeholder={
                            field.placeholderText ||
                            `Select ${field.displayName.toLowerCase()}`
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {field.lovCode &&
                          LOV_DATA[field.lovCode]?.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  )}

                  {/* Multi-Select Checkbox Group */}
                  {field.dataType === 'MULTISELECT' && (
                    <div className="space-y-2">
                      {field.lovCode &&
                        LOV_DATA[field.lovCode]?.map((option) => (
                          <div
                            key={option.value}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`${field.columnName}-${option.value}`}
                              checked={(
                                (value as string[]) || []
                              ).includes(option.value)}
                              onCheckedChange={(checked) => {
                                const currentArray = (value as string[]) || [];
                                if (checked) {
                                  handleChange(field.columnName, [
                                    ...currentArray,
                                    option.value,
                                  ]);
                                } else {
                                  handleChange(
                                    field.columnName,
                                    currentArray.filter((v) => v !== option.value)
                                  );
                                }
                              }}
                              disabled={!field.editable || isLoading}
                            />
                            <Label
                              htmlFor={`${field.columnName}-${option.value}`}
                              className="cursor-pointer font-normal"
                            >
                              {option.label}
                            </Label>
                          </div>
                        ))}
                    </div>
                  )}

                  {/* Textarea */}
                  {field.dataType === 'TEXTAREA' && (
                    <Textarea
                      id={field.columnName}
                      placeholder={field.placeholderText || `Enter ${field.displayName.toLowerCase()}`}
                      value={value || ''}
                      onChange={(e) =>
                        handleChange(field.columnName, e.target.value)
                      }
                      onBlur={() => handleBlur(field)}
                      disabled={!field.editable || isLoading}
                      className={`resize-none ${isError ? 'border-red-600' : ''}`}
                      rows={4}
                      maxLength={field.dbLength || undefined}
                    />
                  )}

                  {/* Error Message */}
                  {isError && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                </div>
              );
            })}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Saving...' : 'Save Lead'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

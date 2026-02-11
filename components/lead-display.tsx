'use client';

import { FieldConfig, LeadData, LOV_DATA } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface LeadDisplayProps {
  fields: FieldConfig[];
  data: LeadData;
  title?: string;
}

function formatValue(field: FieldConfig, value: any): string {
  if (value === null || value === undefined) {
    return '-';
  }

  switch (field.dataType) {
    case 'DATE':
      if (value) {
        return new Date(value).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
      }
      return '-';

    case 'PHONE':
      return value.toString();

    case 'EMAIL':
      return value.toString();

    case 'NUMBER':
      const num = parseFloat(value);
      if (!isNaN(num)) {
        // Format with decimal places if precision is specified
        if (field.dbScale && field.dbScale > 0) {
          return num.toFixed(field.dbScale);
        }
        return num.toString();
      }
      return value.toString();

    case 'DROPDOWN':
    case 'USER':
      if (field.lovCode && LOV_DATA[field.lovCode]) {
        const option = LOV_DATA[field.lovCode].find(
          (o) => o.value === value
        );
        return option?.label || value.toString();
      }
      return value.toString();

    case 'MULTISELECT':
      if (Array.isArray(value) && field.lovCode && LOV_DATA[field.lovCode]) {
        return value
          .map((v) => {
            const option = LOV_DATA[field.lovCode!].find(
              (o) => o.value === v
            );
            return option?.label || v;
          })
          .join(', ');
      }
      return Array.isArray(value) ? value.join(', ') : value.toString();

    default:
      return value.toString();
  }
}

function ValueBadge({
  field,
  value,
}: {
  field: FieldConfig;
  value: any;
}) {
  if (field.dataType === 'MULTISELECT' && Array.isArray(value) && value.length > 0) {
    return (
      <div className="flex flex-wrap gap-2">
        {value.map((v) => {
          const option = field.lovCode
            ? LOV_DATA[field.lovCode]?.find((o) => o.value === v)
            : null;
          return (
            <Badge key={v} variant="secondary">
              {option?.label || v}
            </Badge>
          );
        })}
      </div>
    );
  }

  if (field.dataType === 'DROPDOWN' && field.lovCode && LOV_DATA[field.lovCode]) {
    const option = LOV_DATA[field.lovCode].find((o) => o.value === value);
    if (option) {
      return <Badge variant="secondary">{option.label}</Badge>;
    }
  }

  return <span className="text-sm text-gray-900">{formatValue(field, value)}</span>;
}

export function LeadDisplay({
  fields,
  data,
  title = 'Lead Details',
}: LeadDisplayProps) {
  const visibleFields = fields.filter((f) => f.visible);

  // Group fields into sections (optional: could be enhanced with section metadata)
  const contactInfoFields = visibleFields.filter((f) =>
    ['email', 'phone', 'primary_contact_name'].includes(f.columnName)
  );
  const companyFields = visibleFields.filter((f) =>
    ['company_name', 'country', 'city'].includes(f.columnName)
  );
  const leadManagementFields = visibleFields.filter((f) =>
    ['lead_status', 'assigned_sales_rep', 'lead_source'].includes(
      f.columnName
    )
  );
  const servicesFields = visibleFields.filter((f) =>
    ['service_line_interested', 'estimated_monthly_volume', 'expected_start_date'].includes(
      f.columnName
    )
  );
  const otherFields = visibleFields.filter(
    (f) =>
      !contactInfoFields.includes(f) &&
      !companyFields.includes(f) &&
      !leadManagementFields.includes(f) &&
      !servicesFields.includes(f)
  );

  const sections = [
    { title: 'Lead Identification', fields: visibleFields.filter((f) => f.columnName === 'lead_id') },
    { title: 'Company Information', fields: companyFields },
    { title: 'Contact Information', fields: contactInfoFields },
    { title: 'Lead Management', fields: leadManagementFields },
    { title: 'Services & Volume', fields: servicesFields },
    ...(otherFields.length > 0 ? [{ title: 'Additional Information', fields: otherFields }] : []),
  ].filter((s) => s.fields.length > 0);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {sections.map((section, sectionIndex) => (
          <div key={section.title}>
            {sectionIndex > 0 && <Separator className="my-6" />}
            <h3 className="mb-4 text-sm font-semibold text-gray-700">
              {section.title}
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              {section.fields.map((field) => {
                const value = data[field.columnName];
                const hasValue = value !== null && value !== undefined && value !== '';

                return (
                  <div key={field.columnName}>
                    <p className="mb-1 text-xs font-medium text-gray-600">
                      {field.displayName}
                    </p>
                    {hasValue ? (
                      <ValueBadge field={field} value={value} />
                    ) : (
                      <span className="text-sm text-gray-400">Not provided</span>
                    )}
                    {field.helpText && (
                      <p className="mt-1 text-xs text-gray-500">{field.helpText}</p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Notes section - special treatment */}
            {section.fields.some((f) => f.columnName === 'notes') && (
              <>
                <Separator className="my-4" />
                <div>
                  <p className="mb-2 text-xs font-medium text-gray-600">Notes</p>
                  <p className="whitespace-pre-wrap rounded-md bg-gray-50 p-3 text-sm text-gray-800">
                    {data['notes'] || 'No notes'}
                  </p>
                </div>
              </>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

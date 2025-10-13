'use client';

import * as React from 'react';
import { DayPicker, type DayPickerProps } from 'react-day-picker';

import { cn } from '@/lib/utils';

export type CalendarProps = DayPickerProps;

function Calendar({ className, ...props }: CalendarProps) {
  return (
    <DayPicker
      className={cn('bg-surface rounded-xl p-4', className)}
      {...props}
    />
  );
}
Calendar.displayName = 'Calendar';

export { Calendar };

import type { LucideIcon } from 'lucide-react';

export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  color: 'yellow' | 'blue' | 'green';
}

export interface WorkflowStep {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface Stat {
  value: string;
  label: string;
  suffix?: string;
}

export interface ColorMap {
  [key: string]: {
    bg: string;
    text: string;
    iconBg: string;
  };
}
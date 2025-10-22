import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { ClassValue } from 'clsx';

export default function tw(...classnames: ClassValue[]) {
  return twMerge(clsx(...classnames));
}

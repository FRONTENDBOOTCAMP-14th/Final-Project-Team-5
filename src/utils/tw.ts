import type { ClassValue } from 'clsx'
import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'

export default function tw(...classnames: ClassValue[]) {
  return twMerge(clsx(...classnames))
}

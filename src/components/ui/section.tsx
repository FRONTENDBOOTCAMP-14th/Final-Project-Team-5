import { tw } from '@/utils'
import type { ComponentProps, ReactNode } from 'react'

type Props = Omit<ComponentProps<'section'>, 'title'> & {
  title: ReactNode
}

export default function Section({
  title,
  className,
  children,
  ...restProps
}: Props) {
  return (
    <section
      className={tw(
        'container mx-auto pt-8 pb-5 px-3 flex flex-col gap-y-2 items-start',
        className
      )}
      {...restProps}
    >
      <h1 className="text-3xl font-light">{title}</h1>
      {children}
    </section>
  )
}

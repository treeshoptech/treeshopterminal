import React from 'react';
import { clsx } from 'clsx';
import styles from './Card.module.css';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'flat' | 'raised' | 'pressed';
  padding?: 'sm' | 'md' | 'lg';
  hover?: boolean;
}

export function Card({
  children,
  variant = 'raised',
  padding = 'md',
  hover = false,
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={clsx(
        styles.card,
        styles[variant],
        styles[`padding-${padding}`],
        hover && styles.hover,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={clsx(styles.header, className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={clsx(styles.title, className)} {...props}>
      {children}
    </h3>
  );
}

export function CardContent({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={clsx(styles.content, className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={clsx(styles.footer, className)} {...props}>
      {children}
    </div>
  );
}

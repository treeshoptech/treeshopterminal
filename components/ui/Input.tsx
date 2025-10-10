import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import styles from './Input.module.css';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helpText, icon, className, ...props }, ref) => {
    return (
      <div className={styles.wrapper}>
        {label && (
          <label className={styles.label} htmlFor={props.id}>
            {label}
          </label>
        )}

        <div className={styles.inputWrapper}>
          {icon && <span className={styles.icon}>{icon}</span>}

          <input
            ref={ref}
            className={clsx(
              styles.input,
              icon && styles.withIcon,
              error && styles.error,
              className
            )}
            {...props}
          />
        </div>

        {error && <p className={styles.errorText}>{error}</p>}
        {helpText && !error && <p className={styles.helpText}>{helpText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

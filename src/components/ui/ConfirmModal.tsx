'use client';

import React from 'react';

export interface ConfirmModalConfig {
  title: string;
  message: string;
  icon?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'success' | 'primary';
  onConfirm: () => void | Promise<void>;
}

interface ConfirmModalProps {
  config: ConfirmModalConfig | null;
  onClose: () => void;
}

export default function ConfirmModal({ config, onClose }: ConfirmModalProps) {
  if (!config) return null;

  const {
    title,
    message,
    icon = '🔒',
    confirmText = 'Confirm',
    cancelText = 'Not now',
    variant = 'primary',
    onConfirm,
  } = config;

  const handleConfirm = async () => {
    await onConfirm();
    onClose();
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          iconBg: 'rgba(220, 38, 38, 0.1)', // bg-red-600/10
          iconBorder: 'rgba(220, 38, 38, 0.2)',
          buttonBg: '#dc2626',
        };
      case 'warning':
        return {
          iconBg: 'rgba(217, 119, 6, 0.1)', // bg-amber-600/10
          iconBorder: 'rgba(217, 119, 6, 0.2)',
          buttonBg: '#d97706',
        };
      case 'success':
      case 'primary':
      default:
        return {
          iconBg: 'rgba(16, 185, 129, 0.1)', // bg-emerald-600/10
          iconBorder: 'rgba(16, 185, 129, 0.2)',
          buttonBg: '#004B39',
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'rgba(0, 0, 0, 0.45)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#ffffff',
          borderRadius: 24,
          padding: '28px 28px 24px 28px',
          maxWidth: 380,
          width: '100%',
          boxShadow: '0 20px 50px rgba(0,0,0,0.18), 0 4px 12px rgba(0,0,0,0.08)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          border: '1px solid #f1f5f9',
        }}
      >
        {/* Top Icon Badge with themed 10% opacity background */}
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: styles.iconBg,
            border: `1px solid ${styles.iconBorder}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 22,
            marginBottom: 16,
          }}
        >
          {icon}
        </div>

        {/* Title */}
        <h3
          style={{
            fontSize: 18,
            fontWeight: 800,
            color: '#0f172a',
            margin: '0 0 8px 0',
            fontFamily: 'inherit',
          }}
        >
          {title}
        </h3>

        {/* Message Subtext */}
        <p
          style={{
            fontSize: 13,
            color: '#64748b',
            lineHeight: 1.5,
            margin: '0 0 24px 0',
            fontWeight: 400,
          }}
        >
          {message}
        </p>

        {/* Action Buttons Row */}
        <div style={{ display: 'flex', gap: 10, width: '100%' }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              flex: 1,
              padding: '12px 18px',
              borderRadius: 99,
              background: '#f1f5f9',
              border: 'none',
              color: '#334155',
              fontWeight: 700,
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            style={{
              flex: 1,
              padding: '12px 18px',
              borderRadius: 99,
              background: styles.buttonBg,
              border: 'none',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: 13,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(15,23,42,0.15)',
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

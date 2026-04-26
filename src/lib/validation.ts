import { VALIDATION_RULES, ERROR_MESSAGES } from '../constants';
import { ValidationResult } from '../types';

export function validatePhoneNumber(phoneNumber: string): ValidationResult {
  const cleaned = phoneNumber.replace(/\D/g, '');

  if (!cleaned) {
    return { isValid: false, error: 'Phone number is required' };
  }

  if (cleaned.length !== VALIDATION_RULES.phoneNumber.minLength) {
    return { isValid: false, error: ERROR_MESSAGES.invalidPhone };
  }

  if (!VALIDATION_RULES.phoneNumber.pattern.test(cleaned)) {
    return { isValid: false, error: ERROR_MESSAGES.invalidPhone };
  }

  return { isValid: true };
}

export function validateOTP(otp: string): ValidationResult {
  const cleaned = otp.replace(/\D/g, '');

  if (!cleaned) {
    return { isValid: false, error: 'OTP is required' };
  }

  if (cleaned.length !== VALIDATION_RULES.otp.length) {
    return { isValid: false, error: ERROR_MESSAGES.invalidOTP };
  }

  if (!VALIDATION_RULES.otp.pattern.test(cleaned)) {
    return { isValid: false, error: ERROR_MESSAGES.invalidOTP };
  }

  return { isValid: true };
}

export function validateUsername(username: string): ValidationResult {
  if (!username) {
    return { isValid: false, error: 'Username is required' };
  }

  if (username.length < VALIDATION_RULES.username.minLength) {
    return {
      isValid: false,
      error: `Username must be at least ${VALIDATION_RULES.username.minLength} characters`,
    };
  }

  if (username.length > VALIDATION_RULES.username.maxLength) {
    return {
      isValid: false,
      error: `Username must be at most ${VALIDATION_RULES.username.maxLength} characters`,
    };
  }

  if (!VALIDATION_RULES.username.pattern.test(username)) {
    return {
      isValid: false,
      error: 'Username can only contain lowercase letters, numbers, and underscores',
    };
  }

  return { isValid: true };
}

export function formatPhoneNumber(phoneNumber: string): string {
  const cleaned = phoneNumber.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{5})(\d{5})$/);

  if (match) {
    return `${match[1]} ${match[2]}`;
  }

  return cleaned;
}

export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes === 0) {
    return `${remainingSeconds}s`;
  }

  if (remainingSeconds === 0) {
    return `${minutes}m`;
  }

  return `${minutes}m ${remainingSeconds}s`;
}

export function formatCoins(coins: number): string {
  return coins.toLocaleString('en-IN');
}

export function formatPrice(price: number): string {
  return `₹${price.toLocaleString('en-IN')}`;
}

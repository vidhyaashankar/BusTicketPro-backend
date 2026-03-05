export const validatePassword = (password: string) => {
  if (password.length < 8) {
    return { valid: false, error: "Password must be at least 8 characters long" };
  }
  if (!/[@#]/.test(password)) {
    return { valid: false, error: "Password must contain at least one special character (@ or #)" };
  }
  return { valid: true };
};

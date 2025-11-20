export const otpTemplate = (name: string, otp: string, maxAttempts: number): { text: string; html: string } => {
    return {
      text: `Hi ${name},
  
  Your one-time password is ${otp}. It expires in 24 hours and is valid for ${maxAttempts} attempts.
  
  If you did not request this code, please contact the admin team.`,
  
      html: `
        <p>Hi ${name},</p>
        <p>Your one-time password is <strong>${otp}</strong>.</p>
        <p>It expires in 24 hours and is valid for ${maxAttempts} attempts.</p>
        <p>If you did not request this code, please contact the admin team.</p>
      `
    };
  };
  
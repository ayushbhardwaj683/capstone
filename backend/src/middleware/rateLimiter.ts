import rateLimit from "express-rate-limit";

export const publicSubmissionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 25,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many submissions from this client. Please try again later." }
});

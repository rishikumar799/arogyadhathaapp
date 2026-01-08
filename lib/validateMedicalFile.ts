type ValidationResult = {
  valid: boolean;
  message?: string;
};

const ALLOWED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/jpg",
];

const MAX_SIZE_MB = 10;

export function validateMedicalFile(file: File | Blob): ValidationResult {
  // ✅ TYPE CHECK (web File only)
  if ("type" in file) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return {
        valid: false,
        message: "Only PDF or medical images (JPG, PNG) are allowed.",
      };
    }
  }

  // ✅ SIZE CHECK
  if ("size" in file) {
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > MAX_SIZE_MB) {
      return {
        valid: false,
        message: "File size must be under 10MB.",
      };
    }
  }

  return { valid: true };
}

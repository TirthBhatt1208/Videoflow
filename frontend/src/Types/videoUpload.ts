export interface UploadFile {
  id: string;
  name: string;
  size: number;
  duration: string;
  thumbnail: string;
  status: "uploading" | "complete" | "failed";
  progress?: number;
  uploadSpeed?: string;
  timeLeft?: string;
  errorMessage?: string;
}
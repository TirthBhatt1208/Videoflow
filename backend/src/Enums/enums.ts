export enum SuccessStatus {
  // Generic Success
  ok = 200,
  created = 201,
  accepted = 202,
  noContent = 204,

  // Auth
  authSuccess = 200,
  loginSuccess = 200,
  logoutSuccess = 200,

  // Upload
  uploadSuccess = 201,
  uploadProcessed = 200,

  // Queue
  queueScheduled = 202,
  queueCompleted = 200,

  // Metadata Worker
  metadataSuccess = 200,

  // Transcoding Worker
  transcodingSuccess = 200,

  // HLS Worker
  hlsGenerated = 200,

  // Storage
  storageSaved = 201,
  storageUpdated = 200,
  storageDeleted = 204,

  // Video Final
  videoReady = 200,
}

export const SuccessMessage = {
  // Generic
  ok_200: "Request completed successfully.",
  created_201: "Resource created successfully.",
  accepted_202: "Request accepted for processing.",
  noContent_204: "Request successful, no content to return.",

  // Auth
  authSuccess_200: "Authentication successful.",
  loginSuccess_200: "Login successful.",
  logoutSuccess_200: "Logout successful.",

  // Upload
  uploadSuccess_201: "File uploaded successfully.",
  uploadProcessed_200: "File processed successfully.",

  // Queue
  queueScheduled_202: "Task scheduled successfully.",
  queueCompleted_200: "Queue task completed.",

  // Metadata Worker
  metadataSuccess_200: "Metadata extracted successfully.",

  // Transcoding Worker
  transcodingSuccess_200: "Transcoding completed successfully.",

  // HLS Worker
  hlsGenerated_200: "HLS files generated successfully.",

  // Storage
  storageSaved_201: "Resource saved successfully.",
  storageUpdated_200: "Resource updated successfully.",
  storageDeleted_204: "Resource deleted successfully.",

  // Video
  videoReady_200: "Final video is ready.",
};


export enum ErrorStatus {
  // Auth
  authMissing = 401,
  authInvalid = 402,
  authForbidden = 403,

  // Upload
  uploadNoFile = 400,
  uploadInvalid = 401,
  uploadTooLarge = 413,
  uploadFailed = 500,

  // Queue
  queueFailed = 500,
  redisError = 501,

  // Metadata worker
  metadataFailed = 500,
  metadataFfmpegError = 501,

  // Transcoding worker
  transcodingFailed = 500,
  transcodingCodecError = 501,

  // HLS worker
  hlsFailed = 500,
  hlsGenerationError = 501,

  // Storage
  storageFailed = 500,
  storageProviderError = 501,

  // Final Video
  videoFailed = 500,

  // Generic
  internalError = 500,
  notFound = 404,
  validationError = 422,
  serviceUnavailable = 503,
}

export const ErrorMessage = {
  // Auth
  authMissing_401: "Authentication token missing.",
  authInvalid_402: "Invalid authentication token.",
  authForbidden_403: "You are not authorized for this action.",

  // Upload
  uploadNoFile_400: "No file provided.",
  uploadInvalid_401: "Invalid file uploaded.",
  uploadTooLarge_413: "File size exceeds the allowed limit.",
  uploadFailed_500: "File upload failed due to server error.",

  // Queue
  queueFailed_500: "Queue processing failed.",
  redisError_501: "Redis operation failed.",

  // Metadata
  metadataFailed_500: "Metadata extraction failed.",
  metadataFfmpegError_501: "FFmpeg encountered a metadata error.",

  // Transcoding
  transcodingFailed_500: "Transcoding process failed.",
  transcodingCodecError_501: "Transcoding failed due to codec issues.",

  // HLS
  hlsFailed_500: "HLS generation failed.",
  hlsGenerationError_501: "Error occurred during HLS file generation.",

  // Storage
  storageFailed_500: "Storage operation failed.",
  storageProviderError_501: "Storage provider returned an error.",

  // Final Video
  videoFailed_500: "Final video processing failed.",

  // Generic
  internalError_500: "Internal server error.",
  notFound_404: "Requested resource not found.",
  validationError_422: "Request validation failed.",
  serviceUnavailable_503: "Service temporarily unavailable.",
};

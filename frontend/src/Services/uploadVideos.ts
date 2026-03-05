import uploadVideosApi from "../Api/postApis";
import { socket } from "../Sockets/sockets";
import { uploadVideoProcessing, videoUploding } from "../Store/store";

// --- Batch & Queue Tracking ---

interface Batch {
  startId: number;
  count: number;
  completed: number;
}

interface QueuedUpload {
  formData: FormData;
  startId: number;
  fileCount: number;
}

const batches: Batch[] = [];
let currentBatchIndex = 0;
let totalExpected = 0;
let totalCompleted = 0;
let progressHandlerRegistered = false;

// Queue for pending uploads — only one batch uploads at a time
const uploadQueue: QueuedUpload[] = [];
let isBatchUploading = false;

// Resolve function to signal that current batch processing is done
let onBatchComplete: (() => void) | null = null;

// --- Progress Handler (registered once per socket session) ---

function setupProgressHandler() {
  if (progressHandlerRegistered) return;
  progressHandlerRegistered = true;

  const { updateVideo } = uploadVideoProcessing.getState();

  socket.off("progress");
  socket.on("progress", (data) => {
    if (data.videoId === undefined || data.videoId === null) {
      console.warn("videoId missing, skipping event");
      return;
    }

    const batch = batches[currentBatchIndex];
    if (!batch) {
      console.warn("No batch found for currentBatchIndex:", currentBatchIndex);
      return;
    }

    // Map backend's per-batch videoId → frontend's cumulative ID
    const globalVideoId = (batch.startId + data.videoId).toString();

    console.log(
      `Progress: batch=${currentBatchIndex}, backendId=${data.videoId}, ` +
      `globalId=${globalVideoId}, progress=${data.progress}, status=${data.status}`
    );

    updateVideo(globalVideoId, {
      progress: data.progress,
      status: data.status,
    });

    if (data.status.toLowerCase() === "completed") {
      batch.completed += 1;
      totalCompleted += 1;

      // If current batch is fully complete, advance and trigger next upload
      if (batch.completed >= batch.count) {
        console.log(`Batch ${currentBatchIndex} complete, advancing to next batch`);
        currentBatchIndex += 1;

        // Signal that the queue can process the next batch
        if (onBatchComplete) {
          onBatchComplete();
          onBatchComplete = null;
        }
      }

      // If ALL videos across ALL batches are done, disconnect
      if (totalCompleted >= totalExpected) {
        console.log("All videos across all batches completed, disconnecting.");
        socket.disconnect();
      }
    }
  });

  socket.off("disconnect");
  socket.on("disconnect", () => {
    videoUploding.getState().setIsUploading();
    uploadVideoProcessing.getState().resetVideoIdCounter();
    // Reset all session tracking
    batches.length = 0;
    currentBatchIndex = 0;
    totalExpected = 0;
    totalCompleted = 0;
    progressHandlerRegistered = false;
    uploadQueue.length = 0;
    isBatchUploading = false;
    onBatchComplete = null;
    console.log("Socket disconnected — all tracking reset");
  });
}

// --- Wait for current batch to finish processing ---

function waitForCurrentBatchComplete(): Promise<void> {
  return new Promise((resolve) => {
    onBatchComplete = resolve;
  });
}

// --- Process the upload queue sequentially ---

async function processQueue(userId: string) {
  if (isBatchUploading) return;
  isBatchUploading = true;

  while (uploadQueue.length > 0) {
    const queued = uploadQueue.shift()!;
    const { updateVideo } = uploadVideoProcessing.getState();

    // Register batch for progress tracking
    batches.push({ startId: queued.startId, count: queued.fileCount, completed: 0 });

    console.log(`Uploading batch: startId=${queued.startId}, count=${queued.fileCount}`);

    const response = await uploadVideosApi(queued.formData);

    if (!response.data.data) {
      console.error("Upload failed for batch startId:", queued.startId);
      socket.disconnect();
      isBatchUploading = false;
      return;
    }

    // Mark videos in this batch as UPLOADED 20%
    for (let i = 0; i < queued.fileCount; i++) {
      updateVideo((queued.startId + i).toString(), {
        progress: 20,
        status: "UPLOADED",
      });
    }

    // ALWAYS wait for this batch's backend processing to complete
    // This prevents the next upload from starting while this batch is still processing
    console.log("Waiting for batch processing to complete...");
    await waitForCurrentBatchComplete();
    console.log("Batch processing complete, checking queue for more...");
  }

  isBatchUploading = false;
}

// --- Public API ---

async function uploadVideos(files: File[], userId: string, startId: number) {
  try {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("videos", file);
    });

    totalExpected += files.length;

    // CONNECT (no-op if already connected)
    if (!socket.connected) {
      socket.connect();

      socket.off("connect");
      socket.on("connect", () => {
        socket.emit("register", userId);
        videoUploding.getState().setIsUploading();
      });
    }

    // Setup progress handler (only once per session)
    setupProgressHandler();

    // Queue the upload — API calls are processed sequentially
    uploadQueue.push({ formData, startId, fileCount: files.length });
    processQueue(userId);
  } catch (err) {
    console.error(err);
  }
}

export default uploadVideos;

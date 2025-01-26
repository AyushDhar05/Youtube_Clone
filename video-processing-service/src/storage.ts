import { Storage } from '@google-cloud/storage';
import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';

// testing

const storage = new Storage();

const rawVideoBucketName = 'ad-yt-raw-videos';
const processedVideoBucketName = 'ad-yt-processed-videos';

const localRawVideosDir = './raw-videos';
const localProcessedVideosDir = './processed-videos';

export function setupDirectories() {
    ensureDirectoryExists(localRawVideosDir);
    ensureDirectoryExists(localProcessedVideosDir);
}

/**
 * Downloads a raw video file from the {@link rawVideoBucketName} bucket.
 * @param fileName - The name of the file to download from the 
 * {@link rawVideoBucketName} bucket into the {@link localRawVideoPath} folder.
 * @returns A promise that resolves when the file has been downloaded.
 */
export async function downloadRawVideo(fileName: string){
    await storage.bucket(rawVideoBucketName)
        .file(fileName)
        .download({
            destination: `${localRawVideosDir}/${fileName}`,
        });
        console.log(`gs://${rawVideoBucketName}/${fileName} downloaded to ${localRawVideosDir}/${fileName}.`);
}

/** Processes a raw video file by converting it to a smaller resolution.
 * @param rawVideoName - The name of the file to convert from {@link localRawVideoPath}.
 * @param processedVideoName - The name of the file to convert to {@link localProcessedVideoPath}.
 * @returns A promise that resolves when the video has been converted.
 */
export function convertVideo(rawVideoName: string, processedVideoName: string){
    return new Promise<void>((resolve, reject) => {
        ffmpeg(`${localRawVideosDir}/${rawVideoName}`)
          .outputOptions("-vf", "scale=-1:360") // 360p
          .on("end", function () {
            console.log("Processing finished successfully");
            resolve();
          })
          .on("error", function (err: any) {
            console.log("An error occurred: " + err.message);
            reject(err);
          })
          .save(`${localProcessedVideosDir}/${processedVideoName}`);
      });
}

/** Uploads a processed video file to the {@link processedVideoBucketName} bucket.
 * @param fileName - The name of the file to upload from the 
 * {@link localProcessedVideoPath} folder into the {@link processedVideoBucketName}.
 * @returns A promise that resolves when the file has been uploaded.
 */
export async function uploadProcessedVideo(fileName: string) {
    const bucket = storage.bucket(processedVideoBucketName);
  
    // Upload video to the bucket
    await storage.bucket(processedVideoBucketName)
      .upload(`${localProcessedVideosDir}/${fileName}`, {
        destination: fileName,
      });
    console.log(
      `${localProcessedVideosDir}/${fileName} uploaded to gs://${processedVideoBucketName}/${fileName}.`
    );
  
    // Set  video to be publicly readable
    await bucket.file(fileName).makePublic();
}
  
/**
 * @param fileName - The name of the file to delete from the
 * {@link localRawVideoPath} folder.
 * @returns A promise that resolves when the file has been deleted.
 * 
 */
export function deleteRawVideo(fileName: string) {
    return deleteFile(`${localRawVideosDir}/${fileName}`);
}
  
  
/**
* @param fileName - The name of the file to delete from the
* {@link localProcessedVideoPath} folder.
* @returns A promise that resolves when the file has been deleted.
* 
*/
export function deleteProcessedVideo(fileName: string) {
    return deleteFile(`${localProcessedVideosDir}/${fileName}`);
}
  
  
/** 
* @param filePath - The path of the file to delete.
* @returns A promise that resolves when the file has been deleted.
*/
function deleteFile(filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error(`Failed to delete file at ${filePath}`, err);
            reject(err);
          } else {
            console.log(`File deleted at ${filePath}`);
            resolve();
          }
        });
      } else {
        console.log(`File not found at ${filePath}, skipping delete.`);
        resolve();
      }
    });
}

/**
 * Ensures a directory exists, creating it if necessary.
 * @param {string} dirPath - The directory path to check.
 */
function ensureDirectoryExists(dirPath: string){
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`Directory created @ ${dirPath}`);
    }
}
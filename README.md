# YouTube Skeleton Clone

Welcome to my GitHub repository for the YouTube Skeleton Clone project. This is a simplified version of YouTube that I built to explore and implement scalable full-stack development practices. I wanted to share my design and development journey with you, so let's dive right in!

## Table of Contents
- [Background](#background)
- [Project Goals](#project-goals)
- [Tech Stack](#tech-stack)
- [High-Level Overview](#high-level-overview)
- [In-Depth Design](#in-depth-design)
- [Challenges and Future Improvements](#challenges-and-future-improvements)
- [Conclusion](#conclusion)
- [References](#references)

---

## Background

YouTube is an incredible platform that lets you upload, watch, rate, share, and comment on videos. However, it's also a colossal undertaking with over a billion daily active users. Instead of recreating the entire YouTube experience, I focused on some core features to build a simplified clone.

## Project Goals

Key objectives:

- **User Authentication:** Sign in/out using Google accounts.
- **Video Uploading:** Authenticated users can upload videos.
- **Video Transcoding:** Videos are transcoded into multiple formats (360p, 720p).
- **Video Viewing:** Public video listing and individual viewing.

## Tech Stack

- **Video Storage:** Google Cloud Storage
- **Event Handling:** Cloud Pub/Sub
- **Video Processing:** Cloud Run + FFmpeg
- **Metadata Storage:** Firestore
- **API:** Firebase Functions
- **Web Client:** Next.js (hosted on Cloud Run)
- **Authentication:** Firebase Auth

## High-Level Overview

- **Storage:** GCS holds raw/processed videos.
- **Events:** Pub/Sub queues handle video upload triggers.
- **Workers:** Cloud Run containers process/transcode videos.
- **Metadata:** Firestore stores video details.
- **API:** Firebase Functions expose endpoints.
- **Web App:** Next.js UI for uploads and viewing.
- **Auth:** Firebase Auth handles sign-in.

## In-Depth Design

### 1. User Sign Up
Uses Firebase Auth for Google sign-ins. Extra data is stored in Firestore via secure Firebase Functions.

### 2. Video Upload
Only authenticated users can upload. Signed URLs are generated after verifying identity. GCS handles uploads.

### 3. Video Processing
Videos are processed asynchronously via Pub/Sub and Cloud Run. Transcoded videos are saved back to GCS. Metadata is updated in Firestore.

Benefits:
- Upload and processing decoupled.
- Scalable workers.
- Structured metadata storage.

## Challenges and Future Improvements

### Limitations

1. **HTTP Timeouts**: Cloud Run max timeout is 3600s, but Pub/Sub ack deadline is 600s. Switch to Pull Subscriptions if needed.
2. **Failed Processing**: Add retry logic or status rollback for failed jobs.
3. **Signed URL Expiry**: Uploads must begin within 15 mins but can complete afterward.
4. **Basic Streaming**: Lacks support for adaptive streaming (like DASH or HLS).
5. **No CDN**: Serving via CDN can improve global access speeds.

### Future Enhancements

- Display profile pics and emails
- Upload thumbnails and add titles/descriptions
- Multiple file upload support
- User subscriptions
- Cleanup raw videos post-processing
- CDN integration
- Unit/integration testing

## Conclusion

Thanks for checking out the project! Designing scalable applications involves many trade-offs, and this project was a great learning experience. Your feedback is welcome — feel free to open issues or suggest improvements!

## References

- [Firebase Auth Documentation](https://firebase.google.com/docs/auth)
- [Cloud Storage Signed URLs](https://cloud.google.com/storage/docs/access-control/signed-urls)
- [Pub/Sub Push Subscriptions](https://cloud.google.com/pubsub/docs/push)
- [Using Pub/Sub with Cloud Storage](https://cloud.google.com/storage/docs/pubsub-notifications)
- [Using Pub/Sub with Cloud Run](https://cloud.google.com/run/docs/tutorials/pubsub)

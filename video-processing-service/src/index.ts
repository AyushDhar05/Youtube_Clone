import express from 'express';
import ffmpeg from 'fluent-ffmpeg';

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON request body
app.use(express.json());

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

app.post('/process-video', (req: any, res: any) => {
    //getting path of input video file
    const inputFilePath = req.body.inputFilePath;
    const outputFilePath = req.body.outputFilePath;

    if (!inputFilePath || !outputFilePath) {
        return res.status(400).send('Bad Request: Missing input or output file path');
    }

    ffmpeg(inputFilePath)
        .outputOptions('-vf', 'scale=640:360') // different options: enter here
        .on('end', () => {
            console.log('Processing finished successfully');
            res.status(200).send('Processing finished successfully');
        })
        .on('error', (err) => {
            console.log('Error processing video: ' + err.message);
            res.status(500).send('Internal Server Error: ' + err.message);
        })
        .save(outputFilePath);
});
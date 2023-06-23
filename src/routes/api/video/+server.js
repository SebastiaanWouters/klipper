import ytdl from 'ytdl-core'
import ffmpeg from 'fluent-ffmpeg'
import { error } from '@sveltejs/kit';


/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
    const { url, startTime, endTime } = await request.json();

    if (!ytdl.validateURL(url)) {
        throw error(400, {
                message: 'Invalid URL, Try Again'
        });
    }

    if (endTime < startTime) {
         throw error(400, {
                message: 'Something went wrong, check your input',
        });
    }

    const videoStream = ytdl(url, {
        format: 'mp4',
        quality: 'highest' 
    });

    let transformStream;

    if (endTime === 0 && startTime == 0) {
        return new Response(videoStream)
    } else if (startTime > 0 && endTime > startTime) {
        transformStream = ffmpeg(videoStream)
        .setStartTime(startTime)
        .setDuration(endTime - startTime)
        .format('mp4')
        .outputOptions('-movflags frag_keyframe+empty_moov')
        .pipe();
    } else if (startTime === 0) {
        transformStream = ffmpeg(videoStream)
        .setDuration(endTime)
        .format('mp4')
        .outputOptions('-movflags frag_keyframe+empty_moov')
        .pipe();
    } else {
        throw error(400, {
                message: 'Something went wrong, check your input'
        });
    }
    
    // Add correct headers
    // Add correct headers
    return new Response(transformStream, {
        headers: {
        'Content-Type': 'video/mp4',
        'Access-Control-Allow-Origin': '*', // Allow requests from any origin
        'Access-Control-Allow-Methods': 'GET, POST', // Allow GET and POST requests
        },
  });
}
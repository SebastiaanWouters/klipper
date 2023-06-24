import ytdl from 'ytdl-core'
import ffmpeg from 'fluent-ffmpeg'
import { error } from '@sveltejs/kit';
import {Readable} from 'stream';
import { log } from 'console';


/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
    const { url, startTime, endTime } = await request.json();

    const newUrl = convertLink(url)

    if (!ytdl.validateURL(newUrl)) {
        throw error(400, {
                message: 'Invalid URL, Try Again'
        });
    }

    if (endTime < startTime) {
         throw error(400, {
                message: 'Something went wrong, check your input',
        });
    }

    let stream = new Readable()

    // const videoStream = ytdl(url, {
    //     format: 'mp4',
    //     range: {start: 10, end: 30}
    // })

    stream = ytdl(newUrl, {
         format: 'mp4'
    })


    let transformStream = new Readable();

    if (endTime === 0 && startTime == 0) {
        //return new Response(videoStream);
        return new Response(stream);

    } else if (startTime > 0 && endTime > startTime) {
        transformStream = ffmpeg(stream)
        .setStartTime(startTime)
        .setDuration(endTime - startTime)
        .format('mp4')
        .outputOptions('-movflags frag_keyframe+empty_moov')
        .pipe();
    } else if (startTime === 0) {
        transformStream = ffmpeg(stream)
        .setDuration(endTime)
        .format('mp4')
        .outputOptions('-movflags frag_keyframe+empty_moov')
        .pipe();
    } else {
        throw error(400, {
                message: 'Something went wrong, check your input'
        });
    }
    
    return new Response(transformStream);
}

function convertLink(yewtuLink) {
    // Validate input
    if (!yewtuLink || typeof yewtuLink !== 'string') {
        return 'Invalid input';
    }

    // Parse the URL
    const url = new URL(yewtuLink);

    // Check if the host is yewtu.be
    if (url.hostname === 'yewtu.be') {
        // Replace the host with youtube.com
        url.hostname = 'youtube.com';

        // Return the new URL
        return url.href;
    }

    // If the URL is not a yewtu.be URL, return the original URL
    return yewtuLink;
}
import ytdl from 'ytdl-core'
import ffmpeg from 'fluent-ffmpeg'
import { error } from '@sveltejs/kit';
import {Readable} from 'stream';
import { log } from 'console';


/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
    const { url, startTime, endTime } = await request.json();

    console.log(startTime, endTime)

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

    let stream = new Readable()

    // const videoStream = ytdl(url, {
    //     format: 'mp4',
    //     range: {start: 10, end: 30}
    // })

    stream = ytdl(url, {
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
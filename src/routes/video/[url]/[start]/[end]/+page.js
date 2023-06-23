
/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params }) {
    const id = params.url
    const start = params.start
    const end = params.end
    let videoUrl = ""

    const res = await fetch('/api/video', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                url: 'https://youtube.com/watch?v=' + id,
                startTime: start,
                endTime: end
            })
        });
        if (!res.ok) {
            return { videoUrl: 'fail', status: res.status, error: new Error('Failed to download video') };
        }

        const blob = await res.blob();
        videoUrl = URL.createObjectURL(blob);

    return { videoUrl } ;
}
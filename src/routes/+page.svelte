<script>
  import { fade } from "svelte/transition";
  import { cubicOut } from "svelte/easing";
  import { Stretch } from 'svelte-loading-spinners';
  import { toast } from '@zerodevx/svelte-toast';

    let videoUrl = null;
    let loading = false;
    let finished = false;
    let fromSec = null, fromMin = null;
    let toSec = null, toMin = null;
    let url = null;
    let id = null;
    let modal;

    const options = {
        theme: {
            '--toastColor': 'mintcream',
            '--toastBackground': 'rgba(204,51,0,0.9)',
            '--toastBarHeight': 0
        }
    }

    const options2 = {
        theme: {
            '--toastColor': 'mintcream',
            '--toastBackground': 'rgba(10,10,10,0.9)',
            '--toastBarHeight': 0
        }
    }


    $: from = fromMin * 60 + fromSec
    $: to = toMin * 60 + toSec

    async function handleClick() {
        console.log(from, to)
        loading = true;
        const res = await fetch('/api/video', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                url: url,
                startTime: from,
                endTime: to
            })
        });
        if (!res.ok) {
            console.log(res);
            loading = false;
            const errorResponse = await res.json();
            if (id) {
                toast.pop(id)
            }
            id = toast.push(errorResponse.message, options);
            return;
        }
        const blob = await res.blob();
        videoUrl = URL.createObjectURL(blob);
        loading = false;
        finished = true;
    }
</script>

<button class="absolute bottom-5 right-5" on:click={() => toast.push("Longer videos take a while to complete", options2)}><img class="w-8" src="info.svg" alt="info" /></button>
{#if !finished}
    <div class="border-2 border-neutral-700 flex flex-col p-6 gap-2 justify-center items-center bg-[#222222] shadow shadow-neutral-700">
        <form class="">
            <div class="mb-4">
            <label class="block text-neutral-200 text-sm font-bold mb-2" for="from">
                From:
            </label>
            <input suffix="m" class="shadow appearance-none border rounded py-2 px-3 w-36 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="from minutes" type="number" placeholder="minutes" bind:value={fromMin}>
            <input class="shadow appearance-none border rounded py-2 px-3 w-36 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="from seconds" type="number" placeholder="seconds" bind:value={fromSec}>
            </div>
            <div class="mb-4">
            <label class="block text-neutral-200 text-sm font-bold mb-2" for="from">
                To:
            </label>
            <input suffix="m" class="shadow appearance-none border rounded py-2 px-3 w-36 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="to minutes" type="number" placeholder="minutes" bind:value={toMin}>
            <input class="shadow appearance-none border rounded py-2 px-3 w-36 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="to seconds" type="number" placeholder="seconds" bind:value={toSec}>
            </div>
            <div class="mb-4">
                <label class="block text-neutral-200 text-sm font-bold mb-2" for="username">
                    URL:
                </label>
                <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="url" type="url" placeholder="https://wtfhappenedin1971.com" bind:value={url}>
            </div>
        </form>
        {#if loading}
            <Stretch color="rgb(37 99 235)"></Stretch>
        {:else}
            <button class="px-3 py-2 bg-[#1a116e] border-2 border-[#342794] hover:bg-[#201586] text-gray-200 shadow hover:shadow-xl" on:click={handleClick} disabled={loading}>Clip</button>
         {/if}
    </div>
{/if}
{#if finished }
    <video width="800" controls src={videoUrl} />
{/if}
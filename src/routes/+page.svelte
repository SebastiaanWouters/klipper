<script>
    import { fade } from "svelte/transition";
    import { cubicOut } from "svelte/easing";
    import { Moon } from 'svelte-loading-spinners';
    import { toast } from '@zerodevx/svelte-toast';
    import { spring } from 'svelte/motion';
    import { onMount } from "svelte";

    let value = spring(0, {
        stiffness: 0.1,
        damping: 0.25
    });

    onMount(() => {
        setInterval(() => {
        value.update(v => v === 100 ? 0 : 100);
        }, 2000);
    })

    

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
            '--toastBackground': 'linear-gradient(to right, #310262 0%, #6B1D9A 50%, #B8000F 150%)',
            '--toastBarHeight': 0
        }
    }

    const options2 = {
        theme: {
            '--toastColor': 'mintcream',
            '--toastBackground': '#333333',
            '--toastBarHeight': 0
        }
    }


    $: from = fromMin * 60 + fromSec
    $: to = toMin * 60 + toSec

    async function handleClick() {
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

<button class="absolute bottom-5 right-5" on:click={() => toast.push("Longer clips take a while to complete. Leave timing blank to download full vidoes.", options2)}><img class="w-8" src="info.svg" alt="info" /></button>

<div class="flex flex-col w-[92%] max-w-3xl items-center pt-[6rem] lg:pt-28"><h1 class="text-[5.4rem] md:text-[6.1rem] font-inter uppercase pointer-events-none font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-900 via-purple-600 to-red-500/50">Klipper</h1>
{#if !finished}
    <div class="flex flex-col gap-6 justify-center items-center">
        <form class="font-roboto">
            <div class="mb-4">
                <label class="block text-neutral-200 font-semibold mb-2" for="username">
                    URL:
                </label>
                <input class="shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="url" type="url" placeholder="https://wtfhappenedin1971.com" bind:value={url}>
            </div>
            <div class="mb-4">
            <label class="block text-neutral-200 font-semibold mb-2" for="from">
                From:
            </label>
            <input class="shadow appearance-none border py-2 px-3 w-[49.3%] text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="from minutes" type="number" placeholder="minutes" bind:value={fromMin}>
            <input class="shadow appearance-none border py-2 px-3 w-[49.3%] text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="from seconds" type="number" placeholder="seconds" bind:value={fromSec}>
            </div>
            <div class="mb-4">
            <label class="block text-neutral-200 font-semibold mb-2" for="from">
                To:
            </label>
            <input class="shadow appearance-none border py-2 px-3 w-[49.3%] text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="to minutes" type="number" placeholder="minutes" bind:value={toMin}>
            <input class="shadow appearance-none border py-2 px-3 w-[49.3%] text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="to seconds" type="number" placeholder="seconds" bind:value={toSec}>
            </div>
        </form>
        {#if loading}
            <Moon size="40" color="rgb(37 99 235)"></Moon>
        {:else}
            <button class="w-full px-4 py-2 bg-gradient-to-l font-inter uppercase font-medium from-indigo-900/80 via-purple-600/80 to-red-500/80 hover:bg-white text-gray-300" on:click={handleClick} disabled={loading}>Clip</button>
         {/if}
    </div>
{/if}
{#if finished }
    <video width="800" controls src={videoUrl} />
{/if}
</div>

<style>
@keyframes border-animation {
    0% {background-position: 0% 50%;}
    50% {background-position: 100% 50%;}
    100% {background-position: 0% 50%;}
}


</style>
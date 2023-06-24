<script>
  import "../global.css";
  import { SvelteToast } from '@zerodevx/svelte-toast'
</script>

<svelte:head>
    <title>Video Clipper</title> 
</svelte:head>


<div class="w-full min-h-screen flex justify-center items-center bg-[#111111] text-neutral-100">
  <SvelteToast />
  <slot />
</div>

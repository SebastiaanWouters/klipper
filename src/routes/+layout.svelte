<script>
  import "../global.css";
  import { SvelteToast } from '@zerodevx/svelte-toast'
</script>

<svelte:head>
    <title>Klipper</title> 
</svelte:head>


<div class="w-full min-h-screen flex justify-center items-start bg-[#111111] text-neutral-100">
  <SvelteToast />
  <slot />
</div>

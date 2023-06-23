<script>
    export let data;
</script>

{#if data.videoUrl !== null  && data.videoUrl.includes("localhost")}
    <video controls src={data.videoUrl} />
{:else}
    <p>Loading video...</p>
{/if}
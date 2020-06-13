<script>
  import channels from "common/channels";

  function openFolder() {
    const { ipcRenderer } = window.electron;
    ipcRenderer.send(channels.OPEN_DIALOG);
  }
</script>

<button on:click={openFolder}>Choose your file</button>

<script>
  import { auth } from "./firebase";
  import { userStore, Doc } from "sveltefire";
  import { pathStore } from "../lib/stores";

  const user = userStore(auth);
  export let path;

  function breadcrumsHover(e) {
    let target = e.target.querySelector("span");
    if (!target) {
      target = e.target.parentNode.querySelector("span");
    }
    if (!target) {
      target = e.target.parentNode.parentNode.querySelector("span");
    }
    if (e.type === "mouseover" || e.type === "focus") {
      target.classList.add("underline");
    } else if (e.type === "mouseout" || e.type === "blur") {
      target.classList.remove("underline");
    }
  }

  const getPathIds = () => {
    const pathIds = path.split("/");
    pathIds.shift();
    return pathIds;
  };
</script>

<div class="text-sm breadcrumbs">
  <ul>
    <li>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-missing-attribute -->
      <a
        role="button"
        class="hover:!no-underline"
        on:mouseover={(e) => breadcrumsHover(e)}
        on:focus={(e) => breadcrumsHover(e)}
        on:mouseout={(e) => breadcrumsHover(e)}
        on:blur={(e) => breadcrumsHover(e)}
        on:click={() => pathStore.set("root")}
      >
        <i class="fa-solid fa-house w-4 h-4 mr-2" />
        <span>root</span>
      </a>
    </li>
    {#each getPathIds() as pathId}
      <Doc ref={`users/${$user.uid}/folders/${pathId}`} let:data={folder}>
        <li>
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <!-- svelte-ignore a11y-missing-attribute -->
          <a
            role="button"
            class="hover:!no-underline"
            on:mouseover={(e) => breadcrumsHover(e)}
            on:focus={(e) => breadcrumsHover(e)}
            on:mouseout={(e) => breadcrumsHover(e)}
            on:blur={(e) => breadcrumsHover(e)}
            on:click={() => pathStore.set(`root/${pathId}`)}
          >
            <i class="fa-solid fa-folder w-4 h-4 mr-2" />
            <span>{folder.name}</span>
          </a>
        </li>
      </Doc>
    {/each}
  </ul>
</div>

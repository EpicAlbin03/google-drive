<script>
  import { auth, firestore } from "./firebase";
  import { userStore, Collection } from "sveltefire";
  import {
    collection,
    orderBy,
    query,
    where,
    getDocs,
  } from "firebase/firestore";
  import { pathStore } from "../lib/stores";
  import Breadcrumbs from "./Breadcrumbs.svelte";

  const user = userStore(auth);

  let path = "";
  $: pathStore.subscribe((value) => {
    path = value;
  });

  $: foldersQuery = () => {
    const q = query(
      collection(firestore, `users/${$user.uid}/folders`),
      where("parentPath", "==", path),
      orderBy("createdAt", "desc")
    );

    return q;
  };

  $: filesQuery = () => {
    const q = query(
      collection(firestore, `users/${$user.uid}/files`),
      where("parentPath", "==", path),
      orderBy("createdAt", "desc")
    );

    return q;
  };

  function downloadFile(fileName) {
    const q = query(
      collection(firestore, `users/${$user.uid}/files`),
      where("name", "==", fileName),
      where("userId", "==", $user.uid),
      where("parentPath", "==", path)
    );
    getDocs(q).then((doc) => {
      if (!doc.empty) {
        const url = doc.docs[0].data().url;
        window.open(url, "_blank");
      }
    });
  }
</script>

{#key foldersQuery() || filesQuery()}
  <div class="flex flex-col gap-2 w-full">
    <Breadcrumbs {path} />

    <div class="pt-2">
      <Collection ref={foldersQuery()} startWith={[]} let:data={folders}>
        <ul class="flex flex-row gap-2">
          {#each folders as folder (folder.id)}
            <li>
              <button
                class="btn btn-outline normal-case"
                on:click={() => {
                  pathStore.set(path + "/" + folder.id);
                }}
              >
                <i class="fa-solid fa-folder mr-2" />
                {folder.name}
              </button>
            </li>
          {/each}
        </ul>

        <div slot="loading">Loading Folders...</div>
      </Collection>

      <div class="divider" />

      <Collection ref={filesQuery()} startWith={[]} let:data={files}>
        <div class="flex flex-col gap-2">
          <ul class="flex flex-row gap-2">
            {#each files as file (file.id)}
              <li>
                <button
                  class="btn btn-outline normal-case"
                  on:click={() => downloadFile(file.name)}
                >
                  <i class="fa-solid fa-file mr-2" />
                  {file.name}
                </button>
              </li>
            {/each}
          </ul>
        </div>

        <div slot="loading">Loading Files...</div>
      </Collection>
    </div>
  </div>
{/key}

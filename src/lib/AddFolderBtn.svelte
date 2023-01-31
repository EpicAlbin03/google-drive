<script>
  import { auth, firestore } from "./firebase";
  import { userStore } from "sveltefire";
  import {
    addDoc,
    collection,
    where,
    getDocs,
    query,
  } from "firebase/firestore";

  const user = userStore(auth);
  export let path = "";
  let folderNameInp;
  let folderBtnModal = false;
  let errorText = "";

  async function addFolder() {
    const folderName = folderNameInp.value;
    if (!folderName) return;

    const folders = collection(firestore, `users/${$user.uid}/folders`);
    const foldersQuery = query(
      folders,
      where("name", "==", folderName),
      where("userId", "==", $user.uid),
      where("parentPath", "==", path)
    );

    getDocs(foldersQuery).then((doc) => {  
      if (doc.empty) {
        addDoc(folders, {
          name: folderName,
          createdAt: new Date(),
          parentPath: path,
          userId: $user.uid,
        });

        folderBtnModal = false;
      } else {
        errorText = "A folder with that name already exists!";
        console.log(errorText);
      }
    });

    folderNameInp.value = "";
  }
</script>

<!-- The button to open modal -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<label for="" class="btn btn-outline btn-success" on:click={() => {
  folderBtnModal = true;
  errorText = "";
}}>
  <i class="fa-solid fa-folder text-lg" />
</label>

<input type="checkbox" id="folderBtnModal" class="modal-toggle" bind:checked={folderBtnModal} />
<label for="folderBtnModal" class="modal cursor-pointer">
  <label class="modal-box relative" for="">
    <h3 class="text-lg font-bold pb-4">Add folder</h3>
    <input
      type="text"
      placeholder="Folder name"
      class="input input-bordered w-full max-w-xs"
      bind:this={folderNameInp}
    />
    <!-- svelte-ignore a11y-label-has-associated-control -->
    <label class="label">
      <span class="label-text-alt text-error">{errorText}</span>
    </label>
    <div class="modal-action">
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <label for="" class="btn btn-success" on:click={addFolder}
        >Add</label
      >
    </div>
  </label>
</label>

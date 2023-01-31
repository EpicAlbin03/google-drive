<script>
  import { auth, firestore, storage } from "./firebase";
  import { userStore } from "sveltefire";
  import {
    addDoc,
    collection,
    updateDoc,
    where,
    query,
    getDocs,
  } from "firebase/firestore";
  import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

  const user = userStore(auth);
  export let path = "";
  let filePathInp;

  function addFile() {
    if (!filePathInp.value) return;

    const fileName = filePathInp.value.split("\\").pop();
    const fileRef = ref(storage, `users/${$user.uid}/files/${fileName}`);
    const uploadTask = uploadBytesResumable(fileRef, filePathInp.value);

    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        console.log(error);
      },
      () => {
        // upload complete
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          const files = collection(firestore, `users/${$user.uid}/files`);
          const filesQuery = query(
            files,
            where("name", "==", fileName),
            where("userId", "==", $user.uid),
            where("parentPath", "==", path)
          );

          getDocs(filesQuery).then((doc) => {
            if (doc.empty) {
              addDoc(files, {
                url: downloadURL,
                name: fileName,
                createdAt: new Date(),
                parentPath: path,
                userId: $user.uid,
              });
            } else {
              updateDoc(doc.docs[0].ref, {
                url: downloadURL,
              });
            }
          });
        });
      }
    );

    filePathInp.value = "";
  }
</script>

<!-- The button to open modal -->
<label for="fileBtnModal" class="btn btn-outline btn-success">
  <i class="fa-solid fa-file text-lg" />
</label>

<input type="checkbox" id="fileBtnModal" class="modal-toggle" />
<label for="fileBtnModal" class="modal cursor-pointer">
  <label class="modal-box relative" for="">
    <h3 class="text-lg font-bold pb-4">Add file</h3>
    <input
      type="file"
      class="file-input file-input-bordered w-full max-w-xs"
      bind:this={filePathInp}
    />
    <div class="modal-action">
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <label for="fileBtnModal" class="btn btn-success" on:click={addFile}
        >Add</label
      >
    </div>
  </label>
</label>

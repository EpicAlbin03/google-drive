<script>
  // @ts-nocheck
  import { auth, firestore } from "./lib/firebase";
  import { FirebaseApp, User } from "sveltefire";
  import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
  import AddFolderBtn from "./lib/AddFolderBtn.svelte";
  import FolderStructure from "./lib/FolderStructure.svelte";
  import { pathStore } from "./lib/stores";
  import AddFileBtn from "./lib/AddFileBtn.svelte";

  let path = "";
  pathStore.subscribe((value) => {
    path = value;
  });
</script>

<svelte:head>
  <script
    src={import.meta.env.VITE_FONT_AWESOME_API_KEY}
    crossorigin="anonymous"
  ></script>
</svelte:head>

<FirebaseApp {auth} {firestore}>
  <!-- If user is logged in -->
  <User let:user>
    <div class="navbar bg-base-content p-3">
      <div class="flex-1">
        <img src="/google-drive.png" alt="google-drive" />
        <a href="/" class="btn btn-ghost normal-case text-xl text-white"
          >Google Drive</a
        >
      </div>
      <div class="flex-none gap-2">
        <div class="dropdown dropdown-end">
          <button class="btn btn-ghost btn-circle avatar">
            <div class="w-10 rounded-full">
              <img src={user.photoURL} alt="user icon" class="" />
            </div>
          </button>
          <ul
            class="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52"
          >
            <li>
              <button on:click={() => signOut(auth)}>
                <i class="fa-solid fa-right-from-bracket" />
                Logout</button
              >
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="flex p-2">
      <FolderStructure />
      <div class="ml-auto flex gap-2">
        <AddFileBtn {path} />
        <AddFolderBtn {path} />
      </div>
    </div>

    <!-- If user is logged out -->
    <div slot="signedOut" class="navbar bg-base-content p-3">
      <div class="flex-1">
        <img src="/google-drive.png" alt="google-drive" />
        <a href="/" class="btn btn-ghost normal-case text-xl text-white"
          >Google Drive</a
        >
      </div>
      <div class="flex-none gap-2">
        <button
          class="btn btn-primary"
          on:click={() => signInWithPopup(auth, new GoogleAuthProvider())}
          >Sign in</button
        >
      </div>
    </div>
  </User>
</FirebaseApp>

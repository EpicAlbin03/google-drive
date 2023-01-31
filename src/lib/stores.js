import { writable } from "svelte/store";

let path = "root";

export const pathStore = writable(path);

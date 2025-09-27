// Visit the wiki for more info - https://kubejs.com/
console.info('Hello, World! (Loaded server example script)')

let NoppesApi = Java.loadClass("noppes.npcs.api.NpcAPI")

console.info(NoppesApi.IsAvailable())


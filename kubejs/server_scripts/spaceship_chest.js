/**
 * 
 * @param {$ServerPlayer_} player 
 * @param {string} adv_name 
 */
function checkForAdvancement(player, adv_name){
    return player.advancements.getOrStartProgress(player.server.advancements.get($ResourceLocation.parse(adv_name))).isDone();
}

LootJS.lootTables(event => {
    event.create("modpack:spaceship_chest").createPool(pool => {
        pool.addEntry(LootEntry.of("kubejs:drill_wooden").matchPlayerCustom(player => {
            return !checkForAdvancement(player, "modpack:unlocks/stone_drill");
        }));
        pool.addEntry(LootEntry.of("kubejs:drill_stone").matchPlayerCustom(player => {
            return checkForAdvancement(player, "modpack:unlocks/stone_drill");
        }));
    });
});
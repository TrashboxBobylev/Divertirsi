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
        pool.rolls(2);
        pool.addEntry(LootEntry.of("kubejs:drill_wooden").matchPlayerCustom(player => {
            return !checkForAdvancement(player, "modpack:unlocks/stone_drill");
        }));
        pool.addEntry(LootEntry.of("kubejs:drill_stone").matchPlayerCustom(player => {
            return checkForAdvancement(player, "modpack:unlocks/stone_drill");
        }));
        pool.addEntry(LootEntry.of("ae2:portable_item_cell_1k[ae2:stored_energy=40000.0d]"));
    });
});
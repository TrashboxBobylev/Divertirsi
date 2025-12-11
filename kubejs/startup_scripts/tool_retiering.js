/** @type {typeof import("dev.latvian.mods.kubejs.item.MutableToolTier").$MutableToolTier } */
let $MutableToolTier  = Java.loadClass("dev.latvian.mods.kubejs.item.MutableToolTier")
ItemEvents.modification(event => {
    for (let tool of ["minecraft:diamond_pickaxe", "minecraft:diamond_hoe", "minecraft:diamond_axe", "minecraft:diamond_shovel", "minecraft:diamond_sword"]){
        event.modify(tool, item => {
            item.tier = tier => {
                tier.uses = 900;
                tier.attackDamageBonus = 5.5;
                tier.speed = 20;
                tier.enchantmentValue = 14;
                tier.incorrectBlocksForDropsTag = "minecraft:incorrect_for_netherite_tool";
            };
        });
    }
    for (let tool of ["minecraft:netherite_pickaxe", "minecraft:netherite_hoe", "minecraft:netherite_axe", "minecraft:netherite_shovel", "minecraft:netherite_sword"]){
        event.modify(tool, item => {
            item.tier = tier => {
                tier.uses = 4500;
                tier.attackDamageBonus = 2;
                tier.speed = 7;
                tier.enchantmentValue = 10;
                tier.incorrectBlocksForDropsTag = "minecraft:incorrect_for_netherite_tool";
            };
        });
    }
});
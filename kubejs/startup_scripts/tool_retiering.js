/** @type {typeof import("dev.latvian.mods.kubejs.item.MutableToolTier").$MutableToolTier } */
let $MutableToolTier  = Java.loadClass("dev.latvian.mods.kubejs.item.MutableToolTier")
ItemEvents.modification(event => {
    /**
     * @type {import("java.util.function.Consumer").$Consumer$$Type<$MutableToolTier_>}
     */
    let new_diamond_tier = tier => {
        tier.getUses = 900;
        tier.attackDamageBonus = 5.5;
        tier.speed = 20;
        tier.enchantmentValue = 14;
        tier.incorrectBlocksForDropsTag = "minecraft:incorrect_for_netherite_tool";
        tier.repairIngredient = "actuallyadditions:diamatine_crystal"; 
    };
    for (let tool of ["minecraft:diamond_pickaxe", "minecraft:diamond_hoe", "minecraft:diamond_axe", "minecraft:diamond_shovel", "minecraft:diamond_sword"]){
        event.modify(tool, item => {
            item.tier = new_diamond_tier;
        });
    }

    /**
     * @type {import("java.util.function.Consumer").$Consumer$$Type<$MutableToolTier_>}
     */
    let new_netherite_tier = tier => {
        tier.getUses = 4500;
        tier.attackDamageBonus = 2;
        tier.speed = 7;
        tier.enchantmentValue = 10;
        tier.incorrectBlocksForDropsTag = "minecraft:incorrect_for_netherite_tool";
    };
    for (let tool of ["minecraft:netherite_pickaxe", "minecraft:netherite_hoe", "minecraft:netherite_axe", "minecraft:netherite_shovel", "minecraft:netherite_sword"]){
        event.modify(tool, item => {
            item.tier = new_netherite_tier;
        });
    }
});
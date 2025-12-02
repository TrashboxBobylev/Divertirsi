let $LootItem  = Java.loadClass("net.minecraft.world.level.storage.loot.entries.LootItem");
let $EquipmentSlot  = Java.loadClass("net.minecraft.world.entity.EquipmentSlot");
let $InteractionHand  = Java.loadClass("net.minecraft.world.InteractionHand");
/**
 * @type Object.<string, LootEntry>
 */
let hammer_possibilities = {
     "minecraft:stone": LootEntry.of("minecraft:cobblestone"),
    "minecraft:cobblestone": LootEntry.of("minecraft:gravel"),
    "minecraft:gravel": LootEntry.of("minecraft:sand"),
    "minecraft:sandstone": LootEntry.of("minecraft:sand"),
    "minecraft:red_sandstone": LootEntry.of("minecraft:red_sand"),
    "minecraft:packed_ice": LootEntry.of("minecraft:ice"),
    "minecraft:blue_ice": LootEntry.of("minecraft:packed_ice"),
    "minecraft:bricks": LootEntry.of("minecraft:brick").setCount([2, 4]),
    "minecraft:coal_ore": LootEntry.of("oritech:coal_dust").setCount(1).applyEnchantmentBonus("minecraft:fortune", [0, 1]),
    "minecraft:deepslate_coal_ore": LootEntry.of("oritech:coal_dust").setCount(1).applyEnchantmentBonus("minecraft:fortune", [0, 1]),
    "minecraft:iron_ore": LootEntry.of("energizedpower:iron_dust").setCount(1).applyEnchantmentBonus("minecraft:fortune", [0, 1]),
    "minecraft:deepslate_iron_ore": LootEntry.of("energizedpower:iron_dust").setCount(1).applyEnchantmentBonus("minecraft:fortune", [0, 1]),
    "minecraft:copper_ore": LootEntry.of("energizedpower:copper_dust").setCount([2, 5]).applyEnchantmentBonus("minecraft:fortune", [0, 5]),
    "minecraft:deepslate_copper_ore": LootEntry.of("energizedpower:copper_dust").setCount([2, 5]).applyEnchantmentBonus("minecraft:fortune", [0, 5]),
    "minecraft:gold_ore": LootEntry.of("energizedpower:gold_dust").setCount(1).applyEnchantmentBonus("minecraft:fortune", [0, 1]),
    "minecraft:deepslate_gold_ore": LootEntry.of("energizedpower:gold_dust").setCount(1).applyEnchantmentBonus("minecraft:fortune", [0, 1]),
    "minecraft:lapis_ore": LootEntry.of("enderio:powdered_lapis_lazuli").setCount([4, 9]).applyEnchantmentBonus("minecraft:fortune", [0, 9]),
    "minecraft:deepslate_lapis_ore": LootEntry.of("enderio:powdered_lapis_lazuli").setCount([4, 9]).applyEnchantmentBonus("minecraft:fortune", [0, 9]),
    "energizedpower:tin_ore": LootEntry.of("energizedpower:tin_dust").setCount(1).applyEnchantmentBonus("minecraft:fortune", [0, 1]),
    "energizedpower:deepslate_tin_ore": LootEntry.of("energizedpower:tin_dust").setCount(1).applyEnchantmentBonus("minecraft:fortune", [0, 1]),
    "immersiveengineering:ore_lead": LootEntry.of("immersiveengineering:dust_lead").setCount(1).applyEnchantmentBonus("minecraft:fortune", [0, 1]),
    "immersiveengineering:deepslate_ore_lead": LootEntry.of("immersiveengineering:dust_lead").setCount(1).applyEnchantmentBonus("minecraft:fortune", [0, 1]),
    "immersiveengineering:ore_silver": LootEntry.of("immersiveengineering:dust_silver").setCount(1).applyEnchantmentBonus("minecraft:fortune", [0, 1]),
    "immersiveengineering:deepslate_ore_silver": LootEntry.of("immersiveengineering:dust_silver").setCount(1).applyEnchantmentBonus("minecraft:fortune", [0, 1]),
    "immersiveengineering:ore_nickel": LootEntry.of("immersiveengineering:dust_nickel").setCount(1).applyEnchantmentBonus("minecraft:fortune", [0, 1]),
    "immersiveengineering:deepslate_ore_nickel": LootEntry.of("immersiveengineering:dust_nickel").setCount(1).applyEnchantmentBonus("minecraft:fortune", [0, 1]),
    "immersiveengineering:ore_uranium": LootEntry.of("immersiveengineering:dust_uranium").setCount(1).applyEnchantmentBonus("minecraft:fortune", [0, 1]),
    "immersiveengineering:deepslate_ore_uranium": LootEntry.of("immersiveengineering:dust_uranium").setCount(1).applyEnchantmentBonus("minecraft:fortune", [0, 1]),
    "oritech:deepslate_platinum_ore": LootEntry.of("oritech:platinum_dust").setCount(1).applyEnchantmentBonus("minecraft:fortune", [0, 1]),
    "minecraft:mangrove_roots": LootEntry.of("minecraft:stick").setCount([0, 1]).applyEnchantmentBonus("minecraft:fortune", [1, 1]),
    "minecraft:amethyst_block": LootEntry.of("minecraft:amethyst_shard").setCount([2, 3]),
    "minecraft:dripstone_block": LootEntry.of("minecraft:pointed_dripstone").setCount([2, 3]),
    "actuallyadditions:black_quartz_ore": LootEntry.of("jaopca:dusts.black_quartz").setCount(1).applyEnchantmentBonus("minecraft:fortune", [0, 1]),
    "kubejs:deepslate_black_quartz": LootEntry.of("jaopca:dusts.black_quartz").setCount(1).applyEnchantmentBonus("minecraft:fortune", [0, 1]),
    "kubejs:crystal_black_quartz": LootEntry.of("jaopca:dusts.black_quartz").setCount([3, 8]).applyEnchantmentBonus("minecraft:fortune", [1, 2]),
};

ServerEvents.tags("block", event => {
    for (let block in hammer_possibilities){
        event.add("modpack:mineable/hammer", block);
    }
    event.removeAllTagsFrom("energizedpower:wooden_hammer");
});

LootJS.lootTables(event => {
    for (let block in hammer_possibilities){
        event.create(`crush_${$ResourceLocation.parse(block).path}_with_hammer`).createPool(pool => {
            pool.addEntry(hammer_possibilities[block]);
        });
    }
});



ServerEvents.recipes(event => {
    event.remove("energizedpower:crafting/wooden_hammer");

    for (let block in hammer_possibilities){
        let result_item;
        Java.cast<$LootItem>($LootItem, hammer_possibilities[block].vanillaEntry).createItemStack((item) => {
            result_item = item;
        }, null);
        event.shapeless(result_item, [
            "energizedpower:wooden_hammer", block
        ]);
    }
});

LootJS.modifiers(event => {
    event.addBlockModifier("#modpack:mineable/hammer").matchTool("#c:tools/hammers").customAction((context, loot) => {
        let current_block = context.getParam(LootContextParams.BLOCK_STATE).id;
        if (current_block in hammer_possibilities){
            loot.clear();
            loot.addEntry(LootEntry.alternative(
                hammer_possibilities[current_block],
                LootEntry.reference(context.id)
            ));
            return loot;
        }
        return loot;
    });
});

ServerEvents.recipes(event => {
    /**
     * @param {$RecipesKubeEvent_} event
     * @param {$ItemStack} hammer
     * @param {$ItemStack_} stick
     */
    function hammer(event, hammer, stick){
        let material = hammer.getItem().getTier().repairIngredient;
        event.shaped(hammer, [
            " m ",
            " sm",
            "s  "
        ], {
            m: material,
            s: stick
        });
    }

    hammer(event, Item.of("kubejs:steel_hammer"), "immersiveengineering:stick_treated");
});

EntityEvents.afterHurt(event => {
    let tool = event.source.getWeaponItem();
    // let tool = event.entity.getItemInHand($InteractionHand.MAIN_HAND);
    if (tool != null && tool.hasTag("c:tools/hammers")){
        tool.hurtAndBreak(2, event.entity, $EquipmentSlot.MAINHAND);
    }
})
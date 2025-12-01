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
    "minecraft:blue_ice": LootEntry.of("minecraft:packed_ice")
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
            pool.addEntry(block);
            pool.addEntry('immersiveengineering:warning_sign_arrow_right');
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
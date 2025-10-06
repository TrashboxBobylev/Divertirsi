const $Tool = Java.loadClass("net.minecraft.world.item.component.Tool");
const $Unbreakable = Java.loadClass("net.minecraft.world.item.component.Unbreakable");

let tool_tiers = [
    "#minecraft:incorrect_for_wooden_tool",
    "#minecraft:incorrect_for_stone_tool",
    "#minecraft:incorrect_for_iron_tool",
    "#minecraft:incorrect_for_diamond_tool",
    "#minecraft:incorrect_for_netherite_tool"
];

/**
 * @param {$ItemBuilder_} event 
 * @param {number} miningSpeed 
 * @param {number} tier 
 * @param {string} name
 * @returns {$ItemBuilder_}
 */
function defineDrill(event, miningSpeed, tier, name){
    const toolComponent = new $Tool([
            new $Tool.Rule(tool_tiers[tier-1], 1, false),
            new $Tool.Rule("#minecraft:mineable/axe", miningSpeed, true),
            new $Tool.Rule("#minecraft:mineable/pickaxe", miningSpeed, true),
            new $Tool.Rule("#minecraft:mineable/shovel", miningSpeed, true),
            new $Tool.Rule("#minecraft:mineable/hoe", miningSpeed, true),
    ], 1, 0);

    return event.create("drill_" + name).displayName({translate: `item.kubejs.drill_${name}`}).component("tool", toolComponent).component("unbreakable", new $Unbreakable(true)).maxStackSize(1).tooltip(Component.join({translate: `item.kubejs.drill.universal`}, "\n\n", {translate: `item.kubejs.drill_${name}.tooltip`}));
}

StartupEvents.registry("item", event => {
    defineDrill(event, 1.5, 1, "wooden");
    defineDrill(event, 2.5, 2, "stone");
});
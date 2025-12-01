/**
 * @type Object.<string, string>
 */
let simple_hammer_possibilities = {
    "minecraft:polished_deepslate": "chipped:eroded_deepslate"
};

/**
 * @type Object.<string, LootEntry>
 */
let hammer_possibilities = {
    "minecraft:polished_andesite": LootEntry.of("minecraft:diamond").randomChance(0.25)
};

LootJS.modifiers(event => {
    for (let block in simple_hammer_possibilities){
        event.addBlockModifier(block).matchTool("#c:tools/hammers").replaceLoot(
            block,
            simple_hammer_possibilities[block],
            true
        );
    }
    for (let block in hammer_possibilities){
        event.addBlockModifier(block).matchTool("#c:tools/hammers").removeLoot(Ingredient.all).addAlternativesLoot(
                hammer_possibilities[block],
                block
        );
    }
});
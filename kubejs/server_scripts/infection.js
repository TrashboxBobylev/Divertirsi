const poses = [{x: -1, y: 0, z: 0}, {x: 1, y: 0, z: 0}, {x: 0, y: 0, z: -1}, {x: 0, y: 0, z: 1}, {x: 0, y: 1, z: 0}, {x: 0, y: -1, z: 0}, {x: 0, y: 1, z: 0}, {x: 0, y: -1, z: 0}];

ServerEvents.tags("block", event => {
    const stones = event.get('minecraft:stone_ore_replaceables').getObjectIds();
    const blacklist = Ingredient.of(/.*andesite.*/);
    stones.forEach(stone => {
        if (!blacklist.test(stone)) event.add('kubejs:andesite_stone_infectable', stone);
    });
    event.add("kubejs:andesite_deepslate_infectable", "#minecraft:deepslate_ore_replaceables");
});

const AndesiteInfection = {
    dictionary: {
        "kubejs:andesite_stone_infectable": {block: "minecraft:andesite", chance: 1.0, explode: false},
        "kubejs:andesite_deepslate_infectable": {block: "kubejs:deepslate_andesite", chance: 1.0, explode: false},
        "kubejs:andesite_infected": {block: "minecraft:andesite", chance: 0.8, explode: false},
        "chipped:andesite": {block: "actuallyadditions:black_quartz_ore", chance: 0.66, explode: false},
        "c:ores/black_quartz": {block: "kubejs:crystal_black_quartz", chance: 0.35, explode: true},
    },

        /**
     * @param {$BlockContainerJS_} block
     * @param {$ServerLevel_} level
     * @param {$RandomSource_} random 
     */
    infectWithAndesite(block, random, level){
        let randomPos = poses[random.nextInt(poses.length)];
        let targetPos = new BlockPos(block.pos.x + randomPos.x, block.pos.y + randomPos.y, block.pos.z + randomPos.z);
        let targetBlock = level.getBlockState(targetPos);
        targetBlock.tags.filter(tagkey => tagkey.location().toString() in AndesiteInfection.dictionary)
        .forEach(tagkey => {
            if (random.nextFloat() < AndesiteInfection.dictionary[tagkey.location()].chance){
                if (AndesiteInfection.dictionary[tagkey.location()].explode){
                    for (let pos of BlockPos.betweenClosed(block.pos.offset(-1, -1, -1), block.pos.offset(1, 1, 1))){
                        if (!level.getBlockState(pos).air)
                            level.setBlockAndUpdate(pos, random.nextInt(3) == 0 ? (pos.y > 0 ? "minecraft:andesite" : "kubejs:deepslate_andesite") : (pos.y > 0 ? "minecraft:stone" : "minecraft:deepslate"));
                    }
                }
                level.setBlockAndUpdate(targetPos, AndesiteInfection.dictionary[tagkey.location()].block);
            }
        });
    }
};

BlockEvents.randomTick("actuallyadditions:black_quartz_ore", event => {
    const {block, random, level} = event;
    AndesiteInfection.infectWithAndesite(block, random, level);
});

BlockEvents.randomTick("kubejs:deepslate_black_quartz", event => {
    const {block, random, level} = event;
    AndesiteInfection.infectWithAndesite(block, random, level);
});
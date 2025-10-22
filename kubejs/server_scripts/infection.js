const poses = [{x: -1, y: 0, z: 0}, {x: 1, y: 0, z: 0}, {x: 0, y: 0, z: -1}, {x: 0, y: 0, z: 1}, {x: 0, y: 1, z: 0}, {x: 0, y: -1, z: 0}, {x: 0, y: 1, z: 0}, {x: 0, y: -1, z: 0}];
const $ServerLevel = Java.loadClass("net.minecraft.server.level.ServerLevel");
const $RandomSource = Java.loadClass("net.minecraft.util.RandomSource");

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
        "kubejs:andesite_stone_infectable": "minecraft:andesite",
        "kubejs:andesite_deepslate_infectable": "kubejs:deepslate_andesite",
        "kubejs:andesite_infected": "minecraft:andesite",
        "chipped:andesite": "actuallyadditions:black_quartz_ore"
    },

        /**
     * @param {Block} block
     * @param {$ServerLevel} level
     * @param {$RandomSource} random 
     */
    infectWithAndesite(block, random, level){
        let tries = 0;
        do {
            let randomPos = poses[random.nextInt(poses.length)];
            let targetPos = new BlockPos(block.pos.x + randomPos.x, block.pos.y + randomPos.y, block.pos.z + randomPos.z);
            let targetBlock = level.getBlockState(targetPos);
            let didIt = false;
            targetBlock.tags.filter(tagkey => tagkey.location().toString() in AndesiteInfection.dictionary)
            .forEach(tagkey => {
                level.setBlockAndUpdate(targetPos, AndesiteInfection.dictionary[tagkey.location()]);
                didIt = true;
            });
            if (didIt)
                break;
        } while (++tries < 6);
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
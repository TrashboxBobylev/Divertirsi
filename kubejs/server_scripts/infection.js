const $ChunkPos = Java.loadClass("net.minecraft.world.level.ChunkPos");

// make infection spawn in every chunk
NativeEvents.onEvent("net.neoforged.neoforge.event.level.ChunkEvent$Load", event => {
    let infection_pos = new BlockPos(event.chunk.pos.getMiddleBlockX(), -63, event.chunk.pos.getMiddleBlockZ());
    if (event.isNewChunk()){
        event.chunk.level.server.scheduleInTicks(10, _ => {
            event.chunk.level.setBlockAndUpdate(infection_pos, "kubejs:andesite_infection");
        });
    }
});

const AndesiteInfection = {
    /**
     * Grab some random block positions in current chunk and add it into the list
     * @param {BlockPos[]} storage 
     * @param {$ChunkPos} chunk
     * @param {number} amount 
     * @param {number} minY 
     * @param {number} maxY 
     */
    grabBlockSample(storage, chunk, amount, minY, maxY){
        for (let i = 0; i < amount; i++){
            storage.push(new BlockPos(chunk.getBlockX(Math.random() * 15), minY + Math.random() * (maxY - minY), chunk.getBlockZ(Math.random() * 15)));
        }
    },

    dictionary: {
        "minecraft:stone": {block: "minecraft:andesite", chance: 0.25},
        "minecraft:diorite": {block: "minecraft:andesite", chance: 0.25},
        "minecraft:granite": {block: "minecraft:andesite", chance: 0.25},
        "minecraft:deepslate": {block: "kubejs:deepslate_andesite", chance: 0.15},
        "kubejs:deepslate_andesite": {block: "minecraft:andesite", chance: 0.25},
        "minecraft:andesite": {block: "actuallyadditions:black_quartz_ore", chance: 0.075}
    }
};

ServerEvents.recipes(event => {
    // ensures function will run constantly
    event.recipes.custommachinery.custom_machine("kubejs:andesite_infection", 120).requireBlock(["kubejs:andesite_infection"], true, 0, 0, 0, 0, 0, 0).requireFunctionOnEnd("infect");
});

CustomMachineryEvents.recipeFunction("infect", event => {
    const currentChunk = new $ChunkPos(event.tile.blockPos);
    let world = event.tile.level;
    let infectPositions = [];
    AndesiteInfection.grabBlockSample(infectPositions, currentChunk, 150, -63, -50);
    AndesiteInfection.grabBlockSample(infectPositions, currentChunk, 120, -50, -24);
    AndesiteInfection.grabBlockSample(infectPositions, currentChunk, 100, -24, 0);
    AndesiteInfection.grabBlockSample(infectPositions, currentChunk, 80, 0, 64);
    AndesiteInfection.grabBlockSample(infectPositions, currentChunk, 55, 64, 128);

    for (let blockPos of infectPositions){
        let block = world.getBlockState(blockPos);
        if (!block.air && block.id in AndesiteInfection.dictionary && Math.random() < AndesiteInfection.dictionary[block.id].chance){
            world.setBlockAndUpdate(blockPos, AndesiteInfection.dictionary[block.id].block);
        }
    }

    event.success();
});
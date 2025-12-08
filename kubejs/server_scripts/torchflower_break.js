BlockEvents.broken(event => {
    if (event.level.getBlock(event.block.pos.above()).id == $ResourceLocation.parse("kubejs:torchflower")){
        event.level.destroyBlock(event.block.pos.above(), true);
    }
});
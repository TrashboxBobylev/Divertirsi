/** @type {typeof import("net.minecraft.world.item.Items").$Items } */
let $Items  = Java.loadClass("net.minecraft.world.item.Items")
/** @type {typeof import("net.minecraft.world.item.Item").$Item } */
let $Item  = Java.loadClass("net.minecraft.world.item.Item")
let $MapColor  = Java.loadClass("net.minecraft.world.level.material.MapColor");
let $PushReaction  = Java.loadClass("net.minecraft.world.level.material.PushReaction");
let $BlockBehaviour$OffsetType  = Java.loadClass("net.minecraft.world.level.block.state.BlockBehaviour$OffsetType");
let $SoundType  = Java.loadClass("net.minecraft.world.level.block.SoundType");
let $BlockBehaviour$Properties  = Java.loadClass("net.minecraft.world.level.block.state.BlockBehaviour$Properties");
let $DeadBushBlock = Java.loadClass("net.minecraft.world.level.block.DeadBushBlock");

StartupEvents.registry("block", event => {
    event.create("torchflower")
        .soundType("grass")
        .noCollision()
        .hardness(0)
        .lightLevel(15)
        .box(5.0, 0.0, 5.0, 11.0, 10.0, 11.0)
        .fullBlock(false)
        .mapColor($MapColor.GRASS)
        .renderType("cutout")
        .notSolid()
        .transparent(true)
        .copyPropertiesFrom(Blocks.TORCHFLOWER)
        .displayName({"translate": "block.minecraft.torchflower"})
});

BlockEvents.modification(event => {
    event.modify("minecraft:torchflower", block => {
        block.lightEmission = 15;
    });
    event.modify("minecraft:potted_torchflower", block => {
        block.lightEmission = 15;
    });
    event.modify("kubejs:torchflower", block => {
        block.lightEmission = 15;
    });
});
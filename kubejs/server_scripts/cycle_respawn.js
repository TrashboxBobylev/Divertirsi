const $Level = Java.loadClass("net.minecraft.world.level.Level");

NativeEvents.onEvent("net.neoforged.neoforge.event.entity.player.PlayerRespawnPositionEvent", event => {
    if (!event.copyOriginalSpawnPosition() && event.entity.respawnDimension.path == $Level.OVERWORLD.path){
        let originalTransition = event.originalDimensionTransition;
        let _anchor_pos = event.entity.persistentData.get("anchor_pos");
        let anchor_pos = {x: anchor_pos.getDouble("x"), y: anchor_pos.getDouble("y"), z: anchor_pos.getDouble("z")};
        event.setDimensionTransition({newLevel: event.entity.level, pos: new Vec3d(anchor_pos.x, anchor_pos.y, anchor_pos.z), speed: originalTransition.speed, yRot: originalTransition.yRot, xRot: originalTransition.xRot, missingRespawnBlock: !event.copyOriginalSpawnPosition, postDimensionTransition: entity => {}});
        event.setCopyOriginalSpawnPosition(true);
        event.entity.server.runCommandSilent(`execute in minecraft:overworld run spawnpoint ${event.entity.username} ${Math.round(anchor_pos.x)} ${Math.round(anchor_pos.y)} ${Math.round(anchor_pos.z)}`);
    }
});
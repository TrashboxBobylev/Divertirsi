/**
    @returns {integer} Amount of seconds each cycle lasts
*/
function max_cycle_duration(){
    return 20;
}

function new_base_deny_radius(){
    return 2000;
}

const $TeamManager = Java.loadClass("dev.ftb.mods.ftbteams.api.TeamManager");
const $TeamAPI = Java.loadClass("dev.ftb.mods.ftbteams.api.FTBTeamsAPI");
const $MinecraftServer = Java.loadClass("net.minecraft.server.MinecraftServer");
const $ListTag = Java.loadClass("net.minecraft.nbt.ListTag");
const $Tag = Java.loadClass("net.minecraft.nbt.Tag");
const $ObjectiveCriteria = Java.loadClass("net.minecraft.world.scores.criteria.ObjectiveCriteria");

PlayerEvents.tick(event => {
    let cycle_bar = event.player.name.getString().toLowerCase() + "_cycle";
    if (!event.player.persistentData.getBoolean("first_time") || !event.player.stages.has("cycle_stops")){
        event.player.persistentData.putBoolean("first_time", true);
        // reset the cycle
        if (BossBarUtils.get(cycle_bar) == null){
            BossBarUtils.create(cycle_bar, "Fun Time", event.player);
            BossBarUtils.setVisible(cycle_bar, true);
            BossBarUtils.setColor(cycle_bar, "blue");
            BossBarUtils.setMax(cycle_bar, max_cycle_duration());
            BossBarUtils.setStyle(cycle_bar, "progress");
            BossBarUtils.setValue(cycle_bar, max_cycle_duration());
            BossBarUtils.addPlayer(cycle_bar, event.player);
            event.player.persistentData.putInt("cycle_time", 0);
            event.player.scoreboard.addObjective("cycle", $ObjectiveCriteria.DUMMY, Component.white("Cycles survived"), 'integer', true, null);
        // continue the cycle
        }
    }
    
    if (!event.player.stages.has("cycle_stops") && event.player.tickCount % 20 == 0) {
        let cycle_time = event.player.persistentData.getInt("cycle_time");
        cycle_time++;
        event.player.persistentData.putInt("cycle_time", cycle_time);
        BossBarUtils.setValue(cycle_bar, max_cycle_duration() - cycle_time);
        if (cycle_time == max_cycle_duration()){
            event.server.tell("The time is up!");
            event.player.stages.add("cycle_stops");
            BossBarUtils.setVisible(cycle_bar, false);
            let lvl = event.player.getLevel();
            for (let x = -2; x <= 2; x++){
                for (let y = -2; y <= 2; y++){
                    for (let z = -2; z <= 2; z++){
                        lvl.setBlock(new BlockPos(event.player.x + x, event.player.y + y, event.player.z + z), Blocks.BEDROCK.defaultBlockState(), 3);
                    }
                }
            }
            let base_pos = NBT.toTag({x: Math.round(event.player.x), y: Math.round(event.player.y), z: Math.round(event.player.z)});
            let base_array = [];
            if (event.player.persistentData.contains("past_base_coords")){
                let _base_array = event.player.persistentData.getList("past_base_coords", $Tag.TAG_COMPOUND).toArray();
                for (let base of _base_array){
                    base_array.push(base);
                }
            }
            base_array.push(base_pos);
            event.player.persistentData.put("past_base_coords", NBT.listTag(base_array));
            event.server.scheduleInTicks(20, _ => {
                let result_x, result_y, result_z;
                if (event.player.persistentData.get("base_pos") == null){
                    let teamchecker = $TeamAPI.api().getManager();
                    let player_team = teamchecker.getTeamForPlayer(event.player);
                    let id;
                    if (player_team.isPresent()){
                        id = player_team.get().getId();
                    } else {
                        id = event.player.uuid;
                    }
                    result_x = 2000 + id.getLeastSignificantBits() % 10000000;
                    result_z = 2000 + id.getMostSignificantBits() % 10000000;
                    result_y = 128;
                    event.player.getPersistentData()['putIntArray(java.lang.String,int[])']("base_pos", [result_x, result_y, result_z]);
                } else {
                    let pos = event.player.persistentData.getIntArray("base_pos");
                    result_x = pos[0]; result_y = pos[1]; result_z = pos[2];
                }
                
                event.player['teleportTo(net.minecraft.server.level.ServerLevel,double,double,double,float,float)'](event.server.getLevel("minecraft:the_end"), result_x, result_y, result_z, 0, 0);
                event.server.runCommandSilent(`execute as ${event.player.name.getString()} run effect give @s jump_boost 3 255 true`);
                event.server.scheduleInTicks(event.player.persistentData.getBoolean("built_spaceship") ? 2 : 20, _ => {
                    let pos = event.player.persistentData.getIntArray("base_pos");
                    result_x = pos[0]; result_y = pos[1]; result_z = pos[2];
                    if (!event.player.persistentData.getBoolean("built_spaceship")){
                        event.server.runCommandSilent("execute in minecraft:the_end run place template kubejs:spaceship " + result_x + " " + result_y + " " + result_z);
                        event.player.persistentData.putBoolean("built_spaceship", true);
                    }
                    event.server.runCommandSilent(`execute in minecraft:the_end run teleport ${event.player.name.getString()} ${result_x+11} ${result_y+2} ${result_z+8} 0 0`);
                    event.player.stages.add("spaceship");
                });
                let score = event.player.scoreboard.getOrCreatePlayerScore(event.player, event.player.scoreboard.getObjective("cycle"));
                score.increment();
                event.player.scoreboard.setDisplayObjective("sidebar", event.player.scoreboard.getObjective("cycle"));
            });
        }
    }
});

/**
 * @param {$ServerPlayer_} player
 * @param {integer} amount 
 * @param {function($ServerPlayer_, integer)} process_callback
 * @param {function($ServerPlayer_)} succeed_callback 
 */
function countDown(player, amount, process_callback, succeed_callback){
    if (amount > 0){
        process_callback(player, amount);
        player.server.scheduleInTicks(20, _ => {
            countDown(player, amount-1, process_callback, succeed_callback);
        })
    } else {
        succeed_callback(player);
    }
}

const rngBounds = {
    minX: -100000,
    maxX: 100000,
    minZ: -100000,
    maxZ: 100000
};

/**
 * Randomly picks a point in 3D space that doesn't touch existing points
 * @param {Array} existingPoints - Array of existing 3D points as [x, z] arrays
 * @param {number} radius - Radius of the exclusion sphere around each point
 * @returns {Array|null} A valid [x, z] point or null if no valid point found
 */
function findRandomPointAwayFromPoints(existingPoints, radius) {

    const maxAttempts = 1000;

    const { minX, maxX, minZ, maxZ } = rngBounds;
    
    // Helper function to calculate squared distance between two points
    function squaredDistance(point1, point2) {
        const dx = point1.x - point2.x;
        const dz = point1.z - point2.z;
        return dx * dx + dz * dz;
    }

    let centerX = 0, centerZ = 0;
    for (const point of existingPoints){
        centerX += point.x;
        centerZ += point.z;
    }
    centerX /= existingPoints.length;
    centerZ /= existingPoints.length;
    
    // Helper function to check if a point is valid (doesn't touch any existing points)
    function isValidPoint(point) {
        const minDistanceSquared = radius * radius;
        const maxDistanceSquared = minDistanceSquared*5
        
        for (const existingPoint of existingPoints) {
            if (squaredDistance(point, existingPoint) <= minDistanceSquared) {
                return false;
            }
            if (squaredDistance(point, {x: centerX, z: centerZ}) > maxDistanceSquared){
                return false;
            }
        }
        return true;
    }
    
    // Try to find a valid point
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        // Generate random point within bounds
        let randomPoint = {
            x: minX + Math.random() * (maxX - minX),
            z: minZ + Math.random() * (maxZ - minZ)
        };
        
        // Check if this point is valid
        if (isValidPoint(randomPoint)) {
            return randomPoint;
        }
    }
    
    // If no valid point found after max attempts
    console.warn(`No valid point found after ${maxAttempts} attempts. Consider increasing bounds or decreasing radius.`);
    return null;
}

FTBQuestsEvents.completed("4A779A20378515FF", event => {
    event.player.stages.remove("spaceship");
    countDown(event.player, 10, (player, amount) => {
        player.server.runCommandSilent(`title ${player.name.getString()} clear`);
        player.server.runCommandSilent(`title ${player.name.getString()} title {"text": "Leaving in ${amount}."}`);
    }, player => {
        player.server.runCommandSilent(`title ${player.name.getString()} clear`);
        let pointFound = false;
        let _base_array = player.persistentData.getList("past_base_coords", $Tag.TAG_COMPOUND).toArray();
        let base_array = []
        for (let point of _base_array){
            base_array.push({x: point.getInt("x"), z: point.getInt("z")});
        }
        let world = player.server.getLevel("minecraft:overworld");
        let respawn_point = {};
        let cycle_bar = player.name.getString().toLowerCase() + "_cycle";
        do {
            let point = findRandomPointAwayFromPoints(base_array, new_base_deny_radius());
            if (point == null){
                continue;
            }
            pointFound = true;
            respawn_point = new BlockPos(point.x, 256, point.z);
        } while (!pointFound);
        player['teleportTo(net.minecraft.server.level.ServerLevel,double,double,double,float,float)'](world, respawn_point.x, respawn_point.y, respawn_point.z, 0, 0);
        player.server.runCommandSilent(`execute as ${player.name.getString()} run effect give @s resistance 5 255 true`);
        player.server.scheduleInTicks(10, _ => {
            player.server.runCommandSilent(`execute in minecraft:overworld run spawnpoint ${player.username} ${Math.round(respawn_point.x)} ${Math.round(player.y)} ${Math.round(respawn_point.z)}`);
            player.stages.remove("cycle_stops");
            player.persistentData.putInt("cycle_time", 0);
            BossBarUtils.setVisible(cycle_bar, true);
        });
    });
});
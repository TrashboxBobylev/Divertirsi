/**
    @returns {integer} Amount of seconds each cycle lasts
*/
function max_cycle_duration(){
    return 8;
}

const $TeamManager = Java.loadClass("dev.ftb.mods.ftbteams.api.TeamManager");
const $TeamAPI = Java.loadClass("dev.ftb.mods.ftbteams.api.FTBTeamsAPI");

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
                event.server.scheduleInTicks(20, _ => {
                    let pos = event.player.persistentData.getIntArray("base_pos");
                    result_x = pos[0]; result_y = pos[1]; result_z = pos[2];
                    if (!event.player.persistentData.getBoolean("built_spaceship")){
                        event.server.runCommandSilent("execute in minecraft:the_end run place template kubejs:spaceship " + result_x + " " + result_y + " " + result_z);
                        event.player.persistentData.putBoolean("built_spaceship", true);
                    }
                    event.server.runCommandSilent(`execute in minecraft:the_end run teleport ${event.player.name.getString()} ${result_x+11} ${result_y+2} ${result_z+8} 0 0`);
                    event.server.runCommandSilent(`execute as ${event.player.name.getString()} run effect give @s jump_boost 1 255 true`);
                });
            });
        }
    }
});
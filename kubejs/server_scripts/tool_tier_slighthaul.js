ServerEvents.tags("block", event => {
    for (let tag of ["c:ores_in_ground/deepslate", "chipped:deepslate", "c:cobblestones/deepslate"]){
        for (let block of event.get(tag).getObjectIds()){
            event.remove("minecraft:needs_iron_tool", block);
            event.add("minecraft:needs_diamond_tool", block);
        }
    }

    for (let tag of ["c:ores_in_ground/deepslate", "chipped:deepslate", "c:cobblestones/deepslate"]){
        for (let block of event.get(tag).getObjectIds()){
            event.remove("minecraft:needs_iron_tool", block);
            event.add("minecraft:needs_diamond_tool", block);
        }
    }

    let steel = event.get("immersiveengineering:incorrect_for_steel_tool");
    steel.removeAll();
    steel.add("minecraft:incorrect_for_diamond_tool");

    for (let tag of ["c:obsidians", "chipped:obsidian", "chipped:crying_obsidian", "c:storage_blocks/obsidian"]){
        for (let block of event.get(tag).getObjectIds()){
            event.remove("minecraft:needs_diamond_tool", block);
            event.add("minecraft:needs_netherite_tool", block);
        }
    }
});
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

ServerEvents.recipes(event => {
    event.replaceInput(/minecraft:diamond_.*/, "minecraft:diamond", "actuallyadditions:diamatine_crystal");
    event.replaceInput(/minecraft:diamond_.*/, "#c:rods/wooden", "extendedcrafting:basic_component");
    event.forEachRecipe(/minecraft:netherite_.*_smithing/, recipe => {
        let matching = /netherite_((?!upgrade_smithing_template$).*)/.exec(recipe.originalRecipeResult.idLocation.path);
        console.log(matching);
        if (matching != null){
            let item_type = matching[1];
            let final_input_item = "";
            for (let armor_type of ["helmet", "chestplate", "leggings", "boots"]){
                if (item_type.includes(armor_type)){
                    final_input_item = `immersiveengineering:armor_steel_${item_type}`;
                    break;
                }
            }
            if (final_input_item.length == 0){
                final_input_item = `immersiveengineering:${item_type}_steel`;
            }
            recipe.replaceInput(/minecraft:diamond_.*/, Item.of(final_input_item));
        }
    });
});
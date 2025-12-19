function solar_formula_tier(tier){
    return Math.round(20 * Math.pow(5, tier - 1));
}

function solar_durability(tier){
    return Math.round((20 * 60 * 20)*Math.pow(0.825, tier - 1));
}

ServerEvents.generateData("before_mods", event => {
    for (let i = 1; i <= global.solar_panel_tiers; i++){
        event.json(`custommachinery:machine/solar_${i}.json`, {
            name: `item.energizedpower.solar_panel_${i}`,
            appearance: {
                "custommachinery:block": `energizedpower:solar_panel_${i}`,
                "custommachinery:color": 5592575,
                "custommachinery:hardness": 5.644737,
                "custommachinery:item": `energizedpower:solar_panel_${i}`,
                "custommachinery:shape": {
                    down:  [0.0, 0.0, 0.0, 1.0, 0.25, 1.0],
                    up:    [0.0, 0.0, 0.0, 1.0, 0.25, 1.0],
                    north: [0.0, 0.0, 0.0, 1.0, 0.25, 1.0],
                    south: [0.0, 0.0, 0.0, 1.0, 0.25, 1.0],
                    west:  [0.0, 0.0, 0.0, 1.0, 0.25, 1.0],
                    east:  [0.0, 0.0, 0.0, 1.0, 0.25, 1.0]
                }
            },
            components: [
                {
                    type: "custommachinery:energy",
                    config: {
                        TOP: "OUTPUT",
                        BOTTOM: "OUTPUT",
                        FRONT: "OUTPUT",
                        RIGHT: "OUTPUT",
                        BACK: "OUTPUT",
                        LEFT: "OUTPUT"
                    },
                    capacity: 20 * solar_formula_tier(i),
                    max_input: 0,
                    max_output: solar_formula_tier(i)*10
                },
                {
                    type: "custommachinery:item_energy",
                    config: {
                        TOP: "BOTH",
                        BOTTOM: "BOTH",
                        FRONT: "BOTH",
                        RIGHT: "BOTH",
                        BACK: "BOTH",
                        LEFT: "BOTH",
                        input: false,
                        output: true
                    },
                    id: "recharge",
                    mode: "output",
                    capacity: 1
                }
            ],
            gui: [
                {
                    type: "custommachinery:background",
                    width: 224,
                    height: 182
                },
                {
                    type: "custommachinery:bar",
                    orientation: "RIGHT",
                    id: "durability",
                    x: 81,
                    y: 25,
                    width: 69,
                    height: 14,
                    max: solar_durability(i)
                },
                {
                    type: "custommachinery:energy",
                    x: 107,
                    y: 59,
                    height: 16
                },
                {
                    type: "custommachinery:player_inventory",
                    x: 35,
                    y: 99
                },
                {
                    type: "custommachinery:slot",
                    id: "recharge",
                    x: 107,
                    y: 78,
                    ghost: {
                        items: {item: "actuallyadditions:single_battery"},
                        color: {alpha: 0.49803922},
                        always_render: true
                    }
                },
                {
                    type: "custommachinery:status",
                    texture_running: {"texture": "minecraft:textures/block/sunflower_front.png"},
                    x: 108,
                    y: 41,
                    texture_idle: {texture: "minecraft:textures/block/wither_rose.png"},
                    texture_errored: {texture: "minecraft:textures/block/wither_rose.png"}
                }
            ],
            jei: [
                {
                    type: "custommachinery:energy",
                    x: 107,
                    y: 59,
                    height: 16
                }
            ]
        });
    }
});

ServerEvents.recipes(event => {
    for (let i = 1; i <= global.solar_panel_tiers; i++){
        let recipe = event.recipes.custommachinery.custom_machine(`custommachinery:solar_${i}`, 10);
        recipe.requireTime("(, 12000]");
        recipe.requireWeatherOnMachine("clear");
        recipe.mustSeeSky();
        recipe.produceEnergyPerTick(solar_formula_tier(i));
        recipe.requireFunctionToStart("solar_init");
        recipe.requireFunctionEachTick("solar_decay");
        recipe.info(info => {
            info.texture("minecraft:textures/block/cracked_stone_bricks.png");
            info.tooltip(Text.translate("modpack.info.solar_decay", (solar_durability(i) / 20 / 60).toFixed(1)));
        });
        console.log(`Total power of solar panel ${1}: ${solar_durability(i)*solar_formula_tier(i)}.`);
    }
});

CustomMachineryEvents.recipeFunction("solar_init", event => {
    if (!event.machine.data.contains("init") || event.machine.data.getBoolean("init") == false){
        event.machine.data.putBoolean("init", true);
        event.machine.data.putInt("durability", solar_durability(Number.parseInt(/custommachinery:solar_(\d)/.exec(event.machine.id)[1])));
    }
});

CustomMachineryEvents.recipeFunction("solar_decay", event => {
    if (event.machine.data.getInt("durability") > 0){
        event.machine.data.putInt("durability", event.machine.data.getInt("durability") - 1);
    } else {
        event.block.set("minecraft:polished_tuff_slab");
        event.success();
    }
});

ItemEvents.modifyTooltips(event => {
    for (let i = 1; i <= global.solar_panel_tiers; i++){
        event.add(`kubejs:solar_panel_${i}`, [Text.translate("modpack.info.solar_generation.power", solar_formula_tier(i).toString())]);
        event.add(`kubejs:solar_panel_${i}`, [Text.translate("modpack.info.solar_generation.life", (solar_durability(i) / 20 / 60).toFixed(1))]);
    }
});

LootJS.lootTables(event => {
    for (let i = 1; i <= global.solar_panel_tiers; i++){
        event.getBlockTable(`kubejs:solar_panel_${i}`).clear();
    }
});
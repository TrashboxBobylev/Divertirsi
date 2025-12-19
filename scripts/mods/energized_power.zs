import crafttweaker.api.entity.attribute.AttributeModifier;
import crafttweaker.api.data.IData;
import crafttweaker.api.data.MapData;
import crafttweaker.api.item.component.Tool;
import crafttweaker.api.item.component.ToolRule;
import crafttweaker.api.item.IItemStack;
import crafttweaker.api.item.ItemDefinition;
import crafttweaker.api.resource.ResourceLocation;
import crafttweaker.api.tag.MCTag;

craftingTable.remove(<item:energizedpower:basic_machine_frame>);
craftingTable.addShaped("ep_frame_1", <item:energizedpower:basic_machine_frame>*3, [
    [<tag:item:c:storage_blocks/copper>, <tag:item:c:silicon>, <tag:item:c:storage_blocks/copper>],
    [<tag:item:c:silicon>, <tag:item:minecraft:decorated_pot_sherds>, <tag:item:c:silicon>],
    [<tag:item:c:storage_blocks/copper>, <tag:item:c:silicon>, <tag:item:c:storage_blocks/copper>]
]);

craftingTable.remove(<item:energizedpower:fast_item_conveyor_belt>);
var belt_material = <item:minecraft:dried_kelp> | <tag:item:c:leathers>;
craftingTable.addShaped("ep_belt", <item:energizedpower:fast_item_conveyor_belt>*12, [
    [belt_material, belt_material, belt_material],
    [<tag:item:c:plates/iron>, <tag:item:c:dusts/redstone>, <tag:item:c:plates/iron>]
]);

craftingTable.remove(<item:energizedpower:fast_item_conveyor_belt_loader>);
craftingTable.addShaped("ep_belt_loader", <item:energizedpower:fast_item_conveyor_belt_loader> * 3, [
    [<tag:item:chipped:bricks>, <tag:item:c:silicon>, <tag:item:chipped:bricks>],
    [<tag:item:c:silicon>, <item:minecraft:hopper>, <tag:item:c:silicon>],
    [<tag:item:chipped:bricks>, <tag:item:c:silicon>, <tag:item:chipped:bricks>]
]);

for item in [
    <item:energizedpower:fast_item_conveyor_belt_sorter>,
    <item:energizedpower:fast_item_conveyor_belt_switch>,
    <item:energizedpower:fast_item_conveyor_belt_splitter>,
    <item:energizedpower:fast_item_conveyor_belt_merger>
    ] {
        craftingTable.remove(item);
        stoneCutter.addRecipe(item.registryName.path + "_stonecutter", item, <item:energizedpower:fast_item_conveyor_belt_loader>);
}

// make hammers actual tools

public class hammer_data {
    public val blocks as MCTag;
    public val speed as float;
    public val attack_damage as float;
    public val attack_speed as float;

    public this(blocks as MCTag, speed as float, attack_damage as float, attack_speed as float){
        this.blocks = blocks;
        this.speed = speed;
        this.attack_damage = attack_damage;
        this.attack_speed = attack_speed;
    }
}

val hammer_values = {
    <item:energizedpower:stone_hammer>: new hammer_data(<tag:block:minecraft:incorrect_for_stone_tool>, <constant:minecraft:item/tiers:stone>.speed, 10, 0.65f),
    <item:energizedpower:iron_hammer>: new hammer_data(<tag:block:minecraft:incorrect_for_iron_tool>, <constant:minecraft:item/tiers:iron>.speed, 10, 0.75f),
    <item:energizedpower:golden_hammer>: new hammer_data(<tag:block:minecraft:incorrect_for_gold_tool>, <constant:minecraft:item/tiers:gold>.speed, 9, 0.65f),
    <item:kubejs:steel_hammer>: new hammer_data(<tag:block:immersiveengineering:incorrect_for_diamond_tool>, 7.0f, 11, 0.75),
    <item:energizedpower:diamond_hammer>: new hammer_data(<tag:block:minecraft:incorrect_for_netherite_tool>, <constant:minecraft:item/tiers:diamond>.speed, 10, 0.85f),
    <item:energizedpower:netherite_hammer>: new hammer_data(<tag:block:minecraft:incorrect_for_netherite_tool>, <constant:minecraft:item/tiers:netherite>.speed, 11, 0.9f)
} as hammer_data[IItemStack];

for item, data in hammer_values {
    item.definition.tool = Tool.of([ToolRule.deniesDrops(data.blocks), ToolRule.minesAndDrops(<tag:block:modpack:mineable/hammer>, data.speed*1.5f), ToolRule.minesAndDrops(<tag:block:minecraft:mineable/pickaxe>, data.speed/2)], 1.0f, 1);
    item.definition.addAttributeModifier(<attribute:minecraft:generic.attack_speed>, AttributeModifier.create(<resource:minecraft:base_attack_speed>, -(4 - data.attack_speed), <constant:minecraft:attribute/operation:add_value>), <constant:minecraft:equipmentslot/group:mainhand>);
    item.definition.addAttributeModifier(<attribute:minecraft:generic.attack_damage>, AttributeModifier.create(<resource:minecraft:base_attack_damage>, data.attack_damage - 1, <constant:minecraft:attribute/operation:add_value>), <constant:minecraft:equipmentslot/group:mainhand>);
}

<tag:item:minecraft:enchantable/mining>.add(<tag:item:c:tools/hammers>);
<tag:item:minecraft:enchantable/mining_loot>.add(<tag:item:c:tools/hammers>);
<tag:item:minecraft:enchantable/durability>.add(<tag:item:c:tools/hammers>);
<tag:item:minecraft:enchantable/sharp_weapon>.add(<tag:item:c:tools/hammers>);
<tag:item:minecraft:enchantable/vanishing>.add(<tag:item:c:tools/hammers>);

for transformer_type in ["lv_transformer", "transformer", "hv_transformer", "ehv_transformer"] {
    for connection_type in ["3_to_3", "n_to_1"]{
        craftingTable.remove(<item:energizedpower:${transformer_type}_${connection_type}>);
        stoneCutter.addRecipe(transformer_type + "_" + connection_type + "_stonecutter", <item:energizedpower:${transformer_type}_${connection_type}>, <item:energizedpower:${transformer_type}_1_to_n>);
        stoneCutter.addRecipe(transformer_type + "_" + connection_type + "_stonecutter_back", <item:energizedpower:${transformer_type}_1_to_n>, <item:energizedpower:${transformer_type}_${connection_type}>);
    }
}

// recipes for reworked solars
function item_to_ep_item(item as IItemStack) as MapData {
    return {
        "item": item.registryName
    };
}
function tag_to_ep_item(item as MCTag) as MapData {
    return {
        "tag": item.id.toString()
    };
}

<recipetype:energizedpower:alloy_furnace>.addJsonRecipe("solar_panel_smelting", {
    "type": "energizedpower:alloy_furnace",
    "inputs": [
        {
            "input": tag_to_ep_item(<tag:item:c:dusts/lapis>)
        },
        {
            "input": tag_to_ep_item(<tag:item:c:dusts/coal>)
        },
        {
            "input": tag_to_ep_item(<tag:item:c:silicon>)
        }
    ],
    "output": item_to_ep_item(<item:enderio:photovoltaic_plate>),
    "ticks": 200
});

val solar_upgrades = [
    <item:minecraft:torchflower>,
    <item:energizedpower:basic_circuit>,
    <item:oritech:processing_unit>,
    <item:actuallyadditions:empowered_restonia_crystal>,
    <item:energizedpower:advanced_circuit>,
    <item:extendedcrafting:elite_component>
];

craftingTable.addShaped("solar_1", <item:kubejs:solar_panel_1>, [
    [<item:enderio:photovoltaic_plate>, <item:enderio:photovoltaic_plate>, <item:enderio:photovoltaic_plate>],
    [<tag:item:c:plates/tin>, <item:minecraft:torchflower>, <tag:item:c:plates/tin>]
]);

for i in 1 .. 6 {
    <recipetype:energizedpower:assembling_machine>.addJsonRecipe("solar_" + (i+1) + "_assemble", {
        "type": "energizedpower:assembling_machine",
        "inputs": [
            {
                "count": 4,
                "input": item_to_ep_item(<item:kubejs:solar_panel_${i}>)
            },
            {
                "count": 2,
                "input": tag_to_ep_item(<tag:item:c:plates/silver>)
            },
            {
                "count": 1,
                "input": item_to_ep_item(solar_upgrades[i])
            }
        ],
        "output": item_to_ep_item(<item:kubejs:solar_panel_${i+1}>)
    });
}
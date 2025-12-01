import crafttweaker.api.entity.attribute.AttributeModifier;
import crafttweaker.api.item.component.Tool;
import crafttweaker.api.item.component.ToolRule;
import crafttweaker.api.item.IItemStack;
import crafttweaker.api.resource.ResourceLocation;
import crafttweaker.api.tag.MCTag;


craftingTable.remove(<item:energizedpower:basic_machine_frame>);
craftingTable.addShaped("ep_frame_1", <item:energizedpower:basic_machine_frame>, [
    [<tag:item:c:ingots/copper>, <tag:item:c:silicon>, <tag:item:c:ingots/copper>],
    [<tag:item:c:silicon>, <tag:item:minecraft:decorated_pot_sherds>, <tag:item:c:silicon>],
    [<tag:item:c:ingots/copper>, <tag:item:c:silicon>, <tag:item:c:ingots/copper>]
]);

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
    <item:kubejs:steel_hammer>: new hammer_data(<tag:block:immersiveengineering:incorrect_for_steel_tool>, 7.0f, 11, 0.75),
    <item:energizedpower:diamond_hammer>: new hammer_data(<tag:block:minecraft:incorrect_for_diamond_tool>, <constant:minecraft:item/tiers:diamond>.speed, 10, 0.85f),
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
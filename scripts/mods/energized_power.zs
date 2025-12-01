import crafttweaker.api.item.component.Tool;
import crafttweaker.api.item.component.ToolRule;
import crafttweaker.api.item.IItemStack;
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

    public this(blocks as MCTag, speed as float){
        this.blocks = blocks;
        this.speed = speed;
    }
}

val hammer_values = {
    <item:energizedpower:stone_hammer>: new hammer_data(<tag:block:minecraft:incorrect_for_stone_tool>, <constant:minecraft:item/tiers:stone>.speed),
    <item:energizedpower:iron_hammer>: new hammer_data(<tag:block:minecraft:incorrect_for_iron_tool>, <constant:minecraft:item/tiers:iron>.speed),
    <item:energizedpower:golden_hammer>: new hammer_data(<tag:block:minecraft:incorrect_for_gold_tool>, <constant:minecraft:item/tiers:gold>.speed),
    <item:energizedpower:diamond_hammer>: new hammer_data(<tag:block:minecraft:incorrect_for_diamond_tool>, <constant:minecraft:item/tiers:diamond>.speed),
    <item:energizedpower:netherite_hammer>: new hammer_data(<tag:block:minecraft:incorrect_for_netherite_tool>, <constant:minecraft:item/tiers:netherite>.speed)
} as hammer_data[IItemStack];

for item, data in hammer_values {
    item.definition.tool = Tool.of([ToolRule.deniesDrops(data.blocks), ToolRule.minesAndDrops(<tag:block:modpack:mineable/hammer>, data.speed*1.5f), ToolRule.minesAndDrops(<tag:block:minecraft:mineable/pickaxe>, data.speed/2)], 1.0f, 1);
}
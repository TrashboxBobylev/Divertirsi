craftingTable.addShapeless("bar_of_life", <item:kubejs:bar_of_life>, [
    <tag:item:c:ingots/silver>, 
    <item:minecraft:honeycomb>, <item:minecraft:honeycomb>,
    <tag:item:chipped:moss_block>, <tag:item:chipped:moss_block>,
    <tag:item:c:dusts/prismarine>, <tag:item:c:dusts/prismarine>
]);

craftingTable.remove(<item:industrialforegoing:machine_frame_pity>);
craftingTable.addShaped("if_frame_1", <item:industrialforegoing:machine_frame_pity>, [
    [<tag:item:minecraft:logs>, <item:kubejs:bar_of_life>, <tag:item:minecraft:logs>],
    [<item:kubejs:bar_of_life>, <tag:item:chipped:redstone_block>, <item:kubejs:bar_of_life>],
    [<tag:item:minecraft:logs>, <item:kubejs:bar_of_life>, <tag:item:minecraft:logs>]
]);
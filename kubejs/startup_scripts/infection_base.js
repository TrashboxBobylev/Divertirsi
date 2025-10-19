StartupEvents.registry('block', event => {
	event.create("kubejs:andesite_infection", "custommachinery").occlude();

    event.create('kubejs:deepslate_andesite')
        .soundType('deepslate')
        .hardness(3.0)
        .resistance(6.0)
        .requiresTool(true) 
        .tagBlock('minecraft:mineable/pickaxe')
        .tagBlock('minecraft:needs_iron_tool')
});
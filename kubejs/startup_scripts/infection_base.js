StartupEvents.registry('block', event => {
	event.create("kubejs:andesite_infection", "custommachinery").occlude();

    event.create('kubejs:deepslate_andesite')
        .soundType('deepslate')
        .hardness(3.0)
        .resistance(6.0)
        .requiresTool(true) 
        .tagBlock('minecraft:mineable/pickaxe')
        .tagBlock('minecraft:needs_iron_tool')

    event.create('kubejs:deepslate_black_quartz')
        .soundType('deepslate')
        .hardness(3.5)
        .resistance(6.0)
        .requiresTool(true)
        .tagBlock('minecraft:mineable/pickaxe')
        .tagBlock('minecraft:needs_iron_tool')
        .tagBlock('c:ores/black_quartz')
        .tagBlock('c:ores_in_ground/deepslate')
        .tagBlock('c:ores')
        .tagItem('c:ores')
        .tagItem('c:ores_in_ground/deepslate')
        .tagItem('c:ores/black_quartz')
});

BlockEvents.modification(event => {
    event.modify("actuallyadditions:black_quartz_ore", handler => {
        handler.randomTickCallback = (tick) => {
            
        }
    })
    event.modify("kubejs:deepslate_black_quartz", handler => {
        handler.randomTickCallback = (tick) => {
            
        }
    })
})
ServerEvents.tags("item", event => {
    for (let drill of global.drills){
        event.add("minecraft:pickaxes", drill);
        event.add("minecraft:shovels", drill);
        event.add("minecraft:axes", drill);
        event.add("minecraft:hoes", drill);
        event.add("c:tools", drill);
        event.add("c:tools/mining_tools", drill);
    }
});
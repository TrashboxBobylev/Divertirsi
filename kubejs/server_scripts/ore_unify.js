ServerEvents.highPriorityData(e => {
    function removeFeature(id) {
        let noop = {
            "type": "minecraft:no_op",
            "config": {}
        }
        e.addJson(`${id.namespace}:worldgen/configured_feature/${id.path}`, noop)
    }

    removeFeature("xycraft_world:ore_aluminum");
    removeFeature("oritech:ore_nickel");
    removeFeature("energizedpower:tin_ore");
});
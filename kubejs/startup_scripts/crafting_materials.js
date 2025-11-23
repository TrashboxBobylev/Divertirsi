StartupEvents.registry("item", event => {
    for (let item of [
        "bar_of_life"
    ]){
        event.create(item);
    }
})
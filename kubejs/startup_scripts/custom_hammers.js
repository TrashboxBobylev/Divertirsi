let $Item$Properties  = Java.loadClass("net.minecraft.world.item.Item$Properties")
let $HammerItem = Java.loadClass("me.jddev0.ep.item.HammerItem");
let $Lib = Java.loadClass("blusunrize.immersiveengineering.api.Lib");

StartupEvents.registry("item", event => {
    event.createCustom("steel_hammer", () => new $HammerItem($Lib.MATERIAL_Steel, new $Item$Properties()))
        .tag("c:tools/hammers")
        .tag("c:tools");
});
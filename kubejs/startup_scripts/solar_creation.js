global.solar_panel_tiers = 6;

StartupEvents.registry("block", event => {
    for (let i = 1; i <= global.solar_panel_tiers; i++){
        event.create(`kubejs:solar_panel_${i}`, "custommachinery:custom_machine").machine(`custommachinery:solar_${i}`);
    }
});
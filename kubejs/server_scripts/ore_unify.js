ServerEvents.tags('item', event => {
    event.remove("c:ingots/steel", "oritech:biosteel_ingot");
    event.remove("c:dust/steel", "oritech:biosteel_dust");
    event.remove("c:storage_blocks/steel", "oritech:biosteel_block");
});
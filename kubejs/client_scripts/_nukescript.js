// Applies a red tooltip to nuked items so devs or players know it shouldn't be around
ItemEvents.modifyTooltips(event => {
  if (global.nukelist.length > 0) {
    event.add(global.nukelist, Text.red('This item has been disabled'));
  }
});
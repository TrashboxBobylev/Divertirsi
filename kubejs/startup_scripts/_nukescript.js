global.nukelist = [ // List of things to be disabled and hidden from the game. You can nuke Items, Blocks, Fluids, and Entities, although the last one won't have much of an effect (it can do stuff like making cows unmilkable though, but won't disable spawning or spawn egg item)
    /minecraft:wooden_.*/,
    "industrialforegoing:block_breaker",
    "industrialforegoing:block_placer"
// I like to separate the different things by registry type, so below could be the fluid section

// I also like to sort them in alphabetical order, there's a VSCode addon for that

]


// Below are some utility functions to quickly add things in multiple wood types/colours, you could expand this to toolsets or ingot types
const vanillaWoodTypes = [
  'oak', 'spruce', 'birch', 'jungle', 'acacia', 'dark_oak',
  'mangrove', 'cherry', 'bamboo', 'crimson', 'warped'
]
// You can expand the above to include modded wood types too 

const dyeColours = [
  'white', 'orange', 'magenta', 'light_blue', 'yellow', 'lime', 'pink',
  'gray', 'light_gray', 'cyan', 'purple', 'blue', 'brown', 'green', 'red', 'black'
]


/*for (const wood of vanillaWoodTypes) {
    global.nukelist.push(`examplefurnituremod:${wood}_table`)
}*/

/*for (const colour of dyeColours) {
    global.nukelist.push(`examplefurnituremod:${colour}_coloured_thing`)
    global.nukelist.push(`examplefurnituremod:${colour}_coloured_second_thing`) 
}*/

// Below would nuke all coloured_third_thing in every colour except for blue
/*for (const colour of dyeColours) {
    if (colour !== 'blue') {
      global.nukelist.push(`examplefurnituremod:${colour}_coloured_third_thing`)
    }
}*/

// To use these item nuking scripts, type the IDs of items you want to disable in the space above. 
// Then, type 'nukelist reload', which will run these commands: (this is a custom script as well)
// /kubejs reload startup-scripts
// /reload
// /kubejs reload lang

// Can nuke Items, Blocks, Fluids, Entities
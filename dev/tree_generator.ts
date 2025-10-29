interface blockstate_provider {
    type: "simple_state_provider",
    Name: string,
    Properties: {
        [key: string] : string | boolean | number
    }
}

interface int_provider {
    type: string
}

interface tree_size {
    type: string,
    min_clipped_height: number,
    lower_size: number,
    upper_size: number,
    limit: number
}

interface two_layers_size extends tree_size {
    
}

interface three_layers_size extends tree_size {
    upper_limit: number
    middle_size: number,
}

interface decorator {
    type: string
}

interface trunk_placer {
    type: string,
    base_height: number,
    height_rand_a: number,
    height_rand_b: number
}

interface foliage_placer {
    type: string,
    radius: int_provider,
    offset: int_provider
}

interface configured_tree {
    type: 'minecraft:tree',
    config: {
        ignore_vines?: boolean,
        force_dirt?: boolean,
        dirt_provider: blockstate_provider,
        trunk_provider: blockstate_provider,
        foliage_provider: blockstate_provider,
        minimum_size: two_layers_size | three_layers_size,
        trunk_placer: trunk_placer,
        foliage_placer: foliage_placer,
        decorators: decorator[]
    }
}

interface placed_feature {
    feature: string,
    placement: placement[] 
}

interface random_selector {
    type: 'minecraft:random_selector',
    config: {
        default: string | placed_feature,
        features: {
            feature: string | placed_feature,
            chance: number
        }[]
    }
}

interface placement {
    type: string
}


import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path"
const MUTATE_TREE_CHANCE = 0.5;

let configured_trees : Map<string, configured_tree> = new Map();
for (let tree of readdirSync("data/configured_trees")){
    configured_trees.set(tree.slice(0, tree.length - 5), JSON.parse(readFileSync("data/configured_trees/" + tree, "utf8")));
}

let trunk_types : trunk_placer[] = [];
let foliage_types : foliage_placer[] = [];
let size_types : tree_size[] = [];
for (let tree of configured_trees.values()){
    if (tree.config.trunk_placer != undefined)
        trunk_types.push(tree.config.trunk_placer);
    if (tree.config.foliage_placer != undefined)
        foliage_types.push(tree.config.foliage_placer);
    if (tree.config.minimum_size != undefined)
        size_types.push(tree.config.minimum_size);
}

let generated_trees : Map<string, configured_tree> = new Map();
let new_tree_set : Map<string, random_selector> = new Map();
const total_tree_variants = trunk_types.length*foliage_types.length*size_types.length;
for (let tree_entry of configured_trees){
    let [tree_name, tree] = tree_entry;
    let new_tree_def : random_selector = {
        type: "minecraft:random_selector",
        config: {
            default: {
                feature: "minecraft:" + tree_name,
                placement: []
            },
            features: []
        }
    };
    for (let i : number = 1; i < trunk_types.length+1; i++){
        for (let k : number = 1; k < foliage_types.length+1; k++){
            for (let l : number = 1; l < size_types.length+1; l++){
                let new_tree : configured_tree = tree;
                new_tree.config.trunk_placer = trunk_types[i-1];
                new_tree.config.foliage_placer = foliage_types[k-1];
                new_tree.config.minimum_size = size_types[l-1];

                generated_trees.set(tree_name + (i*k*l), new_tree);
                new_tree_def.config.features.push({
                    chance: MUTATE_TREE_CHANCE / total_tree_variants,
                    feature: {
                        feature: "mutated_trees:" + tree_name + (i*k*l),
                        placement: []
                    }
                });
            }
        }
    }
    new_tree_set.set(tree_name, new_tree_def);
}

const base_data_path = "output/data/mutated_trees"; 

mkdirSync("output/data", {recursive: true});
mkdirSync("output/data/minecraft/worldgen/configured_feature", {recursive: true});
mkdirSync(join(base_data_path, "worldgen/configured_feature"), {recursive: true});
for (let [treeName, tree] of new_tree_set){
    writeFileSync(join("output/data/minecraft/worldgen/configured_feature", treeName + ".json"), JSON.stringify(tree, null, "    "));
}

for (let [treeName, tree] of generated_trees){
    writeFileSync(join(base_data_path, "/worldgen/configured_feature", treeName + ".json"), JSON.stringify(tree, null, "   "));
}
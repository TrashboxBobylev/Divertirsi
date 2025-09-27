function interact(event){
    if (event.npc.getDialog(0).getAvailability().isAvailable(event.player)){
        event.npc.say("l");
    }
}
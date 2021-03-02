export default class TypeInteractions {
	constructor(type, interactions){

        this.type = type
        this.interactions = this.$_filterInteractions(interactions)

        this.queue = []
	}

    $_filterInteractions(interactions){
        return _.filter(interactions, (i) => i.interactionType == this.type )
    }

    $_getQueue(){
        this.interactions.forEach((interaction) => {
            
            //first run
            this.queue.push(interaction)

            //success run
            let successInteractions = new TypeInteractions('success', interaction.action.interactions)
            this.queue = this.queue.concat(successInteractions.$_getQueue())

            //error run
            let errorInteractions = new TypeInteractions('error', interaction.action.interactions)
            this.queue = this.queue.concat(errorInteractions.$_getQueue())

        })

        return this.queue
    }
    
}
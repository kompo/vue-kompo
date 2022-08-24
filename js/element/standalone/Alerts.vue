<template>
    <transition name="alert">

        <div class="vlAlertWrapper" v-if="alerts.length" 
            :style="{'z-index': zIndex - 2 }">

            <vl-alert-plain v-for="(alert, key) in alerts"
                :message="alert.message"
                :icon="alert.icon"
                :alertclass="alert.alertClass"
                :key="key" />

        </div>
        
    </transition>
</template>

<script>
import EmitsEvents from '../mixins/EmitsEvents'

export default {
    mixins: [EmitsEvents],
    data(){
        return {
            alerts : [],
            zIndex: 2500, //higher than Modal's 2000
            initialId: 0
        }
    },
    methods:{
        close(k){
            this.alerts.splice(k)
        },
        closeById(id){ //Todelete
            var indexWithId = _.findIndex(this.alerts, (alert) => alert.id == id)
            this.alerts.splice(indexWithId)
        },
        closeOldestAlert(){
            if(!this.alerts.length) {
                return;
            }

            this.alerts.splice(0, 1)
        },
        addAlert(alert){
            this.initialId += 1
            
            this.alerts.push(Object.assign(alert, {
                id: this.initialId
            }))

            setTimeout(()=> this.closeOldestAlert(), 3000)  
        }
    },
    mounted(){
        this.$_vlOn('vlAlertShow', (alert) => {
            this.addAlert(alert)
        })
    }
}
</script>

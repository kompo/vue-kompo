<template>
    <div v-if="open" class="vlAlert" :class="alertclass">
        <div v-if="icon" :is="{template:icon}" class="mr-1"/>
        <span v-html="message"/>
        <div class="vlAlertClose" @click.stop="close()">
          <i class="icon-times cursor-pointer"></i>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            message: {type: String, required: true},
            icon: {type: String},
            alertclass: {type: String},
            index: {type: Number}
        },
        data(){
            return {
                open : true
            }
        },
        methods:{
            close(){
                this.open = false
            }
        }
    }
</script>

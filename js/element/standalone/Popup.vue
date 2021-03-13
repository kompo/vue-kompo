<template>
    <section v-if="partial" class="vlPopup">
        <div class="vlPopupClose">
          <button aria-label="Close popup" @click="closeMe">
            <i class="icon-times"></i>
          </button>
        </div>
        <component 
            v-if="partial" :is="partial" 
            :vkompo="component" />
    </section>
</template>

<script>
import HasVueComponent from '../mixins/HasVueComponent'
import EmitsEvents from '../mixins/EmitsEvents'

export default {
    mixins: [HasVueComponent, EmitsEvents],
    props: {
    },
    data(){
        return {
            component: null,
            partial: null
        }
    },
    methods: {
        closeMe(){
            this.component = null
            this.partial = null
            window.vlLastPopup = null
        },
        insertFromResponse(obj){
            this.component = obj
            this.partial = this.$_komposerTag(obj)
        },
        $_attachEvents(){
            this.$_vlOn('vlFillPopup', (response) => {
                window.vlLastPopup = response
                this.insertFromResponse(response.data)
            })
        },
        $_destroyEvents(){
            this.$_vlOff(['vlFillPopup'])
        }

    },
    created(){
        this.$_destroyEvents()
        this.$_attachEvents()
    },
    updated() {
        this.$_destroyEvents()
        this.$_attachEvents()
    }
}
</script>

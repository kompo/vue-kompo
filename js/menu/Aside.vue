<template>
    <aside 
        ref="sidebar"
        v-bind="$_menuAttributes"
        v-click-out="close">

        <transition-group
            v-if="$_hasTransition"
            :name="$_transition"
            tag="div"
            class="vlMenuElements">
            <component
                v-for="component in elements"
                :key="component.id"
                v-bind="$_attributes(component)"
            />
        </transition-group>
        <template v-else v-for="component in elements">
            <component :key="component.id" v-bind="$_attributes(component)"/>
        </template>

    </aside>
</template>

<script>
import IsMenu from './mixins/IsMenu'

export default {
    mixins: [IsMenu],
    props:{
        side: {type: String, required: true}
    },
    data(){
        return {
            open: false,
            sidebarClass: '',
            togglerKompoId: null
        }
    },
    computed: {
        $_customClassArray() { return [
            this.sidebarClass
        ] },
        $_hasTransition() {
            return !!this.$_config('transition')
        },
        $_transition() {
            return this.$_config('transition') || ''
        },
    },
    methods:{
        toggle(){

            this.sidebarClass = this.sidebarClass == '' ? 'vlOpen' : ''

            this.open = !this.open
            
            this.$kompo.vlToggleSidebarToggler(this.togglerKompoId)

            $ && $('.vl-sidebar-l').toggleClass('vlOpen') //hack for vue bug not re-rendering..
        },
        close(){
            if(!this.open)
                return 

            $ && $('.vl-sidebar-l').removeClass('vlOpen') //hack for vue bug not re-rendering..

            this.sidebarClass = ''

            this.open = false
            
            this.$kompo.vlToggleSidebarToggler(this.togglerKompoId)
        },
        $_attachCustomEvents(){
            this.$_vlOn('vlToggleSidebar'+this.side, (elKompoId) => {
                this.togglerKompoId = elKompoId
                this.toggle()
            })
            this.$_vlOn('vlEmit'+this.$_elKompoId, (eventName, eventPayload) => {

                if (eventName == 'closeSidebar') {
                    this.close()
                }
            })
        },
        $_destroyCustomEvents(){
            this.$_vlOff([
                'vlToggleSidebar'+this.side,
                'vlEmit'+this.$_elKompoId,
            ])
        },
    },
    created(){
        
    }
}
</script>
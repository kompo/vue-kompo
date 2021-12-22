<template>
    <aside 
        ref="sidebar"
        v-bind="$_menuAttributes"
        v-click-out="close">
        <template v-for="component in elements">
            <component v-bind="$_attributes(component)"/>
        </template>
        <vl-support-modal 
            :kompoid="$_elKompoId"
        />
    </aside>
</template>

<script>
import IsMobile from './mixins/IsMobile'
import IsMenu from './mixins/IsMenu'

export default {
    mixins: [IsMenu, IsMobile],
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
    },
    methods:{
        toggle(){

            this.sidebarClass = this.sidebarClass == '' ? 'vlOpen' : ''

            this.open = !this.open
            
            this.$kompo.vlToggleSidebarToggler(this.togglerKompoId)
        },
        close(){
            if(!this.open)
                return 

            this.sidebarClass = ''

            this.open = false
            
            this.$kompo.vlToggleSidebarToggler(this.togglerKompoId)
        },
        $_attachCustomEvents(){
            this.$_vlOn('vlToggleSidebar'+this.side, (elKompoId) => {
                this.togglerKompoId = elKompoId
                this.toggle()
            })
        },
        $_destroyCustomEvents(){
            this.$_vlOff([
                'vlToggleSidebar'+this.side
            ])
        },
    },
    created(){
        
    }
}
</script>
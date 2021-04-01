<template>
    <aside 
        ref="sidebar"
        :class="sidebarClass"
        v-click-out="close">
        <slot />
    </aside>
</template>

<script>
import EmitsEvents from '../element/mixins/EmitsEvents'
import HasConfig from '../element/mixins/HasConfig'
import IsMobile from './mixins/IsMobile'
import IsKomposer from '../mixins/IsKomposer'

export default {
    mixins: [HasConfig, EmitsEvents, IsMobile, IsKomposer],
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
        $_attachEvents(){
            this.$_vlOn('vlToggleSidebar'+this.side, (elKompoId) => {
                this.togglerKompoId = elKompoId
                this.toggle()
            })
        },
        $_destroyEvents(){
            this.$_vlOff([
                'vlToggleSidebar'+this.side
            ])
        }
    },
    created(){
        this.$nextTick(()=>{
            this.$_destroyEvents()
            this.$_attachEvents()
        })
    }
}
</script>
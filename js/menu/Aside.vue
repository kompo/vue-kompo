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
export default {
    mixins: [EmitsEvents],
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
            if(!window.vlMobile)
                return 

            this.sidebarClass = this.sidebarClass == '' ? 'vlOpen' : ''

            this.open = !this.open
            
            this.$kompo.vlToggleSidebarToggler(this.togglerKompoId)
        },
        close(){
            if(!window.vlMobile || !this.open)
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
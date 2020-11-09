<template>
    <div ref="toggler"
        @click.stop="toggle"
        :class="toggleClass"
        aria-label="Open menu"
        aria-expanded="false">

        <slot />
    </div>
</template>

<script>
import Element from '../element/mixins/Element'
export default {
    mixins: [Element],
    data(){
        return {
            toggleClass: ''
        }
    },
    methods:{
        toggle(){
            if(!window.vlMobile)
                return 

            this.$kompo.vlToggleSidebar(this.$_data('toggleSidebar'), this.$_elKompoId)
        },
        $_attachEvents(){
            this.$_vlOn('vlToggleSidebarToggler'+this.$_elKompoId, () => {
                this.toggleClass = this.toggleClass ? '' : 'vlOpen'
            })
        },
        $_destroyEvents(){
            this.$_vlOff([
                'vlToggleSidebarToggler'+this.$_elKompoId
            ])
        }
    }
}
</script>
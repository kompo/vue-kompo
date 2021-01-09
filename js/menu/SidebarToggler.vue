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
import IsMobile from './mixins/IsMobile'

export default {
    mixins: [Element, IsMobile],
    data(){
        return {
            toggleClass: ''
        }
    },
    methods:{
        toggle(){
            if(!this.$_isMobile())
                return 

            this.$kompo.vlToggleSidebar(this.$_config('toggleSidebar'), this.$_elKompoId)
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
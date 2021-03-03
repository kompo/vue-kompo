<template>
    <div ref="toggler"
        @click.stop="toggle"
        @mouseover="hoverToggle"
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
    computed: {
        toggleOnHover(){ return this.$_config('toggleOnHover') },
        openClass(){ 
            return this.$_classString([
                'vlOpen',
                this.$_config('openClass')
            ])
        }
    },
    methods:{
        hoverToggle(){
            if(this.toggleOnHover)
                if(!this.toggleClass)
                    this.toggle()
        },
        toggle(){
            this.$kompo.vlToggleSidebar(this.$_config('toggleSidebar'), this.$_elKompoId)
        },
        changeToggleClass(){
            this.toggleClass = this.toggleClass ? '' : this.openClass
        },
        $_attachEvents(){
            this.$_vlOn('vlToggleSidebarToggler'+this.$_elKompoId, () => {
                if(this.toggleClass && this.toggleOnHover)
                    return setTimeout(this.changeToggleClass, 1000)

                this.changeToggleClass()
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
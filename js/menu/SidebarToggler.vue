<template>
    <div ref="toggler"
        @click.stop="toggle"
        @mouseenter="hoverToggle"
        class="vlSidebarToggler"
        :class="togglerClass"
        aria-label="Open menu"
        aria-expanded="false">

        <span v-html="$_label"/>
        <div class="vlBlur"></div>
    </div>
</template>

<script>
import Element from '../form/mixins/Element'

export default {
    mixins: [Element],
    data(){
        return {
            toggleClass: '',
        }
    },
    computed: {
        toggleOnHover(){ 
            return this.$_config('toggleOnHover') && 
                !window.matchMedia('(hover: none)').matches //checks if device can hover. If not, disable toggleOnHover
        },
        openClass(){ 
            return this.$_classString([
                'vlOpen',
                this.$_config('openClass')
            ])
        },
        togglerClass(){
            return this.$_classString([
                'vlSidebarToggler',
                this.component.class,
                this.toggleClass,
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
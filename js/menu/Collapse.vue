<template>
    <div v-bind="$_attributes">

        <div 
            class="vlCollapseToggler"
            :class="togglerClass"
            @click="toggle"
            >
            
            <span v-if="!$slots.default" v-html="$_label" />
            <slot />

            <i v-if="komponents.length" class="icon-down-dir"></i>

        </div>

        <transition name="slideDown">

            <div v-show="open"
                class="vlCollapseMenu"
                :class="menuClass" >
            
                <slot name="komponents" />

                <div 
                    v-if="!$slots.komponents"
                    v-for="(col,index) in komponents"
                    :key="index">
                    <component 
                        v-bind="$_defaultLayoutAttributes(col)" />
                </div>
        
            </div>

        </transition>

    </div>
</template>

<script>
import MenuItem from './mixins/MenuItem'
import HasSubmenu from './mixins/HasSubmenu'

export default {
    mixins: [MenuItem, HasSubmenu],
    data(){
        return {
            open: false
        }
    },
    computed: {

        collapseOpen(){
            return this.$_config('expandByDefault') || (this.$_config('expandIfActive') && this.$_config('active'))
        },
        togglerClass(){
            return this.open ? '' : 'vlTogglerClosed'
        },
        menuClass(){
            return this.open ? '' : 'vlMenuClosed'
        }

    },
    methods:{
        toggle(){
            this.open = !this.open
            
            this.$_runOwnInteractions('click')
        },

    },
    created(){
        this.open = this.collapseOpen
    }
}
</script>
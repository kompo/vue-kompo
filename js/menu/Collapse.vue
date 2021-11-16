<template>
    <div v-bind="$_attributes" ref="wrapper">

        <component
            v-bind="$_menuItemHrefAttributes" 
            v-turbo-click="component.turbo"
            class="vlCollapseToggler"
            :class="togglerClass"
            @click="toggle"
            >

            <span class="flex" v-html="$_label" />

            <i v-if="komponents.length && !noCaret" class="icon-down-dir"></i>

        </component>

        <transition name="slideDown">

            <div v-show="open"
                class="vlCollapseMenu"
                :class="menuClass" >

                <div 
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
        },
        noCaret(){
            return this.$_config('noCaret')
        },
        $_customClassArray(){
            return [
                'flex-col'
            ]
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
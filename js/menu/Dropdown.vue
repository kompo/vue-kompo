<template>
    <div 
        v-bind="$_attributes" 
        ref="wrapper"
        @mouseleave="closeSubmenu"
    >

        <component
            v-bind="$_menuItemHrefAttributes" 
            v-turbo-click="component.turbo" 
            class="vlDropdownToggler"
            :class="togglerClass" 
            @click="checkClickable">
            
            <span class="flex" v-html="$_fullLabel" />

        </component>

        <transition name="slideDown">

            <div class="vlDropdownMenu"
                :class="menuClass" >
                <component 
                    v-for="(col,index) in komponents"
                    :key="index"
                    v-bind="$_defaultLayoutAttributes(col)" 
                    @click="$emit('click', col)"
                />
        
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
            open: false,
            navItemClass: ''
        }
    },
    computed: {
        $_customClassArray(){
            return [
                (this.openOnClick && !this.open) ? '' : 'vlOpenOnHover',
                this.$_config('active'),
                this.navItemClass
            ]
        },
        togglerClass(){
            return 'vlTogglerClosed'
        },
        menuClass(){
            return this.$_classString([
                'vlMenuClosed',
                this.$_config('dropdownPosition')
            ])
        },
        openOnClick(){
            return this.$_config('openOnClick')
        }

    },
    methods:{
        checkClickable(){
            if(this.openOnClick){
                this.open = true
                this.$_overwriteBladeClasses()
            }

            this.$_clickAction()
        },
        closeSubmenu(){
            if(this.openOnClick){
                this.open = false
                this.$_overwriteBladeClasses()
            }
        }
    },
    mounted(){
        if(this.$refs.wrapper.classList.contains('vl-nav-item'))
            this.navItemClass = 'vl-nav-item'
    }
}
</script>
<template>
    <div 
        v-bind="$_attributes" 
        ref="wrapper"
        @mouseleave="closeSubmenu"
    >

        <div 
            class="vlDropdownToggler"
            :class="togglerClass" 
            @click="checkClickable">
            
            <span v-if="!$slots.default" v-html="$_label" />
            <slot />

        </div>

        <transition name="slideDown">

            <div class="vlDropdownMenu"
                :class="menuClass" >
            
                <slot name="komponents" />

                <div 
                    v-if="!$slots.komponents"
                    v-for="(col,index) in komponents"
                    :key="index">
                    <component 
                        v-bind="$_defaultLayoutAttributes(col)" 
                        @click="$emit('click', col)"
                    />
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
<template>
    <div 
        :class="$_wrapperClass" 
        @mouseleave="closeSubmenu"
    >

        <component
            v-bind="$_attributes" 
            v-turbo-click="component.turbo" 
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
        }
    },
    computed: {
        $_wrapperClass() {
            return this.$_classString([
                this.$_defaultCssClass(),
                this.$_config('active'),
                (this.openOnClick && !this.open) ? '' : 'vlOpenOnHover',
            ])
        },
        
        $_customClassArray(){
            return [
                'vlDropdownToggler',
                'vlTogglerClosed',
            ]
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
    }
}
</script>
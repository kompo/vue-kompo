<template>
    <div 
        :tabindex="0"
        v-bind="$_attributes" 
        @mouseleave="closeSubmenu"
        @keyup.space="toggleForceOpen"
    >

        <component
            v-bind="$_togglerAttributes" 
            v-turbo-click="component.turbo" 
            @click="checkClickable">
            
            <span class="flex items-center" v-html="$_fullLabel" />

        </component>

        <transition name="slideDown">

            <div class="vlDropdownMenu"
                :class="menuClass" >
                <component 
                    v-for="(col,index) in elements"
                    :key="index"
                    v-on="{ ...col.on, click: () => $emit('click', col)}"
                    v-bind="$_defaultLayoutAttributes(col)" 
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
            forcedOpen: false,
        }
    },
    watch:{
        'vkompo.elements': function () {
            this.elements = { ...this.vkompo.elements }
        },
        'vkompo.label': function () {
            this.component = { ...this.component, label: this.vkompo.label }
        }
    },
    computed: {        
        $_customClassArray(){
            return [
                this.$_config('active'),
                (this.openOnClick && !this.open) ? '' : 'vlOpenOnHover',
                this.forcedOpen ? 'vlForcedOpen' : '',
            ]
        },
        togglerClass(){
            return this.$_classString([
                'vlDropdownToggler',
                'vlTogglerClosed',
                this.$_config('togglerClass'),
            ])
        },
        menuClass(){
            return this.$_classString([
                'vlMenuClosed',
                this.$_config('menuNoBorder') ? 'vlNoBorder' : '',
                this.$_config('dropdownPosition'),
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

            this.forcedOpen = false

            this.$_clickAction()
        },
        closeSubmenu(){
            if(this.openOnClick){
                this.open = false
                this.$_overwriteBladeClasses()
            }
        },
        toggleForceOpen(){
            this.forcedOpen = !this.forcedOpen
        }
    }
}
</script>
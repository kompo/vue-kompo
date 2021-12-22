<template>
    <iframe 
        v-if="!$_displayNone" 
        v-show="!$_hidden" 
        v-bind="$_attributes"
        :src="iframeSrc"
        style="width:100%"        
    />
</template>

<script>
import Other from '../mixins/Other'

export default {
    mixins: [Other],

    computed: {
        iframeSrc(){
            return this.component.src
        }
    },

    methods: {
        handleIframe(obj) {
            return; //onload="handleIframe(this)" deactivated for now

            obj.contentWindow.document.querySelector('main').style.padding = '1rem 0'; //for shadows to appear

            obj.style.height = obj.contentWindow.document.documentElement.offsetHeight + 'px'
        }
    }
}
</script>

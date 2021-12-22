<template>
    <a 
        v-html="$_label"
        v-bind="$_attributes"
        :aria-selected="activeTab"
        @click.stop="clickTabLabel"
        href="javascript:void(0)"
        role="tab"
    />
</template>

<script>
import Other from '../mixins/Other'

export default {
    mixins: [Other],
    props: {
        activeTab: { type: Boolean, required: true },
        selectedClass: { type: String, required: false },
        unselectedClass: { type: String, required: false },
        commonClass: { type: String, required: false },
        disabledClass: { type: String, required: false },
    },
    computed: {
        isDisabled(){
            return this.$_config('tabDisabled')
        },
        $_classes() {
            return this.$_classString([
                this.$_phpClasses,
                this.activeTab ? this.selectedClass : this.unselectedClass,
                this.commonClass,
                this.isDisabled ? this.disabledClass : null,
            ])
        }
    },
    methods: {
        clickTabLabel(){
            if (this.isDisabled) {
                return
            }

            this.$emit('selectTab')
        }
    }
}
</script>

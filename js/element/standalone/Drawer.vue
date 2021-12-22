<template>
    <section class="vlDrawer">
        <div class="vlPanelClose">
          <button aria-label="Close panel" @click="closeMe">
            <i class="icon-times"></i>
          </button>
        </div>
        <component 
            v-if="partial" :is="partial" 
            :vkompo="component"
            @success="refreshParent" />
    </section>
</template>

<script>
import HasVueComponent from '../mixins/HasVueComponent'

export default {
    mixins: [HasVueComponent],
    props: {
        obj: { type: Object, required: true },
        kompoid: { type: String, required: true },
        index: { type: String, required: true },
    },
    data(){
        return {
            component: null,
            partial: null
        }
    },
    methods: {
        closeMe(){
            this.$emit('close', this.index)
        },
        insertFromResponse(){
            this.component = this.obj
            this.partial = this.$_komponentTag(this.obj)
        },
        refreshParent(){
            this.$kompo.vlReloadAfterChildAction(this.kompoid)
        },
    },
    created(){
        this.insertFromResponse()
    }
}
</script>

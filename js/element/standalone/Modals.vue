<template>
    <transition name="fadeIn">
        <div class="vlMask" v-show="modals.length">
            <transition-group :name="transitionName">
                <vl-modal
                    v-for="(modal, key) in modals"
                    :key="modal.id"
                    :obj="modal.obj"
                    :kompoid="modal.kompoid"
                    :options="modal.options"
                    @close="closeLast"
                    @confirmSubmit="confirmSubmit"
                    @previous="previous"
                    @next="next"
                />
            </transition-group>
        </div>
    </transition>
</template>

<script>
import EmitsEvents from '../mixins/EmitsEvents'
import HasConfig from '../mixins/HasConfig'

export default {
    mixins: [EmitsEvents, HasConfig],
    data(){
        return {
            modals: [],
            initialId: 0,
            confirmSubmitFunction: null,
            transitionName: 'modal',
        }
    },
    computed: {
        
    },
    methods:{
        addModal(obj, kompoid, options){
            this.initialId += 1
            
            this.$nextTick(() => this.modals.push({
                id: 'k-modal-'+(Math.random() + 1).toString(36).substring(7),
                obj: obj,
                kompoid: kompoid,
                options: Object.assign(options, {
                    zIndex: 2000 + 100*this.initialId,
                }),
            }));

            this.transitionName = options.transitionName;
        },
        closeByIndex(index){
            this.modals.splice(index)
        },
        closeLast(){
            this.closeByIndex(this.modals.length-1)
            this.initialId -= 1
        },
        confirmSubmit(){
            this.confirmSubmitFunction()
        },
        previous(){
            this.closeLast()
            this.$kompo.vlGalleryPrevious()
        },
        next(){
            this.closeLast()
            this.$kompo.vlGalleryNext()

        },
        $_attachEvents(){
            this.$_vlOn('vlFillModal', (response, kompoid, options) => {
                this.confirmSubmitFunction = options.confirmFunc
                if (options.closeLastModal) {
                    this.closeLast()
                }
                this.addModal(response.data, kompoid, options)
            })
            this.$_vlOn('vlCloseLastModal', () => {
                this.closeLast()
            })
        },
        $_destroyEvents(){
            this.$_vlOff([
              'vlFillModal',
              'vlCloseLastModal'
            ])
        }
    },
    created() {
        this.$_destroyEvents()
        this.$_attachEvents()
    },
    updated() {
        this.$_destroyEvents()
        this.$_attachEvents()
    }
}
</script>

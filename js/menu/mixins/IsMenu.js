import BaseElement from '../../element/mixins/BaseElement'
import IsKomponent from '../../mixins/IsKomponent'
import HasElements from '../../form/mixins/HasElements'
import DoesAxiosRequests from '../../form/mixins/DoesAxiosRequests'
import SmartElementUpdater from '../../mixins/SmartElementUpdater'

export default {
    mixins: [BaseElement, IsKomponent, HasElements, DoesAxiosRequests, SmartElementUpdater],

    data(){
        return {
            refreshing: false,
        }
    },

    created() {
        this.$_configureEcho()
        this.$_saveLiveKomponent()
    },

	computed: {
        $_menuClass(){
            return this.$_classString([
                this.$_config('menuClass'),
                this.$_phpClasses,
                this.$_customClassArray,
            ])
        },
        $_menuAttributes(){
            return {
                ...this.$_defaultElementAttributes,
                class: this.$_menuClass,
                style: this.$_elementStyles
            }
        },
        menuUrl(){ return this.$_config('kompoRoute') },
    },

    methods: {
        triggerRefreshMenu(ajaxPayload){
            if(this.refreshing)
                return

            this.refreshing = true

            this.$_kAxios.$_refreshSelf(this.menuUrl, ajaxPayload).then(r => {

                this.handleRefreshResponse(r.data)

                this.refreshing = false
            })
        },
        handleRefreshResponse(responseData){
            // Save scroll position before update
            const scrollTop = this.$el ? this.$el.scrollTop : 0
            const scrollLeft = this.$el ? this.$el.scrollLeft : 0

            // Update component data
            this.component = responseData

            // Use smart update instead of full replacement
            this.$_smartUpdateElements(responseData.elements || [])

            // Restore scroll after render
            this.$nextTick(() => {
                if (this.$el) {
                    this.$el.scrollTop = scrollTop
                    this.$el.scrollLeft = scrollLeft
                }
            })
        },
        $_attachEvents(){
            this.$_deliverKompoInfoOn()

            this.$_vlOn('vlRefreshKomponent'+this.$_elKompoId, (responseData) => {
                this.handleRefreshResponse(responseData)
            })

            this.$_vlOn('vlReloadAfterChildAction'+this.$_elKompoId, (ajaxPayload) => {
                this.triggerRefreshMenu(ajaxPayload)
            })

            this.$_vlOn('vlUpdateElements'+this.$_elKompoId, (elementUpdates, transition) => {
                this.$_updateElementsById(elementUpdates, transition)
            })
        },
        $_destroyEvents(){
            this.$_vlOff([
                this.$_deliverKompoInfoOff,
                'vlRefreshKomponent'+this.$_elKompoId,
                'vlReloadAfterChildAction'+this.$_elKompoId,
                'vlUpdateElements'+this.$_elKompoId,
            ])
        },
        $_updateElementsById(updates, transition) {
            Object.keys(updates).forEach(id => {
                const index = this.elements.findIndex(el => el.id === id)
                if (index !== -1) {
                    // Apply transition config to element if provided
                    const element = updates[id]
                    if (transition && element.config) {
                        element.config.transition = transition
                    }
                    this.$set(this.elements, index, element)
                }
            })
        },
    }
}
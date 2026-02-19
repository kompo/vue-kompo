// vue-kompo/js/form/mixins/HasHybridFilter.js

/**
 * Field mixin for hybrid filtering capability
 * Applied to Input fields that trigger hybrid filtering
 *
 * Methods are called from Field.js $_inputAction() instead of via watcher
 */
export default {
    computed: {
        $_hybridFilterConfig() {
            return this.$_config('hybridFilter')
        },
        $_jsInstantFilterConfig() {
            return this.$_config('jsInstantFilter')
        },
        $_hasHybridFilter() {
            return !!(this.$_hybridFilterConfig || this.$_jsInstantFilterConfig)
        },
    },

    methods: {
        $_doHybridFilter(value) {
            const config = this.$_hybridFilterConfig
            if (!config) return

            // Use kompoid as fallback when config.queryId is null (parent Query's ID)
            const queryId = config.queryId || this.kompoid
            if (!queryId) return

            const debounce = config.debounce || 300
            const attribute = config.attribute || 'data-filter'
            const mode = config.mode || 'hybrid'
            const name = config.name || null

            // Emit to target query
            if (Array.isArray(queryId)) {
                queryId.forEach(id => {
                    this.$kompo.vlHybridFilter(id, value, debounce, attribute, mode, name)
                })
            } else {
                this.$kompo.vlHybridFilter(queryId, value, debounce, attribute, mode, name)
            }
        },
        $_doJsInstantFilter(value) {
            const config = this.$_jsInstantFilterConfig
            if (!config) return

            // Use kompoid as fallback when config.queryId is null (parent Query's ID)
            const queryId = config.queryId || this.kompoid
            if (!queryId) return

            const attribute = config.attribute || 'data-filter'

            // Emit instant filter (no debounce, no server sync)
            this.$kompo.vlJsInstantFilter(queryId, value, attribute)
        },
    },
}

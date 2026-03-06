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

            // Collect non-pristine sibling field values from parent form context
            const siblingData = this.$_collectDirtySiblingData()

            // Emit to target query (may target multiple queries)
            if (Array.isArray(queryId)) {
                queryId.forEach(id => {
                    this.$kompo.vlHybridFilter(id, value, debounce, attribute, mode, name, siblingData)
                })
            } else {
                this.$kompo.vlHybridFilter(queryId, value, debounce, attribute, mode, name, siblingData)
            }
        },

        /**
         * Walk up $parent chain to find nearest Form/Query ancestor,
         * then collect only non-pristine (dirty) sibling field values
         * using the existing $_fillRecursive system with onlyDirty option.
         */
        $_collectDirtySiblingData() {
            let parent = this.$parent
            while (parent) {
                if (typeof parent.$_fillRecursive === 'function') {
                    const data = {}
                    parent.$_fillRecursive(data, { onlyDirty: true })
                    return data
                }
                parent = parent.$parent
            }
            return {}
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

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

            // Emit to target query (may target multiple queries)
            if (Array.isArray(queryId)) {
                queryId.forEach(id => {
                    const targetsOwnQuery = this.$_targetsOwnQuery(id)
                    const siblingData = this.$_collectDirtySiblingData(id)
                    const filterName = targetsOwnQuery ? null : name
                    const activeFilterData = targetsOwnQuery ? {} : this.$_currentHybridFilterData()
                    this.$kompo.vlHybridFilter(id, value, debounce, attribute, mode, filterName, siblingData, activeFilterData)
                })
            } else {
                const targetsOwnQuery = this.$_targetsOwnQuery(queryId)
                const siblingData = this.$_collectDirtySiblingData(queryId)
                const filterName = targetsOwnQuery ? null : name
                const activeFilterData = targetsOwnQuery ? {} : this.$_currentHybridFilterData()
                this.$kompo.vlHybridFilter(queryId, value, debounce, attribute, mode, filterName, siblingData, activeFilterData)
            }
        },

        /**
         * Same-query filters are already collected by the target Query before
         * browsing. For cross-query filters, collect dirty values from the
         * nearest owning Form/Query so filters outside the literal layout
         * sibling group still travel with the request.
         */
        $_collectDirtySiblingData(targetQueryId = null) {
            if (this.$_targetsOwnQuery(targetQueryId)) {
                return {}
            }

            const parent = this.$_hybridFilterDataParent()
            if (!parent || typeof parent.$_fillRecursive !== 'function') {
                return {}
            }

            const data = {}
            parent.$_fillRecursive(data, { onlyDirty: true })

            return data
        },
        $_targetsOwnQuery(targetQueryId) {
            return targetQueryId !== null &&
                targetQueryId !== undefined &&
                String(targetQueryId) === String(this.kompoid)
        },
        $_hybridFilterDataParent() {
            let parent = this.$parent
            while (parent) {
                if (this.$_isHybridFilterDataParent(parent)) {
                    return parent
                }
                parent = parent.$parent
            }

            return null
        },
        $_isHybridFilterDataParent(parent) {
            return typeof parent.getJsonFormDataWithFilters === 'function' ||
                typeof parent.getJsonFormData === 'function'
        },
        $_currentHybridFilterData() {
            const data = {}

            if (typeof this.$_fill === 'function') {
                this.$_fill(data)
            }

            return data
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

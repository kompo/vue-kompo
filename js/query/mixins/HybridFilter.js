// vue-kompo/js/query/mixins/HybridFilter.js

/**
 * HybridFilter Mixin
 * Provides instant client-side filtering with background server sync
 *
 * Two modes:
 * 1. Hybrid: Shows instant JS results + loading bar at top
 * 2. Server-only: Shows loading overlay, hides items until response
 */
export default {
    data() {
        return {
            // Filter state
            hybridFilterActive: false,
            hybridFilterValue: '',
            hybridFilterTimeout: null,
            hybridFilterAttribute: 'data-filter',
            hybridOriginalCards: null,

            // Loading states
            filterIsLoading: false,        // True when server request in progress
            filterMode: 'hybrid',          // 'hybrid' or 'server'
            filterLoadingPosition: 'top',  // 'top', 'overlay', 'skeleton'
        }
    },

    computed: {
        $_hybridFilterConfig() {
            return this.$_config('hybridFilter')
        },

        /**
         * CSS class for wrapper when filtering
         * Only applies for server mode (hybrid just shows loading bar, no opacity change)
         */
        $_filterLoadingClass() {
            if (!this.filterIsLoading) return ''

            if (this.filterMode === 'server') {
                return 'vlQuery--server-loading'
            }
            // Hybrid mode: no class, just loading bar shown
            return ''
        },

        /**
         * Whether to show items or loading placeholder
         * Always true - we keep structure visible, just clear items in server mode
         */
        $_showFilterItems() {
            return true
        },
    },

    methods: {
        /**
         * Initialize hybrid filtering for this query
         * @param {Object} config - { attribute, debounce, mode, loadingPosition }
         */
        $_initHybridFilter(config = {}) {
            this.hybridFilterAttribute = config.attribute || 'data-filter'
            this.hybridFilterActive = true
            this.filterMode = config.mode || 'hybrid'
            this.filterLoadingPosition = config.loadingPosition || 'top'

            // Store original cards for instant filtering
            this.hybridOriginalCards = [...this.cards]
        },

        /**
         * Perform hybrid filter - instant JS + background server
         * @param {string} value - Filter value
         * @param {number} debounce - Debounce ms for server request
         * @param {string} mode - 'hybrid' or 'server'
         */
        $_hybridFilter(value, debounce = 300, mode = null) {
            this.hybridFilterValue = value

            if (mode) {
                this.filterMode = mode
            }

            // 1. Show loading indicator ALWAYS
            this.filterIsLoading = true

            // 2. For hybrid mode: instant JS filter
            if (this.filterMode === 'hybrid') {
                this.$_instantFilter(value)
            } else {
                // Server mode: clear cards to show empty state (headers remain visible)
                Vue.set(this, 'cards', [])
                this.cardsKey += 1
            }

            // 3. Debounced server request
            clearTimeout(this.hybridFilterTimeout)
            this.hybridFilterTimeout = setTimeout(() => {
                this.$_serverFilter(value)
            }, debounce)
        },

        /**
         * Server-only filter (no instant JS)
         * Shows loading state instead of items
         */
        $_serverOnlyFilter(value, debounce = 300) {
            this.$_hybridFilter(value, debounce, 'server')
        },

        /**
         * Instant client-side filter (hybrid mode only)
         */
        $_instantFilter(value) {
            if (!value || value.trim() === '') {
                // Reset to original or server state
                if (this.hybridOriginalCards) {
                    Vue.set(this, 'cards', [...this.hybridOriginalCards])
                }
                this.cardsKey += 1
                return
            }

            const searchLower = value.toLowerCase()
            const filtered = (this.hybridOriginalCards || this.cards).filter(card => {
                // Card structure: { attributes: { id }, render: { config, htmlAttributes, ... } }
                const element = card.render || card

                // Check filterValue in config (set by filterable())
                const filterValue = element.config?.filterValue ||
                                   element.config?.[this.hybridFilterAttribute] ||
                                   element.htmlAttributes?.[this.hybridFilterAttribute] ||
                                   ''

                if (typeof filterValue === 'string' && filterValue) {
                    return filterValue.toLowerCase().includes(searchLower)
                }

                // Check label as fallback
                const label = element.label || card.label
                if (label) {
                    return label.toLowerCase().includes(searchLower)
                }

                return true
            })

            Vue.set(this, 'cards', filtered)
            this.cardsKey += 1
        },

        /**
         * Server-side filter request
         */
        $_serverFilter(value) {
            const filterData = { _hybridFilter: value }

            this.$_kAxios.$_browseQuery(1, this.currentSort, filterData).then(r => {
                // Update with server results
                this.hybridOriginalCards = r.data.data
                Vue.set(this, 'cards', r.data.data)
                this.pagination = r.data
                this.cardsKey += 1
                this.filterIsLoading = false
            }).catch(e => {
                console.error('Hybrid filter server error:', e)
                this.filterIsLoading = false
            })
        },

        /**
         * Clear filter state
         */
        $_clearHybridFilter() {
            this.hybridFilterValue = ''
            clearTimeout(this.hybridFilterTimeout)
            this.filterIsLoading = false

            if (this.hybridOriginalCards) {
                Vue.set(this, 'cards', [...this.hybridOriginalCards])
                this.cardsKey += 1
            }
        },
    },

    beforeDestroy() {
        clearTimeout(this.hybridFilterTimeout)
    }
}

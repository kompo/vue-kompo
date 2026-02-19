import { KompoHelper } from '../../core/KompoHelper'

/**
 * Mixin for declarative JS features: jsConditional, jsComputed, jsFilter
 * These allow PHP to define reactive behaviors without custom JS code
 */
export default {
    data() {
        return {
            jsFeatureCleanup: [],
            jsComputedValue: null,
            jsConditionalHidden: false,
            jsConditionalDisabled: false,
        }
    },

    computed: {
        $_jsConditional() { return this.$_config('jsConditional') },
        $_jsComputed() { return this.$_config('jsComputed') },
        $_jsFilter() { return this.$_config('jsFilter') },

        // Override hidden state to include conditional
        $_jsHidden() {
            return this.jsConditionalHidden
        },

        // Computed value display
        $_jsComputedDisplay() {
            return this.jsComputedValue
        }
    },

    methods: {
        /**
         * Initialize all JS features
         */
        $_initJsFeatures() {
            if (this.$_jsConditional) {
                this.$_initJsConditional()
            }
            if (this.$_jsComputed) {
                this.$_initJsComputed()
            }
            if (this.$_jsFilter) {
                this.$_initJsFilter()
            }
        },

        /**
         * Clean up all watchers/listeners
         */
        $_cleanupJsFeatures() {
            this.jsFeatureCleanup.forEach(cleanup => {
                if (typeof cleanup === 'function') {
                    cleanup()
                }
            })
            this.jsFeatureCleanup = []
        },

        /**
         * jsConditional: Show/hide/enable/disable based on field value
         * Config: { type: 'show'|'hide'|'enable'|'disable', field: string, condition: string }
         */
        $_initJsConditional() {
            const config = this.$_jsConditional
            const { type, field, condition } = config

            // Initial evaluation
            this.$_evaluateConditional(field, condition, type)

            // Watch for changes using DOM events
            const cleanup = this.$_watchField(field, () => {
                this.$_evaluateConditional(field, condition, type)
            })

            this.jsFeatureCleanup.push(cleanup)
        },

        $_evaluateConditional(fieldName, condition, type) {
            const val = this.$_getFieldValue(fieldName)

            // Evaluate the condition (e.g., "val === 'credit_card'")
            let result = false
            try {
                result = eval(condition)
            } catch (e) {
                console.warn('jsConditional: Failed to evaluate condition:', condition, e)
            }

            // Apply the effect based on type
            switch (type) {
                case 'show':
                    this.jsConditionalHidden = !result
                    this.$_applyVisibility(!result)
                    break
                case 'hide':
                    this.jsConditionalHidden = result
                    this.$_applyVisibility(result)
                    break
                case 'enable':
                    this.jsConditionalDisabled = !result
                    this.$_applyDisabled(!result)
                    break
                case 'disable':
                    this.jsConditionalDisabled = result
                    this.$_applyDisabled(result)
                    break
            }
        },

        $_applyVisibility(hidden) {
            if (this.$el) {
                if (hidden) {
                    this.$el.classList.add('vlHide')
                    this.$el.style.display = 'none'
                } else {
                    this.$el.classList.remove('vlHide')
                    this.$el.style.display = ''
                }
            }
        },

        $_applyDisabled(disabled) {
            if (this.$el) {
                const inputs = this.$el.querySelectorAll('input, textarea, select, button')
                inputs.forEach(input => {
                    input.disabled = disabled
                })
                if (disabled) {
                    this.$el.classList.add('kompo-disabled')
                } else {
                    this.$el.classList.remove('kompo-disabled')
                }
            }
        },

        /**
         * jsComputed: Display computed value based on other fields
         * Config: { watch: string[], expression: string }
         */
        $_initJsComputed() {
            const config = this.$_jsComputed
            const { watch: watchFields, expression } = config

            // Initial computation
            this.$_computeValue(watchFields, expression)

            // Watch all fields
            watchFields.forEach(fieldName => {
                const cleanup = this.$_watchField(fieldName, () => {
                    this.$_computeValue(watchFields, expression)
                })
                this.jsFeatureCleanup.push(cleanup)
            })
        },

        $_computeValue(watchFields, expression) {
            // Build variables object from watched fields
            const vars = {}
            watchFields.forEach(fieldName => {
                const val = this.$_getFieldValue(fieldName)
                vars[fieldName] = parseFloat(val) || val || 0
            })

            // Evaluate the expression
            let result = ''
            try {
                // Create a function that has access to the field values as variables
                const varNames = Object.keys(vars)
                const varValues = Object.values(vars)
                const fn = new Function(...varNames, `return ${expression}`)
                result = fn(...varValues)

                // Handle NaN, Infinity, etc.
                if (typeof result === 'number' && (isNaN(result) || !isFinite(result))) {
                    result = ''
                }
            } catch (e) {
                console.warn('jsComputed: Failed to evaluate expression:', expression, e)
            }

            this.jsComputedValue = result

            // Update the element's display
            this.$_updateComputedDisplay(result)
        },

        $_updateComputedDisplay(value) {
            this.$nextTick(() => {
                if (this.$el) {
                    // For Html elements, update inner content
                    const contentEl = this.$el.querySelector('.vlContent, .vlLabel') || this.$el

                    // Check if this is a form field
                    const input = this.$el.querySelector('input, textarea')
                    if (input) {
                        input.value = value
                        // Trigger Vue reactivity
                        if (this.$_fill) {
                            this.component.value = value
                        }
                    } else {
                        // It's a display element (Html, etc.)
                        contentEl.textContent = value
                    }
                }
            })
        },

        /**
         * jsFilter: Filter container elements based on input value
         * Config: { container: string, attribute: string }
         */
        $_initJsFilter() {
            const config = this.$_jsFilter
            const { container, attribute } = config

            // Watch this element's input for changes
            this.$nextTick(() => {
                const input = this.$el ? this.$el.querySelector('input, textarea') : null
                if (input) {
                    const handler = (e) => {
                        this.$_filterContainer(container, attribute, e.target.value)
                    }
                    input.addEventListener('input', handler)
                    this.jsFeatureCleanup.push(() => {
                        input.removeEventListener('input', handler)
                    })

                    // Initial filter with current value
                    if (input.value) {
                        this.$_filterContainer(container, attribute, input.value)
                    }
                }
            })
        },

        $_filterContainer(containerId, attribute, searchValue) {
            const container = document.querySelector(`[data-id="${containerId}"]`) ||
                             document.getElementById(containerId)

            if (!container) {
                console.warn('jsFilter: Container not found:', containerId)
                return
            }

            const search = (searchValue || '').toLowerCase().trim()
            const items = container.querySelectorAll(`[${attribute}]`)

            items.forEach(item => {
                const filterValue = (item.getAttribute(attribute) || '').toLowerCase()

                if (!search || filterValue.includes(search)) {
                    item.style.display = ''
                    item.classList.remove('vlFilterHidden')
                } else {
                    item.style.display = 'none'
                    item.classList.add('vlFilterHidden')
                }
            })
        },

        /**
         * Helper: Get a field's current value by name
         */
        $_getFieldValue(fieldName) {
            // Try to find the field element
            const fieldEl = document.querySelector(`[data-id="${fieldName}"]`) ||
                           document.querySelector(`[name="${fieldName}"]`) ||
                           document.getElementById(fieldName)

            if (!fieldEl) return null

            // Check if it has a Vue instance
            if (fieldEl.__vue__ && fieldEl.__vue__.value !== undefined) {
                return fieldEl.__vue__.value
            }
            if (fieldEl.__vue__ && fieldEl.__vue__.$_value !== undefined) {
                return fieldEl.__vue__.$_value
            }

            // Fall back to DOM
            const input = fieldEl.querySelector('input, textarea, select') || fieldEl
            if (input.type === 'checkbox') {
                return input.checked
            }
            return input.value
        },

        /**
         * Helper: Watch a field for changes
         */
        $_watchField(fieldName, callback) {
            const fieldEl = document.querySelector(`[data-id="${fieldName}"]`) ||
                           document.querySelector(`[name="${fieldName}"]`) ||
                           document.getElementById(fieldName)

            if (!fieldEl) {
                console.warn('jsFeature: Field not found:', fieldName)
                return () => {}
            }

            // Try Vue watcher first
            if (fieldEl.__vue__ && fieldEl.__vue__.$watch) {
                const unwatch = fieldEl.__vue__.$watch('value', callback)
                return unwatch
            }

            // Fall back to DOM events
            const input = fieldEl.querySelector('input, textarea, select') || fieldEl
            const handler = () => callback()

            input.addEventListener('input', handler)
            input.addEventListener('change', handler)

            return () => {
                input.removeEventListener('input', handler)
                input.removeEventListener('change', handler)
            }
        }
    },

    mounted() {
        // Delay initialization to ensure all fields are rendered
        this.$nextTick(() => {
            setTimeout(() => {
                this.$_initJsFeatures()
            }, 100)
        })
    },

    beforeDestroy() {
        this.$_cleanupJsFeatures()
    }
}

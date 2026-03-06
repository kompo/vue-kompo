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
        $_jsClassConditional() { return this.$_config('jsClassConditional') },

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
            if (this.$_jsClassConditional) {
                this.$_initJsClassConditional()
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
            if (!this.$el) return

            const el = this.$el

            // First call — set up transition style once
            if (!el._vlTransitionReady) {
                el.style.transition = 'opacity .15s ease'
                el._vlTransitionReady = true
            }

            if (hidden) {
                el.style.opacity = '0'
                // After fade out, hide completely
                clearTimeout(el._vlHideTimer)
                el._vlHideTimer = setTimeout(() => {
                    el.classList.add('vlHide')
                    el.style.display = 'none'
                }, 150)
            } else {
                clearTimeout(el._vlHideTimer)
                el.classList.remove('vlHide')
                el.style.display = ''
                // Force reflow then fade in
                void el.offsetHeight
                el.style.opacity = '1'
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
         * jsClassConditional: Add/remove CSS classes based on field value
         * Config: { field: string, condition: string, classTrue: string, classFalse: string }
         */
        $_initJsClassConditional() {
            const config = this.$_jsClassConditional
            const { field, condition, classTrue, classFalse } = config

            this.$_evaluateClassConditional(field, condition, classTrue, classFalse)

            const cleanup = this.$_watchField(field, () => {
                this.$_evaluateClassConditional(field, condition, classTrue, classFalse)
            })

            this.jsFeatureCleanup.push(cleanup)
        },

        $_evaluateClassConditional(fieldName, condition, classTrue, classFalse) {
            const val = this.$_getFieldValue(fieldName)

            let result = false
            try {
                result = eval(condition)
            } catch (e) {
                console.warn('jsClassConditional: Failed to evaluate condition:', condition, e)
            }

            if (this.$el) {
                const addClasses = result ? classTrue : classFalse
                const removeClasses = result ? classFalse : classTrue

                if (removeClasses) {
                    removeClasses.split(' ').forEach(c => c && this.$el.classList.remove(c))
                }
                if (addClasses) {
                    addClasses.split(' ').forEach(c => c && this.$el.classList.add(c))
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
        /**
         * Find the Kompo Vue instance for a field by name.
         * querySelector may land on an inner <input> (e.g. Select's search input).
         * We walk up the DOM to find the owning Vue component with `component`.
         */
        $_findFieldVm(fieldName) {
            const el = document.querySelector(`[data-id="${fieldName}"]`) ||
                       document.querySelector(`[name="${fieldName}"]`) ||
                       document.getElementById(fieldName)

            if (!el) return null

            // Walk up to find a Vue instance with component.value (Kompo field)
            let node = el
            while (node) {
                if (node.__vue__ && node.__vue__.component) {
                    return node.__vue__
                }
                node = node.parentElement
            }

            // Fallback: return __vue__ on the found element itself (non-Kompo)
            return el.__vue__ || null
        },

        $_getFieldValue(fieldName) {
            const vm = this.$_findFieldVm(fieldName)

            if (vm) {
                const raw = vm.component ? vm.component.value : (vm.$_value !== undefined ? vm.$_value : vm.value)

                if (raw !== undefined) {
                    return this.$_extractScalarValue(raw)
                }
            }

            // Fall back to DOM
            const fieldEl = document.querySelector(`[name="${fieldName}"]`) ||
                            document.getElementById(fieldName)
            if (!fieldEl) return null

            const input = fieldEl.querySelector('input, textarea, select') || fieldEl
            if (input.type === 'checkbox') {
                return input.checked
            }
            return input.value
        },

        /**
         * Extract a scalar value from Kompo field values.
         * Selects store [{value, label}] arrays - we need the scalar.
         */
        $_extractScalarValue(raw) {
            if (Array.isArray(raw)) {
                if (raw.length === 0) return null
                // Kompo select option objects: [{value: "3", label: "..."}]
                if (raw[0] && raw[0].value !== undefined) {
                    return raw.length === 1 ? raw[0].value : raw.map(o => o.value)
                }
                return raw.length === 1 ? raw[0] : raw
            }
            return raw
        },

        /**
         * Helper: Watch a field for changes
         */
        $_watchField(fieldName, callback) {
            const vm = this.$_findFieldVm(fieldName)

            if (vm && vm.$watch) {
                // Kompo fields: watch component.value (deep for selects with option objects)
                if (vm.component) {
                    const unwatch = vm.$watch('component.value', callback, { deep: true })
                    return unwatch
                }
                // Generic Vue component
                const unwatch = vm.$watch('value', callback)
                return unwatch
            }

            // Fall back to DOM events
            const fieldEl = document.querySelector(`[name="${fieldName}"]`) ||
                            document.getElementById(fieldName)

            if (!fieldEl) {
                console.warn('jsFeature: Field not found:', fieldName)
                return () => {}
            }

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
        // Immediately hide elements with jsShowWhen to prevent flash
        // (don't wait for $nextTick or setTimeout — hide NOW)
        const jc = this.$_jsConditional
        if (jc && this.$el) {
            if (jc.type === 'show' || jc.type === 'enable') {
                this.$el.style.display = 'none'
            }
        }

        // Delay full initialization to ensure all fields are rendered
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

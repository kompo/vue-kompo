export default {
    methods: {
        /**
         * Intelligently update elements array, only modifying changed items.
         * Preserves Vue component instances for unchanged elements.
         */
        $_smartUpdateElements(newElements) {
            if (!newElements || !Array.isArray(newElements)) {
                this.elements = newElements || []
                return
            }

            const oldById = new Map()
            const newById = new Map()

            // Index elements by ID
            this.elements.forEach((el, i) => oldById.set(el.id, { el, index: i }))
            newElements.forEach((el, i) => newById.set(el.id, { el, index: i }))

            // Categorize changes
            const updates = []
            const removals = []

            // Find updates and removals
            this.elements.forEach((oldEl, i) => {
                const newEntry = newById.get(oldEl.id)
                if (newEntry) {
                    if (!this.$_elementsEqual(oldEl, newEntry.el)) {
                        updates.push({ oldIndex: i, newIndex: newEntry.index, element: newEntry.el })
                    }
                } else {
                    removals.push(i)
                }
            })

            // Find additions
            const additions = []
            newElements.forEach((newEl, i) => {
                if (!oldById.has(newEl.id)) {
                    additions.push({ index: i, element: newEl })
                }
            })

            // Apply removals (reverse order to preserve indices)
            removals.sort((a, b) => b - a).forEach(i => {
                this.elements.splice(i, 1)
            })

            // Apply updates using this.$set for reactivity
            updates.forEach(({ oldIndex, element }) => {
                this.$set(this.elements, oldIndex, element)
            })

            // Apply additions
            additions.sort((a, b) => a.index - b.index).forEach(({ index, element }) => {
                this.elements.splice(index, 0, element)
            })
        },

        $_elementsEqual(a, b) {
            // Fast path: same reference
            if (a === b) return true

            // Guard against null/undefined inputs
            if (!a || !b) return false

            // Compare essential properties
            return a.id === b.id &&
                   a.vueComponent === b.vueComponent &&
                   JSON.stringify(a.config) === JSON.stringify(b.config) &&
                   JSON.stringify(a.elements) === JSON.stringify(b.elements)
        }
    }
}

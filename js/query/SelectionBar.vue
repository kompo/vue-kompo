<template>
    <transition name="vlSelectionBar-slide">
        <div v-if="hasSelection" class="vlSelectionBar" :class="[$_phpClasses, barClass]">
            <!-- Selected Count Badge -->
            <div class="vlSelectionBar__count">
                <span class="vlSelectionBar__badge">{{ displayCount }}</span>
                <span class="vlSelectionBar__label">selected</span>
            </div>

            <!-- Select All Button (only when all page items are selected but not all total) -->
            <button
                v-if="canSelectAll"
                @click="selectAll"
                class="vlSelectionBar__selectAll"
            >
                <span class="vlSelectionBar__arrow">&rarr;</span>
                Select all {{ totalCount }}
            </button>

            <!-- All Selected Confirmation -->
            <div v-if="isAllSelected" class="vlSelectionBar__allSelected">
                <span class="vlSelectionBar__check">&check;</span>
                <span>All {{ displayCount }} selected</span>
                <span v-if="excludedCount > 0" class="vlSelectionBar__excluded">
                    ({{ excludedCount }} excluded)
                </span>
                <button type="button" @click="clearSelection" class="vlSelectionBar__clear" title="Clear selection">
                    &times;
                </button>
            </div>

            <!-- Actions Slot -->
            <div class="vlSelectionBar__actions">
                <component
                    v-if="actionsComponent"
                    v-bind="actionsAttributes"
                />
            </div>
        </div>
    </transition>
</template>

<script>
import BaseElement from '../element/mixins/BaseElement'

export default {
    name: 'SelectionBar',
    mixins: [BaseElement],
    props: {
        kompoid: { type: String, required: false },
    },
    data() {
        return {
            // Selection state
            selectionMode: 'specific',  // 'specific' | 'all'
            selectedIds: [],            // In 'specific' mode: selected IDs
            excludedIds: [],            // In 'all' mode: excluded IDs

            // Query info
            totalCount: 0,
            pageItemCount: 0,
            pageSelectedCount: 0,

            // Registered query ID
            queryId: null,
        }
    },
    computed: {
        // The query ID this bar is attached to
        targetQueryId() {
            return this.$_config('queryId') || this.kompoid
        },

        // Actions component from PHP config
        actionsComponent() {
            return this.$_config('actionsComponent')
        },

        actionsAttributes() {
            if (!this.actionsComponent) return {}

            return {
                is: this.$_vueTag(this.actionsComponent),
                vkompo: this.actionsComponent,
                kompoid: this.kompoid,
            }
        },

        // CSS class for the bar
        barClass() {
            return this.$_config('barClass') || ''
        },

        // Whether there's any selection
        hasSelection() {
            if (this.selectionMode === 'all') {
                return true
            }
            return this.selectedIds.length > 0
        },

        // Display count (total selected)
        displayCount() {
            if (this.selectionMode === 'all') {
                return this.totalCount - this.excludedIds.length
            }
            return this.selectedIds.length
        },

        // Can show "Select all X" button?
        // Only when: all items on current page are selected, but not in 'all' mode yet
        canSelectAll() {
            if (this.selectionMode === 'all') return false
            if (this.totalCount <= this.pageItemCount) return false  // All items fit on one page

            // All page items must be selected
            return this.pageSelectedCount >= this.pageItemCount && this.pageItemCount > 0
        },

        // Is in "all selected" mode?
        isAllSelected() {
            return this.selectionMode === 'all'
        },

        // Number of excluded items
        excludedCount() {
            return this.excludedIds.length
        },
    },
    created() {
        this.queryId = this.targetQueryId
        this.$_attachSelectionEvents()
    },
    beforeDestroy() {
        this.$_destroySelectionEvents()
    },
    methods: {
        // Select all items across all pages
        selectAll() {
            this.selectionMode = 'all'
            this.excludedIds = []
            this.selectedIds = []

            // Notify Query about mode change
            this.$kompo.vlSetSelectionMode(this.queryId, {
                mode: 'all',
                excludedIds: [],
            })
        },

        // Clear "select all" mode - keeps current page items checked
        clearSelection() {
            this.selectionMode = 'specific'
            this.excludedIds = []
            // Don't clear selectedIds - Query will emit current state via vlSelectionChanged

            // Notify Query about mode change only (don't send selectedIds to keep current checkboxes)
            this.$kompo.vlSetSelectionMode(this.queryId, {
                mode: 'specific',
                // selectedIds intentionally omitted - Query keeps its current checkedItemIds
            })
        },

        // Get selection state for bulk actions
        getSelectionState() {
            return {
                mode: this.selectionMode,
                selectedIds: this.selectionMode === 'specific' ? this.selectedIds : [],
                excludedIds: this.selectionMode === 'all' ? this.excludedIds : [],
                totalCount: this.totalCount,
                displayCount: this.displayCount,
            }
        },

        $_attachSelectionEvents() {
            // Listen for selection changes from Query
            this.$_vlOn('vlSelectionChanged' + this.queryId, (data) => {
                this.totalCount = data.totalCount || 0
                this.pageItemCount = data.pageItemCount || 0
                this.pageSelectedCount = data.pageSelectedCount || 0

                // Sync selectionMode from Query (Query is the source of truth)
                if (data.selectionMode !== undefined) {
                    this.selectionMode = data.selectionMode
                }

                // Sync selectedIds (in specific mode)
                if (data.selectionMode === 'specific' || this.selectionMode === 'specific') {
                    this.selectedIds = [...(data.selectedIds || [])]
                }

                // Sync excludedIds (in all mode)
                if (data.selectionMode === 'all' || this.selectionMode === 'all') {
                    this.excludedIds = [...(data.excludedIds || [])]
                }
            })

            // Listen for query refresh/browse (may need to update counts)
            this.$_vlOn('vlQueryBrowsed' + this.queryId, (data) => {
                if (data && data.totalCount !== undefined) {
                    this.totalCount = data.totalCount
                }
            })
        },

        $_destroySelectionEvents() {
            this.$_vlOff([
                'vlSelectionChanged' + this.queryId,
                'vlQueryBrowsed' + this.queryId,
            ])
        },

        // Vue tag helper
        $_vueTag(component) {
            if (!component) return 'div'
            return 'Vl' + (component.vueComponent || component.component || 'Html')
        },
    },
}
</script>

<style>
.vlSelectionBar {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem 1rem;
    background: linear-gradient(to right, #e0f2fe, #f0f9ff);
    border: 1px solid #7dd3fc;
    border-radius: 9999px;
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
}

.vlSelectionBar__count {
    display: flex;
    align-items: center;
    gap: 0.375rem;
}

.vlSelectionBar__badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 1.5rem;
    padding: 0.125rem 0.5rem;
    background: #0891b2;
    color: white;
    border-radius: 9999px;
    font-weight: 600;
    font-size: 0.75rem;
}

.vlSelectionBar__label {
    color: #0e7490;
    font-weight: 500;
}

.vlSelectionBar__selectAll {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.75rem;
    background: #0891b2;
    color: white;
    border: none;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s;
}

.vlSelectionBar__selectAll:hover {
    background: #0e7490;
}

.vlSelectionBar__arrow {
    font-size: 0.875rem;
}

.vlSelectionBar__allSelected {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.25rem 0.75rem;
    background: #0891b2;
    color: white;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 500;
}

.vlSelectionBar__check {
    font-size: 0.75rem;
}

.vlSelectionBar__excluded {
    opacity: 0.8;
    font-size: 0.625rem;
}

.vlSelectionBar__clear {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.25rem;
    height: 1.25rem;
    margin-left: 0.25rem;
    background: rgba(255, 255, 255, 0.2);
    border: none;
    border-radius: 50%;
    color: white;
    font-size: 0.75rem;
    cursor: pointer;
    transition: background 0.15s;
}

.vlSelectionBar__clear:hover {
    background: rgba(255, 255, 255, 0.3);
}

.vlSelectionBar__actions {
    margin-left: auto;
}

/* Slide animation */
.vlSelectionBar-slide-enter-active,
.vlSelectionBar-slide-leave-active {
    transition: all 0.2s ease;
}

.vlSelectionBar-slide-enter,
.vlSelectionBar-slide-leave-to {
    opacity: 0;
    transform: translateY(-0.5rem);
}
</style>

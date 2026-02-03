/**
 * KompoHelper ($k) - A fluent API for interacting with Kompo components
 * Makes ->run() feel like being inside a Vue component
 */
export default class KompoHelper {
    constructor(vueInstance, kompoInstance) {
        this.vue = vueInstance
        this.$kompo = kompoInstance || vueInstance.$kompo
        this._state = window._kompoState = window._kompoState || {}
        this._watchers = []
        this._eventListeners = []
    }

    // ==========================================
    // FIELD OPERATIONS
    // ==========================================

    /**
     * Get a field helper by name or ID
     * Usage: $k.field('price').value, $k.field('price').set(100)
     */
    field(nameOrId) {
        return new KompoFieldHelper(this, nameOrId)
    }

    /**
     * Get multiple fields at once
     * Usage: const { price, quantity } = $k.fields('price', 'quantity')
     */
    fields(...names) {
        const result = {}
        names.forEach(name => {
            result[name] = this.field(name)
        })
        return result
    }

    // ==========================================
    // FORM OPERATIONS
    // ==========================================

    /**
     * Form helper for the current/parent form
     */
    get form() {
        return new KompoFormHelper(this)
    }

    // ==========================================
    // PANEL/CONTAINER OPERATIONS
    // ==========================================

    /**
     * Get a panel/container helper by ID
     * Usage: $k.panel('sidebar').show(), $k.panel('sidebar').fill(html)
     */
    panel(panelId) {
        return new KompoPanelHelper(this, panelId)
    }

    /**
     * Alias for panel
     */
    container(id) {
        return this.panel(id)
    }

    // ==========================================
    // ELEMENT OPERATIONS (Generic)
    // ==========================================

    /**
     * Get any element by ID
     */
    el(id) {
        return new KompoElementHelper(this, id)
    }

    /**
     * Find element(s) by selector
     */
    find(selector) {
        const el = document.querySelector(selector)
        return el ? new KompoElementHelper(this, null, el) : null
    }

    /**
     * Find all elements by selector
     */
    findAll(selector) {
        const elements = document.querySelectorAll(selector)
        return Array.from(elements).map(el => new KompoElementHelper(this, null, el))
    }

    // ==========================================
    // QUERY/TABLE OPERATIONS
    // ==========================================

    /**
     * Get a Query/Table helper by ID
     */
    query(queryId) {
        return new KompoQueryHelper(this, queryId)
    }

    /**
     * Alias for query
     */
    table(id) {
        return this.query(id)
    }

    // ==========================================
    // MODAL OPERATIONS
    // ==========================================

    /**
     * Modal operations
     * Usage: $k.modal('confirm').open(), $k.modal().close()
     */
    modal(modalId = null) {
        return new KompoModalHelper(this, modalId)
    }

    // ==========================================
    // GLOBAL ACTIONS
    // ==========================================

    /**
     * Show an alert
     */
    alert(message, type = 'success', options = {}) {
        this.$kompo.vlAlertShow({
            message,
            type,
            ...options
        })
        return this
    }

    /**
     * Redirect to URL
     */
    redirect(url, delay = 0) {
        if (delay) {
            setTimeout(() => window.location.href = url, delay)
        } else {
            window.location.href = url
        }
        return this
    }

    /**
     * Refresh a component by ID
     */
    refresh(kompoid) {
        this.$kompo.vlReloadAfterChildAction(kompoid)
        return this
    }

    /**
     * Emit a custom event
     */
    emit(eventName, payload = {}) {
        this.$kompo.vlEmitRoot(eventName, payload)
        return this
    }

    /**
     * Emit to a specific component
     */
    emitTo(kompoid, eventName, payload = {}) {
        this.$kompo.vlEmitFrom(kompoid, eventName, payload)
        return this
    }

    // ==========================================
    // LOADING STATES
    // ==========================================

    /**
     * Toggle global loading spinner
     */
    loading(show = true) {
        window._kompo.toggleSpinner(show ? 'block' : 'none')
        return this
    }

    // ==========================================
    // STATE MANAGEMENT
    // ==========================================

    /**
     * Persistent state across interactions
     */
    get state() {
        return this._state
    }

    /**
     * Set state value
     */
    setState(key, value) {
        this._state[key] = value
        return this
    }

    /**
     * Get state value
     */
    getState(key, defaultValue = null) {
        return this._state[key] !== undefined ? this._state[key] : defaultValue
    }

    // ==========================================
    // REACTIVE WATCHING
    // ==========================================

    /**
     * Watch a field for changes
     */
    watch(fieldName, callback) {
        const field = this.field(fieldName)
        const vueComponent = field.vueComponent

        if (vueComponent && vueComponent.$watch) {
            const unwatch = vueComponent.$watch('value', (newVal, oldVal) => {
                callback(newVal, oldVal, field)
            })
            this._watchers.push(unwatch)
            return unwatch
        }

        // Fallback: DOM event listener
        const el = field.inputElement
        if (el) {
            const handler = (e) => callback(e.target.value, null, field)
            el.addEventListener('input', handler)
            el.addEventListener('change', handler)
            const unsubscribe = () => {
                el.removeEventListener('input', handler)
                el.removeEventListener('change', handler)
            }
            this._watchers.push(unsubscribe)
            return unsubscribe
        }

        return () => {}
    }

    /**
     * Watch multiple fields
     */
    watchAll(fieldNames, callback) {
        const unwatchers = fieldNames.map(name => this.watch(name, () => {
            const values = {}
            fieldNames.forEach(n => values[n] = this.field(n).value)
            callback(values)
        }))
        return () => unwatchers.forEach(u => u())
    }

    // ==========================================
    // UTILITIES
    // ==========================================

    /**
     * Delay execution (returns promise)
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    /**
     * Confirm dialog (returns promise)
     */
    confirm(message) {
        return Promise.resolve(window.confirm(message))
    }

    /**
     * Simple fetch wrapper
     */
    async fetch(url, data = {}, method = 'POST') {
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content
            },
            body: method !== 'GET' ? JSON.stringify(data) : undefined
        })
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        return response.json()
    }

    /**
     * Event delegation - listen to events on dynamic elements
     */
    on(eventType, selector, callback) {
        const handler = (e) => {
            const target = e.target.closest(selector)
            if (target) {
                callback(e, new KompoElementHelper(this, null, target))
            }
        }
        document.addEventListener(eventType, handler)
        const unsubscribe = () => document.removeEventListener(eventType, handler)
        this._eventListeners.push(unsubscribe)
        return unsubscribe
    }

    /**
     * Run after next DOM update
     */
    nextTick(callback) {
        this.vue.$nextTick(callback)
        return this
    }

    /**
     * Cleanup watchers and event listeners
     */
    cleanup() {
        this._watchers.forEach(unwatch => unwatch())
        this._eventListeners.forEach(unsubscribe => unsubscribe())
        this._watchers = []
        this._eventListeners = []
    }
}

// ==========================================
// FIELD HELPER CLASS
// ==========================================

class KompoFieldHelper {
    constructor(kompoHelper, nameOrId) {
        this.$k = kompoHelper
        this.nameOrId = nameOrId
        this._vueComponent = null
        this._element = null
    }

    get vueComponent() {
        if (this._vueComponent) return this._vueComponent

        // Try to find Vue component by various methods
        const el = this.element
        if (el && el.__vue__) {
            this._vueComponent = el.__vue__
        }
        return this._vueComponent
    }

    get element() {
        if (this._element) return this._element

        // Use getElementById for plain IDs (safest)
        const byId = document.getElementById(this.nameOrId)
        if (byId) {
            this._element = byId
            return byId
        }

        // Use CSS.escape for selector safety
        const escaped = CSS.escape(this.nameOrId)
        this._element =
            document.querySelector(`[data-id="${escaped}"]`) ||
            document.querySelector(`[name="${escaped}"]`) ||
            document.querySelector(`[kompoid="${escaped}"]`)

        return this._element
    }

    get inputElement() {
        const el = this.element
        if (!el) return null
        return el.querySelector('input, textarea, select') || el
    }

    get vue() {
        return this.vueComponent
    }

    get el() {
        return this.element
    }

    // Get current value
    get value() {
        const vue = this.vueComponent
        if (vue) {
            return vue.value !== undefined ? vue.value : vue.$_value
        }
        const input = this.inputElement
        return input ? input.value : null
    }

    // Set value
    set(value) {
        const vue = this.vueComponent
        if (vue) {
            if (vue.$_fill) {
                vue.$_fill(value)
            } else if (vue.value !== undefined) {
                vue.value = value
            }
            if (vue.$emit) {
                vue.$emit('input', value)
                vue.$emit('change', value)
            }
        } else {
            const input = this.inputElement
            if (input) {
                input.value = value
                input.dispatchEvent(new Event('input', { bubbles: true }))
                input.dispatchEvent(new Event('change', { bubbles: true }))
            }
        }
        return this
    }

    // Clear value
    clear() {
        return this.set('')
    }

    // Focus
    focus() {
        this.$k.nextTick(() => {
            const input = this.inputElement
            if (input) input.focus()
        })
        return this
    }

    // Blur
    blur() {
        const input = this.inputElement
        if (input) input.blur()
        return this
    }

    // Select text
    select() {
        const input = this.inputElement
        if (input && input.select) input.select()
        return this
    }

    // Disable
    disable() {
        const vue = this.vueComponent
        if (vue && vue.$_state) {
            vue.$_state({ disabled: true })
        } else {
            const input = this.inputElement
            if (input) input.disabled = true
        }
        return this
    }

    // Enable
    enable() {
        const vue = this.vueComponent
        if (vue && vue.$_state) {
            vue.$_state({ disabled: false })
        } else {
            const input = this.inputElement
            if (input) input.disabled = false
        }
        return this
    }

    // Show
    show() {
        const el = this.element
        if (el) {
            el.style.display = ''
            el.classList.remove('hidden', 'vlHide')
        }
        return this
    }

    // Hide
    hide() {
        const el = this.element
        if (el) el.classList.add('hidden')
        return this
    }

    // Toggle visibility
    toggle() {
        const el = this.element
        if (el) el.classList.toggle('hidden')
        return this
    }

    // Add class
    addClass(className) {
        const el = this.element
        if (el) className.split(' ').forEach(c => el.classList.add(c))
        return this
    }

    // Remove class
    removeClass(className) {
        const el = this.element
        if (el) className.split(' ').forEach(c => el.classList.remove(c))
        return this
    }

    // Toggle class
    toggleClass(className) {
        const el = this.element
        if (el) className.split(' ').forEach(c => el.classList.toggle(c))
        return this
    }

    // Validate (trigger validation)
    validate() {
        const vue = this.vueComponent
        if (vue && vue.$_validate) {
            vue.$_validate()
        }
        return this
    }

    // Check if has error
    get hasError() {
        const vue = this.vueComponent
        return vue && vue.$_hasError ? vue.$_hasError() : false
    }

    // Get error message
    get error() {
        const vue = this.vueComponent
        return vue && vue.errorMessage ? vue.errorMessage : null
    }

    // Scroll to this field
    scrollTo(options = {}) {
        const el = this.element
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center', ...options })
        }
        return this
    }
}

// ==========================================
// FORM HELPER CLASS
// ==========================================

class KompoFormHelper {
    constructor(kompoHelper) {
        this.$k = kompoHelper
    }

    get vueComponent() {
        // Find parent form component
        let vue = this.$k.vue
        while (vue) {
            if (vue.$options.name === 'FormInner' || vue.formUrl) {
                return vue
            }
            vue = vue.$parent
        }
        return null
    }

    // Get all form data
    data() {
        const vue = this.vueComponent
        if (vue && vue.getJsonFormData) {
            return vue.getJsonFormData({})
        }
        // Fallback: collect from DOM
        const form = document.querySelector('form')
        if (form) {
            return Object.fromEntries(new FormData(form))
        }
        return {}
    }

    // Fill multiple fields
    fill(data) {
        Object.entries(data).forEach(([name, value]) => {
            this.$k.field(name).set(value)
        })
        return this
    }

    // Reset form
    reset() {
        const vue = this.vueComponent
        if (vue && vue.$_resetForm) {
            vue.$_resetForm()
        }
        return this
    }

    // Validate all fields
    validate() {
        const vue = this.vueComponent
        if (vue && vue.$_validate) {
            return vue.$_validate()
        }
        return true
    }

    // Submit form
    submit() {
        const vue = this.vueComponent
        if (vue && vue.$_submitForm) {
            vue.$_submitForm()
        }
        return this
    }

    // Check if form is dirty (has changes)
    isDirty() {
        const vue = this.vueComponent
        return vue && vue.isDirty ? vue.isDirty : false
    }
}

// ==========================================
// PANEL HELPER CLASS
// ==========================================

class KompoPanelHelper {
    constructor(kompoHelper, panelId) {
        this.$k = kompoHelper
        this.panelId = panelId
    }

    get element() {
        return document.querySelector(`[data-id="${this.panelId}"]`) ||
               document.getElementById(this.panelId) ||
               document.querySelector(`#${this.panelId}`)
    }

    // Fill panel with content
    // NOTE: innerHTML is intentional here - this API is designed for trusted HTML content
    // from server-side Kompo components. The user controls the content being passed.
    fill(content) {
        if (typeof content === 'object') {
            // It's a Kompo component definition
            this.$k.$kompo.vlFillPanel(this.panelId, content, {})
        } else {
            // It's HTML (trusted content from server-side Kompo)
            const el = this.element
            if (el) el.innerHTML = content
        }
        return this
    }

    // Append content
    append(content) {
        const el = this.element
        if (el) el.insertAdjacentHTML('beforeend', content)
        return this
    }

    // Prepend content
    prepend(content) {
        const el = this.element
        if (el) el.insertAdjacentHTML('afterbegin', content)
        return this
    }

    // Clear content
    clear() {
        const el = this.element
        if (el) el.innerHTML = ''
        return this
    }

    // Show
    show() {
        const el = this.element
        if (el) {
            el.style.display = ''
            el.classList.remove('hidden', 'vlHide')
        }
        return this
    }

    // Hide
    hide() {
        const el = this.element
        if (el) el.classList.add('hidden')
        return this
    }

    // Toggle
    toggle() {
        const el = this.element
        if (el) el.classList.toggle('hidden')
        return this
    }

    // Show loading state
    loading(show = true) {
        const el = this.element
        if (!el) return this

        if (show) {
            el.dataset.originalContent = el.innerHTML
            el.innerHTML = `
                <div class="kompo-skeleton animate-pulse space-y-3 p-4">
                    <div class="bg-gray-200 h-4 rounded w-3/4"></div>
                    <div class="bg-gray-200 h-4 rounded w-1/2"></div>
                    <div class="bg-gray-200 h-8 rounded"></div>
                </div>
            `
            el.classList.add('kompo-loading')
        } else {
            el.classList.remove('kompo-loading')
            if (el.dataset.originalContent) {
                el.innerHTML = el.dataset.originalContent
                delete el.dataset.originalContent
            }
        }
        return this
    }

    // Add class
    addClass(className) {
        const el = this.element
        if (el) className.split(' ').forEach(c => el.classList.add(c))
        return this
    }

    // Remove class
    removeClass(className) {
        const el = this.element
        if (el) className.split(' ').forEach(c => el.classList.remove(c))
        return this
    }

    // Scroll to panel
    scrollTo(options = {}) {
        const el = this.element
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start', ...options })
        return this
    }
}

// ==========================================
// ELEMENT HELPER CLASS (Generic)
// ==========================================

class KompoElementHelper {
    constructor(kompoHelper, id, element = null) {
        this.$k = kompoHelper
        this.id = id
        this._element = element
    }

    get element() {
        if (this._element) return this._element
        return document.querySelector(`[data-id="${this.id}"]`) ||
               document.getElementById(this.id)
    }

    get el() {
        return this.element
    }

    show() {
        const el = this.element
        if (el) {
            el.style.display = ''
            el.classList.remove('hidden', 'vlHide')
        }
        return this
    }

    hide() {
        const el = this.element
        if (el) el.classList.add('hidden')
        return this
    }

    toggle() {
        const el = this.element
        if (el) el.classList.toggle('hidden')
        return this
    }

    addClass(className) {
        const el = this.element
        if (el) className.split(' ').forEach(c => el.classList.add(c))
        return this
    }

    removeClass(className) {
        const el = this.element
        if (el) className.split(' ').forEach(c => el.classList.remove(c))
        return this
    }

    toggleClass(className) {
        const el = this.element
        if (el) className.split(' ').forEach(c => el.classList.toggle(c))
        return this
    }

    remove() {
        const el = this.element
        if (el) el.remove()
        return this
    }

    html(content) {
        const el = this.element
        if (el) el.innerHTML = content
        return this
    }

    text(content) {
        const el = this.element
        if (el) el.textContent = content
        return this
    }

    attr(name, value) {
        const el = this.element
        if (el) {
            if (value === undefined) return el.getAttribute(name)
            el.setAttribute(name, value)
        }
        return this
    }

    data(name, value) {
        const el = this.element
        if (el) {
            if (value === undefined) return el.dataset[name]
            el.dataset[name] = value
        }
        return this
    }

    closest(selector) {
        const el = this.element
        if (el) {
            const found = el.closest(selector)
            return found ? new KompoElementHelper(this.$k, null, found) : null
        }
        return null
    }

    find(selector) {
        const el = this.element
        if (el) {
            const found = el.querySelector(selector)
            return found ? new KompoElementHelper(this.$k, null, found) : null
        }
        return null
    }

    findAll(selector) {
        const el = this.element
        if (el) {
            return Array.from(el.querySelectorAll(selector))
                .map(e => new KompoElementHelper(this.$k, null, e))
        }
        return []
    }

    scrollTo(options = {}) {
        const el = this.element
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center', ...options })
        return this
    }

    click() {
        const el = this.element
        if (el) el.click()
        return this
    }
}

// ==========================================
// QUERY HELPER CLASS
// ==========================================

class KompoQueryHelper {
    constructor(kompoHelper, queryId) {
        this.$k = kompoHelper
        this.queryId = queryId
    }

    refresh() {
        this.$k.$kompo.vlBrowseQuery(this.queryId)
        return this
    }

    page(pageNumber) {
        this.$k.$kompo.vlBrowseQuery(this.queryId, pageNumber)
        return this
    }

    sort(column) {
        this.$k.$kompo.vlSort(this.queryId, column)
        return this
    }

    filter(filters) {
        this.$k.$kompo.vlBrowseQuery(this.queryId, null, filters)
        return this
    }

    // Hybrid filtering
    hybridFilter(value, debounce = 300, attribute = 'data-filter', mode = 'hybrid', name = null) {
        this.$k.$kompo.vlHybridFilter(this.queryId, value, debounce, attribute, mode, name)
        return this
    }

    // Instant JS filter only
    instantFilter(value, attribute = 'data-filter') {
        this.$k.$kompo.vlHybridFilter(this.queryId, value, 0, attribute, 'hybrid')
        return this
    }

    // Add item to query
    add(item, position = 'append', itemId = null) {
        this.$k.$kompo.vlAddItem(this.queryId, item, position, itemId)
        return this
    }

    // Prepend item
    prepend(item, itemId = null) {
        this.$k.$kompo.vlPrependItem(this.queryId, item, itemId)
        return this
    }

    // Remove item by ID
    remove(itemId) {
        this.$k.$kompo.vlRemoveItemById(this.queryId, itemId)
        return this
    }

    // Remove item by index
    removeAt(index) {
        this.$k.$kompo.vlRemoveItem(this.queryId, index)
        return this
    }

    // Update item
    update(itemId, item) {
        this.$k.$kompo.vlUpdateItem(this.queryId, itemId, item)
        return this
    }

    // Get all current items (if accessible via DOM)
    get items() {
        const el = document.querySelector(`[data-id="${CSS.escape(this.queryId)}"]`)
        if (el && el.__vue__) {
            return el.__vue__.cards || []
        }
        return []
    }

    // Get item count
    get count() {
        return this.items.length
    }
}

// ==========================================
// MODAL HELPER CLASS
// ==========================================

class KompoModalHelper {
    constructor(kompoHelper, modalId) {
        this.$k = kompoHelper
        this.modalId = modalId
    }

    open(content = null) {
        if (!content && !this.modalId) {
            console.warn('KompoHelper: modal().open() called without content or modalId')
            return this
        }
        if (content) {
            this.$k.$kompo.vlFillModal({ data: content }, this.modalId, {})
        } else if (this.modalId) {
            this.$k.$kompo.vlModalShow(this.modalId)
        }
        return this
    }

    close() {
        this.$k.$kompo.vlCloseLastModal()
        return this
    }

    fill(content) {
        this.$k.$kompo.vlFillModal({ data: content }, this.modalId, {})
        return this
    }
}

function buildJsCtx(vueInstance, response = {}) {
    const $k = new KompoHelper(vueInstance, vueInstance.$kompo)

    // Build rich context with destructurable helpers
    const ctx = {
        // The $k helper (full API)
        $k,

        // Destructurable shortcuts
        field: (name) => $k.field(name),
        fields: (...names) => $k.fields(...names),
        panel: (id) => $k.panel(id),
        form: $k.form,
        modal: (id) => $k.modal(id),
        query: (id) => $k.query(id),
        el: (id) => $k.el(id),
        find: (sel) => $k.find(sel),
        findAll: (sel) => $k.findAll(sel),

        // Actions
        alert: (msg, type) => $k.alert(msg, type),
        redirect: (url) => $k.redirect(url),
        refresh: (id) => $k.refresh(id),
        emit: (event, payload) => $k.emit(event, payload),
        emitTo: (id, event, payload) => $k.emitTo(id, event, payload),
        loading: (show) => $k.loading(show),

        // State
        state: $k.state,

        // Reactive
        watch: (field, cb) => $k.watch(field, cb),
        watchAll: (fields, cb) => $k.watchAll(fields, cb),

        // Utilities
        delay: (ms) => $k.delay(ms),
        confirm: (msg) => $k.confirm(msg),
        fetch: (url, data, method) => $k.fetch(url, data, method),
        on: (event, sel, cb) => $k.on(event, sel, cb),
        nextTick: (cb) => $k.nextTick(cb),

        // Legacy (backward compatibility)
        response: response,
        value: vueInstance.value !== undefined ? vueInstance.value : vueInstance.$_value,
        vue: vueInstance,
        kompoid: vueInstance.kompoid || vueInstance.$_elKompoId,
        config: vueInstance.$_config ? vueInstance.$_config() : {},
        getFormData: () => $k.form.data(),
        setValue: (field, value) => $k.field(field).set(value),
    }

    return ctx
}

// Export for use in Action.js
export { KompoHelper, KompoFieldHelper, KompoFormHelper, KompoPanelHelper, KompoElementHelper, buildJsCtx }

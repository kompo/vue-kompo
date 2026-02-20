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

        return new Proxy(this, {
            get(target, prop) {
                if (typeof prop === 'symbol') return target[prop]
                if (prop in target) return target[prop]
                const vue = target.vueComponent
                if (vue && prop in vue) {
                    const val = vue[prop]
                    return typeof val === 'function' ? val.bind(vue) : val
                }
                return undefined
            }
        })
    }

    get vueComponent() {
        if (this._vueComponent) return this._vueComponent

        // Try to find Vue component by various methods with parents included by max depth 5
        // We normally are able at the first but for example checkboxes have the id in a child of the component
        // So we need to be able to go up a few levels to find the component. We limit to 5 to avoid infinite loops in case of misconfiguration.
        let el = this.element
        for (let depth = 0; depth < 5; depth++) {
            if (el && el.__vue__) {
                this._vueComponent = el.__vue__
                break
            }
            el = el ? el.parentElement : null
            if (!el) break
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
            return vue.component.value !== undefined ? vue.component.value : null
        }
        const input = this.inputElement
        return input ? input.value : null
    }

    // Set value
    set(value) {
        const vue = this.vueComponent
        if (vue) {
            vue.component.value = value
            if (vue.$emit) {
                vue.$emit('input', value)
                vue.$emit('changed', value)
            }

            const changeEvent = new Event('change', { bubbles: true })
            this.element?.dispatchEvent(changeEvent)

            if (vue.$el) {
                vue.$el.dispatchEvent(changeEvent)    
            }
        } else {
            const input = this.inputElement
            if (input) {
                input.component.value = value
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

    // Set value without triggering interactions (run/emit/axios) but still emit Vue's changed event
    quietSet(value) {
        const vue = this.vueComponent
        if (vue) {
            vue._silentChange = true
            vue.component.value = value
            vue.$emit('changed', value)
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

        return new Proxy(this, {
            get(target, prop) {
                if (typeof prop === 'symbol') return target[prop]
                if (prop in target) return target[prop]
                const vue = target.vueComponent
                if (vue && prop in vue) {
                    const val = vue[prop]
                    return typeof val === 'function' ? val.bind(vue) : val
                }
                return undefined
            }
        })
    }

    get vueComponent() {
        let el = this.element
        for (let depth = 0; depth < 5; depth++) {
            if (el && el.__vue__) return el.__vue__
            el = el ? el.parentElement : null
            if (!el) break
        }
        return null
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

// ==========================================
// HTTP REQUEST HELPER CLASS
// ==========================================

class KompoHttpRequest {
    constructor(kompoHelper, method, target, payload = {}, options = {}) {
        this.$k = kompoHelper
        this.method = method
        this.target = target
        this.payload = payload
        this.options = options
        this._chain = []
        this._promise = null
    }

    // Get just the data from response
    data() {
        return this._execute().then(result => result)
    }

    // Chainable: Show response in modal
    inModal(modalId = null) {
        this._chain.push({ type: 'modal', modalId })
        return this._execute()
    }

    // Chainable: Show response in drawer
    inDrawer() {
        this._chain.push({ type: 'drawer' })
        return this._execute()
    }

    // Chainable: Fill panel with response
    inPanel(panelId) {
        this._chain.push({ type: 'panel', panelId })
        return this._execute()
    }

    // Chainable: Prepend to query
    prependToQuery(queryId, itemId = null) {
        this._chain.push({ type: 'prependToQuery', queryId, itemId })
        return this._execute()
    }

    // Chainable: Append to query
    appendToQuery(queryId, itemId = null) {
        this._chain.push({ type: 'appendToQuery', queryId, itemId })
        return this._execute()
    }

    // Chainable: Update in query
    updateInQuery(queryId, itemId) {
        this._chain.push({ type: 'updateInQuery', queryId, itemId })
        return this._execute()
    }

    // Chainable: Remove from query
    removeFromQuery(queryId, itemId) {
        this._chain.push({ type: 'removeFromQuery', queryId, itemId })
        return this._execute()
    }

    // Chainable: Refresh component
    thenRefresh(kompoid) {
        this._chain.push({ type: 'refresh', kompoid })
        return this._execute()
    }

    // Chainable: Show alert
    thenAlert(message, type = 'success') {
        this._chain.push({ type: 'alert', message, type })
        return this._execute()
    }

    // Make it thenable (await support)
    then(onFulfilled, onRejected) {
        return this._execute().then(onFulfilled, onRejected)
    }

    catch(onRejected) {
        return this._execute().catch(onRejected)
    }

    // Execute the request and process chain
    async _execute() {
        if (this._promise) return this._promise

        this._promise = this._doRequest()
        return this._promise
    }

    async _doRequest() {
        try {
            const url = this._buildUrl()
            const headers = this._buildHeaders()

            let requestConfig = {
                url,
                method: this.method,
                headers,
            }

            // Add data for non-GET requests
            if (this.method !== 'GET') {
                const formData = new FormData()
                const data = this._buildData()
                for (const key in data) {
                    if (Array.isArray(data[key])) {
                        data[key].forEach((item, k) => {
                            formData.append(key + '[' + k + ']', item)
                        })
                    } else if (data[key] !== null && data[key] !== undefined) {
                        formData.append(key, data[key])
                    }
                }
                requestConfig.data = formData
            }

            const response = await axios(requestConfig)

            // Process response chain
            await this._processChain(response)

            // Return just the data
            return response.data
        } catch (error) {
            if (this.options.onError) {
                this.options.onError(error)
            }
            throw error
        }
    }

    _buildUrl() {
        // kompoRoute is always /_kompo - it's the standard Kompo endpoint
        // (See kompo/src/Routing/RouteFinder.php line 137)
        const kompoRoute = '/_kompo'

        if (this.method === 'GET' && Object.keys(this.payload).length > 0) {
            return kompoRoute + '?' + new URLSearchParams(this.payload).toString()
        }

        return kompoRoute
    }

    _buildHeaders() {
        const vue = this.$k.vue
        let kompoInfo = null

        // Get kompoInfo using the same pattern as KompoAxios.$_getKompoInfo()
        // This uses Kompo's event system to get the parent Komponent's encrypted info

        // 1. Check if current component IS a Komponent (has $_kompoInfo computed property)
        //    Elements also have $_kompoInfo if they received 'kompoinfo' prop (e.g., from blade menu)
        if (vue.$_kompoInfo) {
            kompoInfo = vue.$_kompoInfo
        }

        // 2. Use the event system to request from parent Komponent
        // This is how KompoAxios does it - elements have a kompoid that identifies their parent
        if (!kompoInfo && vue.$kompo && vue.kompoid && vue.$_elKompoId) {
            // Trigger the synchronous event chain:
            // vlGetKomponentInfo -> parent Komponent -> vlDeliverKompoInfo -> sets vue.kompoInfo
            vue.$kompo.vlGetKomponentInfo(vue.kompoid, vue.$_elKompoId)
            kompoInfo = vue.kompoInfo
        }

        // 3. Fallback: check if kompoInfo was already set from a previous request
        if (!kompoInfo && vue.kompoInfo) {
            kompoInfo = vue.kompoInfo
        }

        if (!kompoInfo) {
            console.warn('KompoHttpRequest: Could not find X-Kompo-Info.', {
                hasKompoInfo: !!vue.$_kompoInfo,
                hasKompo: !!vue.$kompo,
                kompoid: vue.kompoid,
                elKompoId: vue.$_elKompoId,
            })
        }

        // Look up encrypted method name from component's selfMethods config
        // The PHP component must declare callable methods via $this->selfMethods(['methodName'])
        const encryptedTarget = this._getEncryptedTarget(vue)

        return {
            'X-Kompo-Info': kompoInfo || '',
            'X-Kompo-Action': 'self-method',
            'X-Kompo-Target': encryptedTarget,
        }
    }

    _getEncryptedTarget(vue) {
        // Try to find _selfMethods in the component config
        // Check multiple paths since the component structure varies
        const selfMethods =
            vue.component?.config?._selfMethods ||
            vue.vkompo?.config?._selfMethods ||
            vue.$_config?.('_selfMethods') ||
            null

        if (!selfMethods) {
            throw new Error(
                `selfGet/selfPost: Method "${this.target}" is not declared as callable. ` +
                `Add $this->selfMethods(['${this.target}']) in your Komponent's created() method.`
            )
        }

        const encrypted = selfMethods[this.target]
        if (!encrypted) {
            throw new Error(
                `selfGet/selfPost: Method "${this.target}" is not in the selfMethods list. ` +
                `Available methods: ${Object.keys(selfMethods).join(', ')}`
            )
        }

        return encrypted
    }

    _buildData() {
        let data = { ...this.payload }

        if (this.options.withFormValues) {
            data = { ...data, ...this.$k.form.data() }
        }

        return data
    }

    async _processChain(response) {
        const vue = this.$k.vue
        const kompoid = vue.kompoid || vue.$_elKompoId

        for (const action of this._chain) {
            switch (action.type) {
                case 'modal':
                    // Validate response format for modal
                    if (response.data && !response.data.vueComponent) {
                        console.error('inModal() error: The PHP method must return a Komponent (Form, Panel, Html, etc.) with a vueComponent property. Got:', response.data)
                        throw new Error('inModal() requires the PHP method to return a Komponent component')
                    }
                    // Pass response directly like fillModalNewAction does
                    this.$k.$kompo.vlFillModal(response, action.modalId || kompoid, {})
                    break

                case 'drawer':
                    if (response.data && !response.data.vueComponent) {
                        console.error('inDrawer() error: The PHP method must return a Komponent. Got:', response.data)
                        throw new Error('inDrawer() requires the PHP method to return a Komponent component')
                    }
                    this.$k.$kompo.vlFillDrawer(response, kompoid, {})
                    break

                case 'panel':
                    this.$k.$kompo.vlFillPanel(action.panelId, response.data)
                    break

                case 'prependToQuery':
                    this.$k.$kompo.vlPrependItem(action.queryId, response.data, action.itemId)
                    break

                case 'appendToQuery':
                    this.$k.$kompo.vlAddItem(action.queryId, response.data, 'append', action.itemId)
                    break

                case 'updateInQuery':
                    this.$k.$kompo.vlUpdateItem(action.queryId, action.itemId, response.data)
                    break

                case 'removeFromQuery':
                    this.$k.$kompo.vlRemoveItemById(action.queryId, action.itemId)
                    break

                case 'refresh':
                    this.$k.refresh(action.kompoid)
                    break

                case 'alert':
                    this.$k.alert(action.message, action.type)
                    break
            }
        }

        if (this.options.onSuccess) {
            this.options.onSuccess(response.data, response)
        }
    }
}

// Factory function to create self* methods
function createSelfMethod(kompoHelper, method) {
    return (target, payload = {}, options = {}) => {
        return new KompoHttpRequest(kompoHelper, method, target, payload, options)
    }
}

// ==========================================
// REACTIVE DATA HELPER CLASS
// ==========================================

// Global reactive store for component-scoped data (keyed by component ID)
if (!window._kompoComponentData) {
    window._kompoComponentData = new Vue({
        data: () => ({
            components: {}
        })
    })
}

class KompoDataHelper {
    constructor(vueInstance) {
        this.vue = vueInstance
        this.componentId = vueInstance.$_elKompoId || vueInstance.kompoid || 'default'

        // Initialize store for this component if needed
        if (!window._kompoComponentData.components[this.componentId]) {
            Vue.set(window._kompoComponentData.components, this.componentId, {})
        }
    }

    get _store() {
        return window._kompoComponentData.components[this.componentId]
    }

    set(key, value) {
        Vue.set(this._store, key, value)
        return this
    }

    get(key, defaultValue = null) {
        return this._store[key] !== undefined ? this._store[key] : defaultValue
    }

    has(key) {
        return this._store[key] !== undefined
    }

    delete(key) {
        Vue.delete(this._store, key)
        return this
    }

    increment(key, amount = 1) {
        const current = this.get(key, 0)
        this.set(key, current + amount)
        return this.get(key)
    }

    decrement(key, amount = 1) {
        return this.increment(key, -amount)
    }

    toggle(key) {
        this.set(key, !this.get(key, false))
        return this.get(key)
    }

    push(key, value) {
        const arr = this.get(key, [])
        if (!Array.isArray(arr)) {
            throw new Error(`data.push: "${key}" is not an array`)
        }
        arr.push(value)
        this.set(key, arr)
        return this
    }

    remove(key, value) {
        const arr = this.get(key, [])
        if (!Array.isArray(arr)) {
            throw new Error(`data.remove: "${key}" is not an array`)
        }
        const index = arr.indexOf(value)
        if (index !== -1) {
            arr.splice(index, 1)
            this.set(key, arr)
        }
        return this
    }

    merge(key, obj) {
        const current = this.get(key, {})
        this.set(key, { ...current, ...obj })
        return this
    }

    all() {
        return { ...this._store }
    }

    clear() {
        Object.keys(this._store).forEach(key => {
            Vue.delete(this._store, key)
        })
        return this
    }

    watch(key, callback) {
        return window._kompoComponentData.$watch(
            () => this._store[key],
            (newVal, oldVal) => callback(newVal, oldVal)
        )
    }
}

// ==========================================
// GLOBAL STORE HELPER CLASS
// ==========================================

class KompoStoreHelper {
    constructor() {
        if (!window._kompoStore) {
            window._kompoStore = new Vue({
                data: () => ({
                    store: {}
                })
            })
        }
        this._vue = window._kompoStore
    }

    get _store() {
        return this._vue.store
    }

    set(key, value) {
        Vue.set(this._store, key, value)
        return this
    }

    get(key, defaultValue = null) {
        return this._store[key] !== undefined ? this._store[key] : defaultValue
    }

    has(key) {
        return this._store[key] !== undefined
    }

    delete(key) {
        Vue.delete(this._store, key)
        return this
    }

    increment(key, amount = 1) {
        const current = this.get(key, 0)
        this.set(key, current + amount)
        return this.get(key)
    }

    watch(key, callback) {
        return this._vue.$watch(
            () => this._store[key],
            (newVal, oldVal) => callback(newVal, oldVal)
        )
    }

    namespace(ns) {
        if (!this._store[ns]) {
            Vue.set(this._store, ns, {})
        }
        const store = this._store
        return {
            set: (key, value) => { Vue.set(store[ns], key, value); return this },
            get: (key, def = null) => store[ns][key] !== undefined ? store[ns][key] : def,
            has: (key) => store[ns][key] !== undefined,
            all: () => ({ ...store[ns] }),
        }
    }
}

function buildJsCtx(vueInstance, response = {}) {
    const $k = new KompoHelper(vueInstance, vueInstance.$kompo)

    // Create HTTP helpers
    const selfGet = createSelfMethod($k, 'GET')
    const selfPost = createSelfMethod($k, 'POST')
    const selfPut = createSelfMethod($k, 'PUT')
    const selfDelete = createSelfMethod($k, 'DELETE')

    // Create reactive data helpers
    const data = new KompoDataHelper(vueInstance)
    const store = new KompoStoreHelper()

    // Generic HTTP helper
    const http = {
        get: (url, params = {}) => $k.fetch(url, params, 'GET'),
        post: (url, data = {}) => $k.fetch(url, data, 'POST'),
        put: (url, data = {}) => $k.fetch(url, data, 'PUT'),
        delete: (url, data = {}) => $k.fetch(url, data, 'DELETE'),
    }

    // Current field/element (the one that triggered run())
    const currentField = new KompoFieldHelper($k, vueInstance.$_elementId ? vueInstance.$_elementId() : null)
    currentField._vueComponent = vueInstance

    const currentEl = new KompoElementHelper($k, null, vueInstance.$el)

    const field = new Proxy(
        function(name) { return $k.field(name) },
        {
            get(target, prop) {
                if (typeof prop === 'symbol') return target[prop]
                if (prop === 'prototype' || prop === 'length' || prop === 'name') return target[prop]
                return currentField[prop]
            },
            apply(target, thisArg, args) {
                return target(...args)
            }
        }
    )

    const el = new Proxy(
        function(id) { return $k.el(id) },
        {
            get(target, prop) {
                if (typeof prop === 'symbol') return target[prop]
                if (prop === 'prototype' || prop === 'length' || prop === 'name') return target[prop]
                return currentEl[prop]
            },
            apply(target, thisArg, args) {
                return target(...args)
            }
        }
    )

    // Build rich context with destructurable helpers
    const ctx = {
        // The $k helper (full API)
        $k,

        // Destructurable shortcuts
        field,
        fields: (...names) => $k.fields(...names),
        panel: (id) => $k.panel(id),
        form: $k.form,
        modal: (id) => $k.modal(id),
        query: (id) => $k.query(id),
        el,
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

        // Reactive data (NEW)
        data,
        store,

        // HTTP methods (NEW)
        selfGet,
        selfPost,
        selfPut,
        selfDelete,
        http,

        // Reactive watching
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
        value: currentField.value,
        vue: vueInstance,
        kompoid: vueInstance.kompoid || vueInstance.$_elKompoId,
        config: vueInstance.$_config ? vueInstance.$_config() : {},
        getFormData: () => $k.form.data(),
        setValue: (field, value) => $k.field(field).set(value),
    }

    return ctx
}

// Export for use in Action.js
export {
    KompoHelper,
    KompoFieldHelper,
    KompoFormHelper,
    KompoPanelHelper,
    KompoElementHelper,
    KompoHttpRequest,
    KompoDataHelper,
    KompoStoreHelper,
    buildJsCtx
}

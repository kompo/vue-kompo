<template>
    <section v-if="partial" class="vlPopup" ref="popup">
        <div class="vlPopupClose">
          <button aria-label="Close popup" @click="closeMe">
            <i class="icon-times"/>
          </button>
        </div>
        <div class="resizer top-left"><i class="icon-arrow-combo"/></div>
        <!--<div class="resizer top-right"><i class="icon-arrow-combo"/></div>
        <div class="resizer bottom-left"><i class="icon-arrow-combo"/></div>
        <div class="resizer bottom-right"><i class="icon-arrow-combo"/></div>-->
        <component 
            v-if="partial" :is="partial" 
            :vkompo="component" />
    </section>
</template>

<script>
import HasVueComponent from '../mixins/HasVueComponent'
import EmitsEvents from '../mixins/EmitsEvents'

export default {
    mixins: [HasVueComponent, EmitsEvents],
    props: {
    },
    data(){
        return {
            component: null,
            partial: null
        }
    },
    created(){
        this.$_destroyEvents()
        this.$_attachEvents()
    },
    updated() {
        this.$_destroyEvents()
        this.$_attachEvents()
    },
    methods: {
        closeMe(){
            this.component = null
            this.partial = null
            window.vlLastPopup = null
        },
        insertFromResponse(obj){
            this.component = obj
            this.partial = this.$_komposerTag(obj)

            this.$nextTick(() => {
                this.dragElement(this.$refs.popup)
                this.resizeElement(this.$refs.popup)
            })
        },
        $_attachEvents(){
            this.$_vlOn('vlFillPopup', (response) => {
                window.vlLastPopup = response
                this.insertFromResponse(response.data)
            })
            this.$_vlOn('vlClosePopup', () => {
                this.closeMe()
            })
        },
        $_destroyEvents(){
            this.$_vlOff([
                'vlFillPopup',
                'vlClosePopup',
            ])
        },
        dragElement(elmnt) {
            var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
            if (document.getElementById("vlDragPopUp")) {
                // if present, the header is where you move the DIV from:
                document.getElementById("vlDragPopUp").onmousedown = dragMouseDown;
            } else {
                // otherwise, move the DIV from anywhere inside the DIV:
                elmnt.onmousedown = dragMouseDown;
            }

            elmnt.style.top = elmnt.offsetTop + "px";
            elmnt.style.left = elmnt.offsetLeft + "px";
            elmnt.style.bottom = "auto";
            elmnt.style.right = "auto";

            function dragMouseDown(e) {
                e = e || window.event;
                e.preventDefault();
                // get the mouse cursor position at startup:
                pos3 = e.clientX;
                pos4 = e.clientY;

                document.onmouseup = closeDragElement;
                // call a function whenever the cursor moves:
                document.onmousemove = elementDrag;
            }

            function elementDrag(e) {
                e = e || window.event;
                e.preventDefault();
                // calculate the new cursor position:
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;
                // set the element's new position:
                elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
                elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
            }

            function closeDragElement() {
                // stop moving when mouse button is released:
                document.onmouseup = null;
                document.onmousemove = null;
            }
        },
        resizeElement() {
            /*Make resizable div by Hung Nguyen*/
            const div = '.vlPopup'
            const element = document.querySelector(div);
            const resizers = document.querySelectorAll(div + ' .resizer')
            const minimum_size = 20;
            let original_width = 0;
            let original_height = 0;
            let original_x = 0;
            let original_y = 0;
            let original_mouse_x = 0;
            let original_mouse_y = 0;
            for (let i = 0;i < resizers.length; i++) {
                const currentResizer = resizers[i];
                currentResizer.addEventListener('mousedown', function(e) {
                  e.preventDefault()
                  original_width = parseFloat(getComputedStyle(element, null).getPropertyValue('width').replace('px', ''));
                  original_height = parseFloat(getComputedStyle(element, null).getPropertyValue('height').replace('px', ''));
                  original_x = element.getBoundingClientRect().left;
                  original_y = element.getBoundingClientRect().top;
                  original_mouse_x = e.pageX;
                  original_mouse_y = e.pageY;
                  window.addEventListener('mousemove', resize)
                  window.addEventListener('mouseup', stopResize)
                })
                
                function resize(e) {
                  if (currentResizer.classList.contains('bottom-right')) {
                    const width = original_width + (e.pageX - original_mouse_x);
                    const height = original_height + (e.pageY - original_mouse_y)
                    if (width > minimum_size) {
                      element.style.width = width + 'px'
                    }
                    if (height > minimum_size) {
                      element.style.height = height + 'px'
                    }
                  }
                  else if (currentResizer.classList.contains('bottom-left')) {
                    const height = original_height + (e.pageY - original_mouse_y)
                    const width = original_width - (e.pageX - original_mouse_x)
                    if (height > minimum_size) {
                      element.style.height = height + 'px'
                    }
                    if (width > minimum_size) {
                      element.style.width = width + 'px'
                      element.style.left = original_x + (e.pageX - original_mouse_x) + 'px'
                    }
                  }
                  else if (currentResizer.classList.contains('top-right')) {
                    const width = original_width + (e.pageX - original_mouse_x)
                    const height = original_height - (e.pageY - original_mouse_y)
                    if (width > minimum_size) {
                      element.style.width = width + 'px'
                    }
                    if (height > minimum_size) {
                      element.style.height = height + 'px'
                      element.style.top = original_y + (e.pageY - original_mouse_y) + 'px'
                    }
                  }
                  else {
                    const width = original_width - (e.pageX - original_mouse_x)
                    const height = original_height - (e.pageY - original_mouse_y)
                    if (width > minimum_size) {
                      element.style.width = width + 'px'
                      element.style.left = original_x + (e.pageX - original_mouse_x) + 'px'
                    }
                    if (height > minimum_size) {
                      element.style.height = height + 'px'
                      element.style.top = original_y + (e.pageY - original_mouse_y) + 'px'
                    }
                  }
                }
                
                function stopResize() {
                  window.removeEventListener('mousemove', resize)
                }
            }
        }
    }
}
</script>

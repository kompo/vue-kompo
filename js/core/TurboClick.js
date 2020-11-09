export default class TurboClick {
	constructor(vnode, url){

        this.vnode = vnode

        this.url = url


	}
    getMainVueOptionsRecursively(element){
        return element.$parent ? 
            
            this.getMainVueOptionsRecursively(element.$parent) : 

            element.$options
    }
    getMainVueBootObject(vnode){
        const mainOpts = this.getMainVueOptionsRecursively(vnode.context)

        return Object.assign(
            {el: mainOpts.el}, 
            mainOpts.vuetify ? {vuetify: mainOpts.vuetify} : {}
        )
    }
    trigger(){
        axios.get(this.url).then(r => {
                            
            //parse the GET response HTML
            const doc = new DOMParser().parseFromString(r.data, "text/html")

            document.title = doc.title
            document.getElementsByTagName('body')[0].innerHTML= doc.getElementsByTagName('body')[0].innerHTML
            
            new Vue(this.getMainVueBootObject(this.vnode))

            Array.from(doc.getElementsByClassName('komposer-script')).forEach((scriptString) => {
                let script = document.createElement('script')
                script.textContent = scriptString.textContent
                document.head.appendChild(script)
            })

            //Re-run scripts with the class .reloadable-script
            //Kompo.events.$nextTick( () => { //nextTick not enough because of anonymous component in Panel {template: ...}
            setTimeout( () => { //TODO better solution
                Array.from(doc.getElementsByClassName('reloadable-script'))
                    .forEach((script) => { eval(script.innerHTML) })
            }, 400)

            //Change the browser's url and reload if back is pressed
            const responseURL = r.request.responseURL
            window.history.pushState({url: responseURL}, "", responseURL)
            window.onpopstate = function(e) {location.reload()} //for back button

        }).catch(e => {
            console.log('Error loading object in Panel:' + e)
        })
    }
}
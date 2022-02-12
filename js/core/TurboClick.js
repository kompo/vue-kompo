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

        let sidebarScoll = this.getLeftSidebar() ? this.getLeftSidebar().scrollTop : 0 //preserve scroll
        _kompo.toggleSpinner('block')
        axios.get(this.url).then(r => {

            _kompo.toggleSpinner('none')
                            
            this.displayResponse(r)

            if (this.getLeftSidebar()) {
                this.getLeftSidebar().scrollTop = sidebarScoll
            }

        }).catch(e => {

            _kompo.toggleSpinner('none')

            if(e.response.status === 401){
                window.location.href = this.url //Full redirect to login page 
                /*
                Removed this since a trigger is a deliberate will to go elsewhere, so no confirmation is needed...
                if(confirm(window._kompo.sessionTimeoutMessage)){
                    if (this.url !== window.location.href) {
                        window.location.href = this.url
                    } else {
                        window.location.reload()

                    }
                }*/
            }


            console.log('Error loading object in Panel:' + e)
        })
    }
    getLeftSidebar(){
        return document.querySelector('.vl-sidebar-l')
    }
    displayResponse(r){
        //parse the GET response HTML
        const doc = new DOMParser().parseFromString(r.data, "text/html")

        document.title = doc.title
        document.getElementsByTagName('body')[0].innerHTML= doc.getElementsByTagName('body')[0].innerHTML

        window._kompo.echo.forEach((spec) => {
            Echo.private(spec.channel).stopListening(spec.message)
        })

        window._kompo.komponents = [] //reset live komponents
        
        const newVue = new Vue(this.getMainVueBootObject(this.vnode)) //TODO: destroy the app first because the old komponents are staying in memory...

        //Reload last Popup if available
        if(window.vlLastPopup)
            newVue.$kompo.vlFillPopup(window.vlLastPopup)

        Array.from(doc.getElementsByClassName('komponent-script')).forEach((scriptString) => {
            let script = document.createElement('script')
            script.textContent = scriptString.textContent
            document.head.appendChild(script)
        })

        //Re-run scripts with the class .reloadable-script
        //Kompo.events.$nextTick( () => { //nextTick not enough because of anonymous component in Panel {template: ...}
        setTimeout( () => { //TODO better solution
            Array.from(doc.getElementsByClassName('reloadable-script'))
                .forEach((script) => { 
                    if(script.src){
                        var s = document.createElement('script')
                        s.setAttribute('src', script.src)
                        document.body.appendChild(s)
                    }else{
                        eval(script.innerHTML) 
                    }
                })
        }, 400)

        //Change the browser's url and reload if back is pressed
        const responseURL = r.request.responseURL
        window._kompo.history.push(responseURL)
        window.history.pushState({url: window._kompo.history}, "", responseURL)
        window.onpopstate = (e) => {

            if (!e.state) { //pure #url-hashes are triggering popstate... this isolates them
                return;
            }

            window._kompo.history.pop() //remove current url
            let lastUrl = window._kompo.history.pop() //get previous url
            
            console.log(lastUrl)

            if(!lastUrl) //if no more history from kompo, default to browser's list
                return history.go(-1)

            this.url = lastUrl //otherwise trigger a turbo click to previous url
            this.trigger()
        } //for back button
    }
}
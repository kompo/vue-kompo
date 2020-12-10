export default {
	methods: {
        $_isMobile(){
            return getComputedStyle(document.getElementById('vl-md')).display === 'block'
        }
    }
}
export default {
    methods: {
        hashCode(obj){
            //Attempt to get a unique key for the item 
            //not perfect to review but works 99% of the time 
            //and the user has nothing to do on his side
            var str = JSON.stringify(obj).substr(0, 500)
            var hash = 0, i, chr;
            for (i = 0; i < str.length; i++) {
              chr   = str.charCodeAt(i);
              hash  = ((hash << 5) - hash) + chr;
              hash |= 0; // Convert to 32bit integer
            }
            return hash;
        },
    }
}

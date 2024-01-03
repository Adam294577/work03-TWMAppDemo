
window.onload = () =>{

    const {createApp, ref, reactive, computed, watch, onMounted , onUpdated} = Vue
    const App = {

        setup(){
            const PageData = reactive({is:[
                {idx:0, key:'index'},
                {idx:1, key:'detail'},
            ]})
            const nowPageIs = ref('index')
            const Index_Page = ref(4)
            const handIndex_Page = (el = null,num) =>{Index_Page.value = num}
            const Index_header_height = computed(()=>{
                let h = 0

                if(Index_Page.value === 1){
                    h = 60
                }
                if(Index_Page.value === 3){
                    h  = 50
                }
                if(Index_Page.value === 2 || Index_Page.value === 4){
                    h  = 55
                }
                return `height:${h}px`
            })
            const Service_Page = ref(2)
            const handService_Page = (el = null,num)  =>{Service_Page.value = num}
            const Service_Nav_bar = computed(()=>{
                let result = {width:'', posX:''}
                if(Service_Page.value === 1){
                    result.width = `width: 4.2rem;`
                    result.posX = `transform: translateX(1.3rem);`
                }
                if(Service_Page.value === 2){
                    result.width = `width: 4.2rem;`
                    result.posX = `transform: translateX(8.2rem);`
                }
                if(Service_Page.value === 3){
                    result.width = `width: 2.1rem;`
                    result.posX = `transform: translateX(15.1rem);`
                }
                if(Service_Page.value === 4){
                    result.width = `width: 3.15rem;`
                    result.posX = `transform: translateX(19.9rem);`
                }


                return result
                
            })
            const Setting_Page = ref(1)
            const handSetting_Page = (el = null,num)  =>{Setting_Page.value = num}       
            const Setting_Nav_bar = computed(()=>{
                let result = {width:'', posX:''}
                if(Setting_Page.value === 1){
                    result.width = `width: 4.2rem;`
                    result.posX = `transform: translateX(2rem);`
                }
                if(Setting_Page.value === 2){
                    result.width = `width: 4.2rem;`
                    result.posX = `transform: translateX(10.1rem);`
                }
                if(Setting_Page.value === 3){
                    result.width = `width: 4.2rem;`
                    result.posX = `transform: translateX(18.2rem);`
                }
                return result
                
            })   

           
            return{
                Index_header_height,
                Index_Page,
                handIndex_Page,
                Service_Page,
                Service_Nav_bar,
                handService_Page,
                Setting_Page,
                Setting_Nav_bar,              
                handSetting_Page,
                
            }   
        },

    }
    createApp(App).mount("#app")     

}



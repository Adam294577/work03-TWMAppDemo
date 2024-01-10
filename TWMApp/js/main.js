
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
            // index-ListData
            const handListDataUrl = (data) =>{
                if(data.length === 0) return []
                let key = data.key
                let list = data.list
                list = list.map(item=>{
                    let url = `./img/list/${key}-${item.UrlIdx}.png`
                    item.url = url
                    return item

                })
                data.list = list
                return data

            }
            // 服務-便利收
            const Service_ConvenientData = reactive({is:[]})
            // 服務-其他服務
            const Service_OthersData = reactive({is:[]})
            // 服務-優惠申辦
            const Service_PreferentialApplication = reactive({is:[]})
            // 服務-其他查詢
            const Service_Search = reactive({is:[]})
            // 服務-預付卡
            const Service_PrepaidCard = reactive({is:[]})
            // 設定-帳務設定
            const Setting_bill = reactive({is:[]})
            // 設定-門號設定
            const Setting_phone = reactive({is:[]})
            // 設定-基本設定
            const Setting_general = reactive({is:[]})

            const Service_ConvenientRender = computed(()=>{
                let data = Service_ConvenientData.is
                data = handListDataUrl(data)
                return data.list
            })
            const Service_OthersDataRender = computed(()=>{
                let data = Service_OthersData.is
                data = handListDataUrl(data)
                return data.list
            })
            const Service_PreferentialApplicationRender = computed(()=>{
                let data = Service_PreferentialApplication.is
                data = handListDataUrl(data)
                return data.list
            })
            const Service_SearchRender = computed(()=>{
                let data = Service_Search.is
                data = handListDataUrl(data)
                return data.list
            })
            const Service_PrepaidCardRender = computed(()=>{
                let data = Service_PrepaidCard.is
                data = handListDataUrl(data)
                return data.list
            })
            const Setting_billRender = computed(()=>{
                let data = Setting_bill.is
                data = handListDataUrl(data)
                return data.list
            })
            const Setting_phoneRender = computed(()=>{
                let data = Setting_phone.is
                // data = handListDataUrl(data)
                return data.list
            })
            const Setting_generalRender = computed(()=>{
                let data = Setting_general.is
                data = handListDataUrl(data)
                return data.list
            })

           onMounted(()=>{
            axios.get('./api/homeListData.json').then(res=>{
                console.log('listApi:',res.data);
                Service_ConvenientData.is = res.data.service[0]
                Service_OthersData.is = res.data.service[1]
                Service_PreferentialApplication.is = res.data.service[2]
                Service_Search.is = res.data.service[3]
                Service_PrepaidCard.is = res.data.service[4]
                Setting_bill.is = res.data.setting[0]
                Setting_phone.is = res.data.setting[1]
                Setting_general.is = res.data.setting[2]

            }).catch(err=>{
                console.log('沒接到Api');
            })
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

                Service_ConvenientRender,
                Service_OthersDataRender,
                Service_PreferentialApplicationRender,
                Service_SearchRender,
                Service_PrepaidCardRender,
                Setting_billRender,
                Setting_phoneRender,
                Setting_generalRender,
                
            }   
        },

    }
    createApp(App).mount("#app")     

}



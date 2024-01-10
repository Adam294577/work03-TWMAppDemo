
window.onload = () =>{

    const {createApp, ref, reactive, computed, watch, onMounted , onUpdated} = Vue
    const App = {

        setup(){
            // 載入的時間
            const nowTimeIs = ref()
            // 開啟網頁時 抓取現在時間
            function getNowTime(){
                let nowtime = Date()
                nowTimeIs.value = dayjs(nowtime).format('YYYY/MM/DD hh:mm')
            }            
            const InternetUsageDateRender = computed(()=>{
                getNowTime()
                return `上網用量更新: ${nowTimeIs.value}`
            })
            const PageData = reactive({is:[
                {idx:0, key:'index'},
                {idx:1, key:'detail'},
                {idx:2, key:'login'},
            ]})
            const Detail_Is = ref('登入訪客用')
            const Detail_Header = ref({backBtn:'', title:''})

            const DarkBlock = ref(false)

            const PhoneScrollBar = ref(null)
            const ChangePhoneStatus = ref(false)
            const handChangePhoneStatus = () =>{
                DarkBlock.value = !DarkBlock.value
                ChangePhoneStatus.value = !ChangePhoneStatus.value            
                // 判断当前滚轮事件状态
                    PhoneScrollBar.value.addEventListener('wheel', function (e) {
                        if (ChangePhoneStatus.value) {
                            console.warn('禁止滾動');
                            e.preventDefault();
                        }
                    }); 
                
            }
            // const ClearChangePhoneStatus = () =>{
            //     DarkBlock.value = false
            //     ChangePhoneStatus.value = false  
            //     PhoneScrollBar.value.addEventListener('wheel', function (e) {
            //         if (ChangePhoneStatus.value) {
            //             e.preventDefault();
            //         }
            //     });                       
            // }


            const handPageData = (el = null ,key, detailInfo = ['backBtn', 'title','detailIs'])=>{
                nowPageIs.value = key
                if(key === 'detail'){
                    Detail_Header.value.backBtn = detailInfo[0]
                    Detail_Header.value.title = detailInfo[1]
                    Detail_Is.value = detailInfo[2]
                    // console.log(Detail_Header.value);
                }

                if(Detail_Is.value === '管理登入門號'){
                    DarkBlock.value = false
                    ChangePhoneStatus.value = false
                }
            }
            const NoticeBool = ref(false)
            const NoticeMsg = ref({key: '新增登入門號' , title:'新增登入門號' , height: `height: 240px`})
            const handNoticeData = (el = null , arr = ['key', 'title' , 'height'] ) => {
                DarkBlock.value = true
                NoticeBool.value = true
                NoticeMsg.value.key = arr[0]
                NoticeMsg.value.title = arr[1]
                NoticeMsg.value.height = `height:${arr[2]}px`
                
            }
            const ClearNoticeMsg = () =>{
                if(!NoticeBool.value) return
                DarkBlock.value = false
                NoticeBool.value = false
            }
            const nowPageIs = ref('login')
            const nowVersion = ref('9.12.1')
            const Index_Page = ref(1)
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
            // 國內行動上網 -通話量收合
            const CallUsageOpen = ref(false)
            const handCallUsageOpen = ()=>{
                CallUsageOpen.value = !CallUsageOpen.value
            }

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
            // 訪客用-其他服務
            const Login_OthersServiceData = reactive({is:[]})

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
            const Login_OthersServiceRender = computed(()=>{
                let data = Login_OthersServiceData.is
                data = handListDataUrl(data)
                return data.list
            })

           onMounted(()=>{
            axios.get('./api/homeListData.json').then(res=>{
                // console.log('listApi:',res.data);
                Service_ConvenientData.is = res.data.service[0]
                Service_OthersData.is = res.data.service[1]
                Service_PreferentialApplication.is = res.data.service[2]
                Service_Search.is = res.data.service[3]
                Service_PrepaidCard.is = res.data.service[4]
                Setting_bill.is = res.data.setting[0]
                Setting_phone.is = res.data.setting[1]
                Setting_general.is = res.data.setting[2]
                Login_OthersServiceData.is = res.data.login[0]

            }).catch(err=>{
                console.log('沒接到Api');
            })

           
    

           })

            return{
                InternetUsageDateRender,
                DarkBlock,
                nowVersion,
                // 手機scroll
                PhoneScrollBar,
                ChangePhoneStatus,
                handChangePhoneStatus,
                // 顯示區域
                handPageData,
                nowPageIs,

                Index_header_height,
                Index_Page,
                handIndex_Page,

                Detail_Is,
                Detail_Header,

                Service_Page,
                Service_Nav_bar,
                handService_Page,
                Setting_Page,
                Setting_Nav_bar,              
                handSetting_Page,
                // 國內行動上網 -通話量收合
                CallUsageOpen,
                handCallUsageOpen,
                
                Service_ConvenientRender,
                Service_OthersDataRender,
                Service_PreferentialApplicationRender,
                Service_SearchRender,
                Service_PrepaidCardRender,
                Setting_billRender,
                Setting_phoneRender,
                Setting_generalRender,
                Login_OthersServiceRender,
                
                handNoticeData,
                ClearNoticeMsg,
                NoticeMsg,
                NoticeBool,
            }   
        },

    }
    createApp(App).mount("#app")    
    


}



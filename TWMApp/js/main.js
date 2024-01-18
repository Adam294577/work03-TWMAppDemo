
window.onload = () =>{

    const {createApp, ref, reactive, computed, onMounted} = Vue
    const App = {

        setup(){
            // 載入的狀態
            const nowTimeIs = ref()
            const nowPageIs = ref('login')
            const nowVersion = ref('9.12.1')
            const Index_Page = ref(1) 
            // 開啟網頁時 抓取現在時間
            function getNowTime(){
                let nowtime = Date()
                nowTimeIs.value = dayjs(nowtime).format('YYYY/MM/DD hh:mm')
            }            
            const InternetUsageDateRender = computed(()=>{
                getNowTime()
                return `上網用量更新: ${nowTimeIs.value}`
            })

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
            const ClearChangePhoneStatus = () =>{
                DarkBlock.value = false
                ChangePhoneStatus.value = false  
                PhoneScrollBar.value.addEventListener('wheel', function (e) {
                    if (ChangePhoneStatus.value) {
                        e.preventDefault();
                    }
                });                       
            }

            const NoticeBool = ref(false)
            // demo notice
            // const NoticeMsg = ref({key: '刪除登入門號' , title:'刪除登入門號' , height: `height:${100}px`})
            const NoticeMsg = ref({key: '' , title:'' , height: ``})
            const handNoticeData = (el = null , arr = ['key', 'title' , 'height'] ,callback) => {
                DarkBlock.value = true
                NoticeBool.value = true
                NoticeMsg.value.key = arr[0]
                NoticeMsg.value.title = arr[1]
                NoticeMsg.value.height = `height:${arr[2]}px`
                // callback
                if (arr[0] === "刪除登入門號_from管理登入門號"){
                    handSelect_Delete_UserPhone(callback)
                }
                if( arr[0] === "刪除登入門號_from台灣大客服"){
                    handSelect_Delete_UserPhone(callback)
                }
                if( arr[0] === "刪除登入門號_selector"){
                    let ListHeight  = 0
                    UserPhoneDataRender.value.forEach(item=>{
                        if(!item.self) ListHeight++
                    })
                    NoticeMsg.value.height = `height:${ 50 + ListHeight * 53}px`
                }
            }
            const ClearNoticeMsg = () =>{
                if(!NoticeBool.value) return
                DarkBlock.value = false
                NoticeBool.value = false
                Select_Delete_UserPhone.value.Is = []
            }

            const LoginPageIs = ref('login_start')
            const LoginPageArr = reactive({data:[ 'login_start','login_password','login_selfphone' ]})
            const DetailInfoArr = reactive({data:[
                {key:'d_本期帳單', arr:['index','本期帳單','本期帳單']},
                {key:'d_台灣大客服', arr:['login','台灣大客服','台灣大客服']}
            ]})
            const handPageData = (el = null  ,key, detailInfo = ['backBtn', 'title','detailIs'], callback = null )=>{
                DarkBlock.value = false
                NoticeBool.value = false
                nowPageIs.value = key

                LoginPageArr.data.forEach(item=>{
                    if(item === key){
        
                        LoginPageIs.value = key
                        nowPageIs.value = 'login'
                    }
                })
                DetailInfoArr.data.forEach(item=>{
                    if(item.key === key){
                        detailInfo[0] = item.arr[0]
                        detailInfo[1] = item.arr[1]
                        detailInfo[2] = item.arr[2]
                        nowPageIs.value = 'detail'
                    }
                })
                if(nowPageIs.value === 'detail'){
                   
                    Detail_Header.value.backBtn = detailInfo[0]
                    Detail_Header.value.title = detailInfo[1]
                    Detail_Is.value = detailInfo[2]
                }

                // 特殊處理
                if(Detail_Is.value === '管理登入門號'){
                    DarkBlock.value = false
                    ChangePhoneStatus.value = false
                }
                if(callback === 'notice_選擇繳款方式'){
                    handNoticeData(null,['選擇繳款方式','選擇繳款方式',370])
                }
            }
            // 情境調整
            
            const SituationData_login = reactive(
                {Is:[
                    {idx:0,key:'page名稱', title:'情境標題01', choice:['情境選擇01','情境選擇02'] , status:'目前情境'},
                    {idx:1,key:'login_start', title:'其他門號登入過', choice:['有(5組)','無'] , status:'有(5組)', },
                    {idx:2,key:'login_start', title:'本機門號登入過', choice:['有','無'] , status:'有', },
                    {idx:3,key:'login_password', title:'登入狀況', choice:['登入成功(本機)'] , status:'none', },
                    {idx:4,key:'login_selfphone', title:'登入狀況', choice:['登入成功(本機)'] , status:'none', },
                ]})
            const SituationData_detail = reactive(
                {Is:[
                    {key:'管理登入門號', title:'登入門號數', choice:['6組(滿)','1組(只有本機)'] , status:'none'},
                ]})
            const SituationLinkRender = computed(()=>{
                let key = nowPageIs.value
                let result = []
                if(key === 'login'){
                    result = SituationData_login.Is.filter(item=>{
                        if(LoginPageIs.value === item.key) return item
                    })
                }
                if(key === 'detail'){
                    result = SituationData_detail.Is.filter(item=>{
                        if(Detail_Is.value === item.key) return item
                    })
                }


                return result
            })   
            const handSituationFn = (el = null ,  Title = '選項標題', Cont = '選項內容' ) =>{
                let key = nowPageIs.value
                if(key === 'login'){
                    // class active
                    SituationData_login.Is.forEach(item=>{
                        if(Title === item.title){
                            item.status = Cont
                        }
                        if(Title === "登入狀況") item.status = 'none'
                    })
                    // Fn
                    if(Title === "登入狀況" && Cont === '登入成功(本機)' )   {
                        if(!hasOtherLoginPhone.value){
                            UserPhoneData.Is = [{idx:0, Num:'0930177724',hideNum:'09301***24', used: true, self: true},]
                            handPageData(null,'index')
                        }else{
                            let self_PhoneDeleted = true
                            UserPhoneData.Is.forEach(item=>{
                                if(item.idx === 0) self_PhoneDeleted = false
                            })
                            // 若本機已被刪除  需要把資料加回 才不會登入報錯
                            if(self_PhoneDeleted){
                                UserPhoneData.Is.unshift({idx:0, Num:'0930177724',hideNum:'09301***24', used: true, self: true})
                            }
                            UserPhoneData.Is.forEach(item=>{
                                item.used = false
                                if(item.idx === 0) item.used = true
                            })
                            handPageData(null,'index')
                        }
                    }
                    if(Title === "其他門號登入過" && Cont === '有(5組)' ) return situaton_LoginPhonestatus(Cont)
                    if(Title === "其他門號登入過" && Cont === '無' ) return situaton_LoginPhonestatus(Cont)
                    if(Title === "本機門號登入過" && Cont === '有' ) return situaton_SelfPhonestatus(Cont)
                    if(Title === "本機門號登入過" && Cont === '無' ) return situaton_SelfPhonestatus(Cont)
                }

                if(key === 'detail'){
                     // class active
                    SituationData_detail.Is.forEach(item=>{
                        if(Title === item.title){
                            item.status = Cont
                        }
                        if(Title === "登入門號數") item.status = 'none'
                    })
                     // Fn
                     if(Title === "登入門號數" && Cont === '6組(滿)' ){
                        UserPhoneData.Is.forEach(item=>{
                            item.used = false
                            if(item.idx === 0)  item.used = true
                        })
                        situaton_PhoneDataCount(Cont)
                     }  
                     if(Title === "登入門號數" && Cont === '1組(只有本機)' ){
                        situaton_PhoneDataCount(Cont)
                     }
                }
                
            }
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
            // 本期帳單
            const CurrentBillData = reactive({Is:[]})
            const CurrentBillRender = computed(()=>{
                let data  = CurrentBillData.Is
                return data
            })
            const handCurrentBill_ListOpen = (el, api_idx) =>{
                let data  = CurrentBillData.Is
                data.forEach(item=>{
                    if(item.idx === api_idx) item.detailListOpen = !item.detailListOpen
                })
            }
            // 登入門號
            const UserPhoneData = reactive({Is:[
                {idx:0, Num:'0930177724',hideNum:'09301***24', used: true, self: true},
                {idx:1, Num:'0922477753',hideNum:'09224***53', used: false, self: false},
                {idx:2, Num:'0927577798',hideNum:'09275***98', used: false, self: false},
                {idx:3, Num:'0920777729',hideNum:'09207***29', used: false, self: false},
                {idx:4, Num:'0929188824',hideNum:'09291***24', used: false, self: false},
                {idx:5, Num:'0929188827',hideNum:'09291***27', used: false, self: false},
            ]})
            const UserPhoneDataRender = computed(()=>{
                let data = UserPhoneData.Is
                return data
            })
            const NowUsedPhoneDataRender = computed(()=>{
                let data = UserPhoneData.Is
                let result  = []
                result  = data.filter(item=>{
                    if(item.used === true) return item
                })
                return result[0]
            })

            const DefaultPhoneData = reactive({Is:[
                {idx:0, Num:'0930177724',hideNum:'09301***24', used: true, self: true},
                {idx:1, Num:'0922477753',hideNum:'09224***53', used: false, self: false},
                {idx:2, Num:'0927577798',hideNum:'09275***98', used: false, self: false},
                {idx:3, Num:'0920777729',hideNum:'09207***29', used: false, self: false},
                {idx:4, Num:'0929188824',hideNum:'09291***24', used: false, self: false},
                {idx:5, Num:'0929188827',hideNum:'09291***27', used: false, self: false},
            ]})
            const UserPhoneMaxCountBool = computed(()=>{ 
                let count = 0
                UserPhoneData.Is.forEach(item=>{
                    if(item.self === false) count++
                })
                return (count === 5) ? true : false
             })
            const Select_Delete_UserPhone = ref({Is:[]})
            const handSelect_Delete_UserPhone = (idx) =>{
                idx = Number(idx)
                Select_Delete_UserPhone.value.Is = []
                UserPhoneData.Is.forEach(item=>{
                    if(item.idx === idx){
                    Select_Delete_UserPhone.value.Is.push(item)
                    } 
                })
                console.log('已選擇刪除的門號:',Select_Delete_UserPhone.value.Is);
            }
            const Delete_UserPhoneData  = () =>{
                let DeleteArr = []
                console.log('原本門號資料',UserPhoneData.Is);
                // 刪除選擇的門號
                DeleteArr = UserPhoneData.Is.map(item=>{
                    if(item.idx !== Select_Delete_UserPhone.value.Is[0].idx){
                        return item
                    }else{
                        if(item.idx !== 0){
                            SituationData_login.Is[1].status = 'none'
                        }
                        if(item.idx === 0){
                            SituationData_login.Is[2].status = '無'
                            SelfPhoneLoginedBool.value = false
                        }
                        return "delete"
                    }
                })
                UserPhoneData.Is.forEach(item=>{
                    let idx = null
                    idx  = item.idx 
                    if(idx === 0) 
                    if(item.self) return
                })
                
      
                Select_Delete_UserPhone.value.Is = []


                // 重組門號資料
                UserPhoneData.Is = []
                DeleteArr.forEach(item=>{
                    if(item !== "delete") UserPhoneData.Is.push(item)
                })
                ClearNoticeMsg()

                if(!hasOtherLoginPhone.value){
                    nowPageIs.value = "login"
                    LoginPageIs.value = "login_start"
                    SituationData_login.Is[1].status = '無'
                }
            }
            // 切換目前登入門號
            const handNowUsedPhoneData = (el, idx) =>{
                UserPhoneData.Is.forEach(item=>{
                    item.used = false
                    if(item.idx === idx)  item.used = true
                })
                ClearChangePhoneStatus()
                handPageData(null,"index")
            }
            const situaton_PhoneDataCount = (key) =>{
                if(key === "6組(滿)"){
                    UserPhoneData.Is = []
                    DefaultPhoneData.Is.forEach(item=>{
                        UserPhoneData.Is.push(item)
                    })
                    UserPhoneData.Is.forEach(item=>{
                        item.used = false
                        if(item.idx ===0) item.used = true
                    })
                    console.log('預設的門號資料:',DefaultPhoneData.Is);
                }
                if(key === "1組(只有本機)"){
                    UserPhoneData.Is = [{idx:0, Num:'0930177724',hideNum:'09301***24', used: true, self: true},]
                }
            }
            const hasOtherLoginPhone = computed(()=>{
                let count = 0
                UserPhoneData.Is.forEach(item=>{
                    if(item.self === false) count++
                })
                return (count !== 0) ? true : false
            })



            const situaton_LoginPhonestatus = (key) =>{
                UserPhoneData.Is = []
                if(key ==="有(5組)"){
                    DefaultPhoneData.Is.forEach(item=>{
                        if(item.self) return
                        UserPhoneData.Is.push(item)
                    })
                }
                
                if(SelfPhoneLoginedBool.value){
                    UserPhoneData.Is.unshift({idx:0, Num:'0930177724',hideNum:'09301***24', used: true, self: true})
                }
                console.log(UserPhoneData.Is);
            }
            // 本機門號登入過
            const SelfPhoneLoginedBool = ref(true)
            const situaton_SelfPhonestatus = (key) =>{

                if(key === "有"){
                    UserPhoneData.Is.forEach(item=>{
                        if(item.idx === 0 ) SelfPhoneLoginedBool.value = true
                    })
                    if(SelfPhoneLoginedBool.value) return
                    UserPhoneData.Is.unshift({idx:0, Num:'0930177724',hideNum:'09301***24', used: true, self: true})
                    SelfPhoneLoginedBool.value = true
                }
                
                if(key === "無"){
                    if(!hasOtherLoginPhone.value){
                        UserPhoneData.Is = []
                        SelfPhoneLoginedBool.value = false
                       return
                    }else{
                         UserPhoneData.Is = []
                        DefaultPhoneData.Is.forEach(item=>{
                            if(item.self) return
                            UserPhoneData.Is.push(item)
                        })
                    }
                    SelfPhoneLoginedBool.value = false
                }
                
            }
            const handLoginBtn = (el = null, key) =>{
                console.log(UserPhoneData.Is);
                if(key === "本機門號"){
                    if(UserPhoneData.Is.length === 0) {
                        nowPageIs.value = 'login'
                        LoginPageIs.value = 'login_selfphone'
                    }
                    if(SelfPhoneLoginedBool.value){
                        UserPhoneData.Is.forEach(item=>{
                            item.used = false
                            if(item.idx === 0 ) item.used = true
                        })
                        handPageData(null,'index')
                    }else{
                        nowPageIs.value = 'login'
                        LoginPageIs.value = 'login_selfphone'
                    }
                }
                if(key === "其他門號"){
                    
                    if(!hasOtherLoginPhone.value){
                        nowPageIs.value = "login"
                        LoginPageIs.value = "login_password"
                    }else{
                       
                        handPageData(null,'detail',['login',"台灣大客服","台灣大客服"])
                        LoginPageIs.value = "login_start"
                    }
                }
                if(key === "新增門號"){
                    if(!hasOtherLoginPhone.value){
                        nowPageIs.value = "login"
                        LoginPageIs.value = "login_password"
                        ClearNoticeMsg()
                    }else{
                        handPageData(null,'detail',['login',"台灣大客服","台灣大客服"])
                        LoginPageIs.value = "login_start"
                        ClearNoticeMsg()
                    }
                }
                if(key === 'backBtn'){
                    if(!hasOtherLoginPhone.value){
                        handPageData(null,'login_start')
                    }else{
                        handPageData(null,'detail',['login_start',"台灣大客服","台灣大客服"])
                    }
                }
     
            }
            

           onMounted(()=>{
            const api = axios.create({
                baseURL: './api/',
              });

            async function GethomeListData(){
                try{
                    const res = await api.get('homeListData.json')
                    Service_ConvenientData.is = res.data.service[0]
                    Service_OthersData.is = res.data.service[1]
                    Service_PreferentialApplication.is = res.data.service[2]
                    Service_Search.is = res.data.service[3]
                    Service_PrepaidCard.is = res.data.service[4]
                    Setting_bill.is = res.data.setting[0]
                    Setting_phone.is = res.data.setting[1]
                    Setting_general.is = res.data.setting[2]
                    Login_OthersServiceData.is = res.data.login[0]

                }catch{
                    console.log('沒接到 homeListData Api');
                }
            }
            async function GetCurrentBillData(){
                try{
                    const res = await api.get('CurrentBillData.json')
                    CurrentBillData.Is = res.data
                    // console.log(CurrentBillData.Is);
                } catch{
                    console.log('沒接到 CurrentBillData Api');
                }
            }

            GethomeListData()
            GetCurrentBillData()

           })

            return{
                InternetUsageDateRender,
                DarkBlock,
                nowVersion,
                // 手機scroll
                PhoneScrollBar,
                ChangePhoneStatus,
                handChangePhoneStatus,
                ClearChangePhoneStatus,
                // 顯示區域
                handPageData,
                nowPageIs,

                Index_header_height,
                Index_Page,
                handIndex_Page,

                Detail_Is,
                Detail_Header,

                LoginPageIs,

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

                // 情境調整
                SituationLinkRender,
                handSituationFn,
                // 本期帳單
                CurrentBillRender,
                handCurrentBill_ListOpen,
                // 登入門號
                UserPhoneMaxCountBool,
                UserPhoneDataRender,
                NowUsedPhoneDataRender,
                handNowUsedPhoneData,
                Select_Delete_UserPhone,
                Delete_UserPhoneData,
                handLoginBtn,
                hasOtherLoginPhone,
            }   
        },

    }
    createApp(App).mount("#app")    
    


}



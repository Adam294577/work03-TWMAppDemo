
window.onload = () =>{
    const {createApp, ref, reactive, computed, onMounted,onUnmounted} = Vue
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
            // const NoticeMsg = ref({key: '申請通話明細' , title:'申請年月通話明細' , height: `height:${180}px`})
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
                if( arr[0] === "請選擇月份_發票載具"){
                   SelectMonth_InvoiceIdx.value = 0
                }                
                // if( arr[0] === "請選擇月份_近一期帳單"){
                //    SelectMonth_CurrentBillIdx.value = 0
                // }                

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
                {key:'d_過去帳務', arr:['index','本期帳單','本期帳單']},
                {key:'d_台灣大客服', arr:['login','台灣大客服','台灣大客服']},
                {key:'d_超商繳款條碼', arr:['d_本期帳單','超商繳款條碼','超商繳款條碼']},
            ]})
            const DetailBackBtn = ref(true)
            const handPageData = (el = null  ,key, detailInfo = ['backBtn', 'title','detailIs'], callback = null )=>{
                DetailBackBtn.value = true
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
                if(nowPageIs.value === 'historicalBill') Month_CurrentBillIdx.value = 0
                if(nowPageIs.value === 'historicalBill' && callback === '繳款紀錄') handHistoricalBillPage(null,2)
                if(nowPageIs.value === 'historicalBill' && callback === '近一期帳單') handHistoricalBillPage(null,1)
                if( detailInfo[0] === 'noDetailBackBtn')  DetailBackBtn.value = false
                if(Detail_Is.value === '管理登入門號'){
                    DarkBlock.value = false
                    ChangePhoneStatus.value = false
                }
                if(callback === 'notice_選擇繳款方式'){
                    handNoticeData(null,['選擇繳款方式','選擇繳款方式',370])
                }
                if(callback === 'ShopDueAll'){
                    ShopDueBoxIsAll.value = true
                }
                if(Detail_Is.value === '發票資訊'){
                    InvoiceId.value = callback
                }
                if(Detail_Is.value === '繳款內容'){
                    PayRecordUrl.value = callback
                }
                if(Detail_Is.value === '近期帳單費用'){
                    CurrentBillUrl.value = callback
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
            const SituationData_Index = reactive(
                {Is:[
                    {key:'該月帳單狀況', title:'該月帳單狀況', choice:['未繳','已繳'] , status:'未繳'},
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
                if(key === 'index'){
                    result = SituationData_Index.Is.filter(item=>{
                        if(Index_Page.value === 1){
                            return item
                        }
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
                if(key === 'index'){
                    // class active
                    SituationData_Index.Is.forEach(item=>{
                       if(Title === item.title){
                           item.status = Cont
                       }
                   })
                    // Fn
                    if(Title === "該月帳單狀況" && Cont === '未繳' ){
                        IndexBillStatusKey.value = '未繳'
                    }  
                    if(Title === "該月帳單狀況" && Cont === '已繳' ){
                        IndexBillStatusKey.value = '已繳'
                    }
               }
                
            }
            const IndexBillStatus = reactive({data:[
                {key:'未繳',title:'最新應繳金額',cost:'5'},
                {key:'已繳',title:'目前無應繳',cost:'0'},
            ]})
            const IndexBillStatusKey = ref('未繳')
            const IndexBillStatusRender = computed(()=>{
                let key = IndexBillStatusKey.value
                let data = []
                if(IndexBillStatusKey.value === '未繳'){
                    data = IndexBillStatus.data[0]
                }
                if(IndexBillStatusKey.value === '已繳'){
                    data = IndexBillStatus.data[1]
                }
                console.log(data);
                return data
            })
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
            const Service_Page = ref(1)
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
                // console.log(UserPhoneData.Is);
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
            // 超商繳費
            const ShopDueBoxIsAll = ref(true)
            const handShopDueBoxIs = (el = null,key)=>{
                if(key === 'all'){
                    ShopDueBoxIsAll.value = true
                }else{
                    ShopDueBoxIsAll.value = false
                }
            }
            const ATMCopyAlert = ref(false)
 
            const ATMAccountCopy = () =>{
                    // 創建一個文本區域元素
                    let textArea = document.createElement('textarea');
                    
                    // 設置該文本區域的值為欲複製的字串
                    textArea.value = '61001700816176';
                    
                    // 將文本區域元素添加到文檔中
                    document.body.appendChild(textArea);
                    
                    // 選中文本區域的內容
                    textArea.select();
                    
                    // 嘗試複製選中的文本
                    document.execCommand('copy');
                    
                    // 刪除添加的文本區域元素
                    document.body.removeChild(textArea);


                    if(!ATMCopyAlert.value){
                        ATMCopyAlert.value = true
                        setTimeout(()=>{
                            ATMCopyAlert.value = false
                        },2000)                        
                    }
            }
            // 過去帳務
            const HistoricalBillPage = ref(1)
            const handHistoricalBillPage = (el = null,num) =>{
                HistoricalBillPage.value = num
            }
            const HistoricalBillActiveBlock  = computed(()=>{
                let page = HistoricalBillPage.value 
                let result = {move:`translate(0,-50%)`, width: `115px`}
                if(page === 1){
                    result.move = `translate(0,-50%)`
                    result.width = '115px'
                }
                if(page === 2){
                    result.move = `translate(128px,-50%)`
                    result.width = '100px'
                }
                if(page === 3){
                    result.move = `translate(243px,-50%)`
                    result.width = '104px'
                }
                return result
            })
            
            
            // 選擇月份 - 共用參數
            const scrollIng = ref(false)
            const SelectMonth_Click = (el = null , key, data) =>{
                let dataArr = []
                if( data === 'Invoice'){
                    dataArr = SelectMonth_InvoiceList.data
                }
                if( data === 'CurrentBill'){
                    dataArr = SelectMonth_CurrentBillList.data
                }
                let length = dataArr.length
                if(key === 'prev' && data === 'Invoice'){
                    SelectMonth_InvoiceIdx.value--
                    if(SelectMonth_InvoiceIdx.value < 0 ) SelectMonth_InvoiceIdx.value = 0
                }
                if(key === 'next' && data === 'Invoice'){
                    SelectMonth_InvoiceIdx.value++
                    if(SelectMonth_InvoiceIdx.value === length) SelectMonth_InvoiceIdx.value = length -1
                }
                if(key === 'prev' && data === 'CurrentBill'){
                    SelectMonth_CurrentBillIdx.value--
                    if(SelectMonth_CurrentBillIdx.value < 0 ) SelectMonth_CurrentBillIdx.value = 0
                }
                if(key === 'next' && data === 'CurrentBill'){
                    SelectMonth_CurrentBillIdx.value++
                    if(SelectMonth_CurrentBillIdx.value === length) SelectMonth_CurrentBillIdx.value = length -1
                }
              }            
            // 選擇月份 - 發票載具
            const SelectMonth_InvoiceDom = ref(null)
            const Month_InvoiceIdx = ref(0)
            const SelectMonth_InvoiceIdx = ref(0)
            const SelectMonth_InvoiceList = reactive({data:[
                {idx:0,msg:'113年01月' ,bill:[{key:'WR14304536',date:'112年12月'},{key:'WR14304537',date:'113年1月'}]},
                {idx:1,msg:'112年12月' ,bill:[]},
                {idx:2,msg:'112年11月' ,bill:[]},
                {idx:3,msg:'112年10月' ,bill:[]},
                {idx:4,msg:'112年09月' ,bill:[{key:'TF77317805',date:'112年8月'}]},
                {idx:5,msg:'112年08月' ,bill:[]},
            ]})
            const SelectMonth_InvoiceMoveY = computed(()=>{
                let idx = SelectMonth_InvoiceIdx.value
                let result = `transform: translateY(${65 - 50 * idx}px)`
                return result

            })
            const SelectMonth_InvoiceRender = computed(()=>{
                let idx = Month_InvoiceIdx.value
                let data = SelectMonth_InvoiceList.data
                let result = []
                result = data.filter(item=>{
                    if(item.idx === idx) return item
                })
                return result
                
            })
            const SelectMonth_Scroll_Invoice = (e) => {
                let data = SelectMonth_InvoiceList.data
                let length = data.length
                if(!scrollIng.value){
                    scrollIng.value = true
                    if (e.deltaY > 0) {
                        SelectMonth_InvoiceIdx.value++
                        if(SelectMonth_InvoiceIdx.value === length) SelectMonth_InvoiceIdx.value = length -1
                      } else {
                        SelectMonth_InvoiceIdx.value--
                        if(SelectMonth_InvoiceIdx.value < 0 ) SelectMonth_InvoiceIdx.value = 0
                      }
                      setTimeout(()=>{
                        scrollIng.value = false
                      },50)
                }
              };
              const handMonth_InvoiceIdx = (el = null, key) =>{
                Month_InvoiceIdx.value = key
                ClearNoticeMsg()
            }
             // 選擇月份 - 近一期帳單
             const SelectMonth_CurrentBillDom = ref(null)
             const Month_CurrentBillIdx = ref(0)
             const SelectMonth_CurrentBillIdx = ref(0)             
             const SelectMonth_CurrentBillList = reactive({data:[
                {idx:0,msg:'113年01月' ,urlTitle:'113年01月 帳單明細',bill:[
                    {title:'電信費帳單', cost:'$ 5', deadline:'2024/01/22',url:'current電信_202401'}
                ]},
                {idx:1,msg:'112年12月' ,urlTitle:'112年12月 帳單明細',bill:[
                    {title:'電信費帳單', cost:'$ 2', deadline:'暫無需繳款',url:'current電信_202312'},
                ]},
                {idx:2,msg:'112年11月' ,urlTitle:'112年11月 帳單明細',bill:[
                    {title:'電信費帳單', cost:'$ 0', deadline:'暫無需繳款',url:'current電信_202311'},
                    {title:'代收費用', cost:'$ 180', deadline:'2023/11/22',url:'current代收_202311'},
                ]},
                {idx:3,msg:'112年10月' ,urlTitle:'112年10月 帳單明細',bill:[
                    {title:'電信費帳單', cost:'$ 0', deadline:'無需繳款',url:'current電信_202310'},
                    {title:'代收費用', cost:'$ 180', deadline:'暫無需繳款',url:'current代收_202310'},
                ]},
                {idx:4,msg:'112年09月' ,urlTitle:'112年09月 帳單明細',bill:[
                    {title:'電信費帳單', cost:'$ 3', deadline:'2023/09/22',url:'current電信_202309'},
                    {title:'代收費用', cost:'$ 360', deadline:'2023/09/22',url:'current代收_202309'},
                ]},
                {idx:5,msg:'112年08月' ,urlTitle:'112年08月 帳單明細',bill:[
                    {title:'電信費帳單', cost:'$ 3', deadline:'暫無需繳款',url:'current電信_202308'},
                    {title:'代收費用', cost:'$ 180', deadline:'暫無需繳款',url:'current代收_202308'},
                ]},
                {idx:6,msg:'112年07月' ,urlTitle:'112年07月 帳單明細',bill:[
                    {title:'電信費帳單', cost:'$ 5', deadline:'2023/07/22',url:'current電信_202307'},
                    {title:'代收費用', cost:'$ 360', deadline:'2023/07/22',url:'current代收_202307'},
                ]},
                {idx:7,msg:'112年06月' ,urlTitle:'112年06月 帳單明細',bill:[
                    {title:'電信費帳單', cost:'$ 5', deadline:'暫無需繳款',url:'current電信_202306'},
                    {title:'代收費用', cost:'$ 180', deadline:'暫無需繳款',url:'current代收_202306'},
                ]},
                {idx:8,msg:'112年05月' ,urlTitle:'112年05月 帳單明細',bill:[
                    {title:'電信費帳單', cost:'$ 2', deadline:'2023/05/22',url:'current電信_202305'},
                    {title:'代收費用', cost:'$ 797', deadline:'2023/05/22',url:'current代收_202305'},
                ]},
                {idx:9,msg:'112年04月' ,urlTitle:'112年04月 帳單明細',bill:[
                    {title:'電信費帳單', cost:'$ 2', deadline:'暫無需繳款',url:'current電信_202304'},
                    {title:'代收費用', cost:'$ 528', deadline:'暫無需繳款',url:'current代收_202304'},
                ]},
                {idx:10,msg:'112年03月' ,urlTitle:'112年03月 帳單明細',bill:[
                    {title:'電信費帳單', cost:'$ 13', deadline:'2023/03/22',url:'current電信_202303'},
                    {title:'代收費用', cost:'$ 1294', deadline:'2023/03/22',url:'current代收_202303'},
                ]},
                {idx:11,msg:'112年02月' ,urlTitle:'112年02月 帳單明細',bill:[
                    {title:'電信費帳單', cost:'$ 10', deadline:'暫無需繳款',url:'current電信_202302'},
                    {title:'代收費用', cost:'$ 267', deadline:'暫無需繳款',url:'current代收_202302'},
                ]},
            ]})    
            const SelectMonth_CurrentBillMoveY = computed(()=>{
                let idx = SelectMonth_CurrentBillIdx.value
                let result = `transform: translateY(${65 - 50 * idx}px)`
                return result

            })  
            const SelectMonth_CurrentBillRender = computed(()=>{
                let idx = Month_CurrentBillIdx.value
                let data = SelectMonth_CurrentBillList.data
                let result = []
                result = data.filter(item=>{
                    if(item.idx === idx) return item
                })
                return result
            })                
              const SelectMonth_Scroll_CurrentBill = (e) => {
                let data = SelectMonth_CurrentBillList.data
                let length = data.length
                if(!scrollIng.value){
                    scrollIng.value = true
                    if (e.deltaY > 0) {
                        SelectMonth_CurrentBillIdx.value++
                        if(SelectMonth_CurrentBillIdx.value === length) SelectMonth_CurrentBillIdx.value = length -1
                      } else {
                        SelectMonth_CurrentBillIdx.value--
                        if(SelectMonth_CurrentBillIdx.value < 0 ) SelectMonth_CurrentBillIdx.value = 0
                      }
                      setTimeout(()=>{
                        scrollIng.value = false
                      },50)
                }
              };              
            const handMonth_CurrentBillIdx = (el = null, key) =>{
                Month_CurrentBillIdx.value = key
                ClearNoticeMsg()
            }         
            // 發票資訊
            const InvoiceId = ref('')
            // 近期帳單費用
            const CurrentBillUrl = ref('')
            // 繳款紀錄
            const PayRecordIs = ref('bill')
            const PayRecord_bill = reactive({data:[
                {idx:0,date:'2024/01/22',url:'bill_20240122',cost:"5"},
                {idx:1,date:'2023/09/22',url:'bill_20230922',cost:"3"},
                {idx:2,date:'2023/07/24',url:'bill_20230724',cost:"5"},
                {idx:3,date:'2023/05/22',url:'bill_20230522',cost:"2"},
                {idx:4,date:'2023/03/22',url:'bill_20230322',cost:"13"},
                {idx:5,date:'2023/01/30',url:'bill_20230130',cost:"23"},
            ]})
            const PayRecord_behalf = reactive({data:[
                {idx:0,date:'2023/11/22',url:'behalf_20231122',cost:"180"},
                {idx:1,date:'2023/09/22',url:'behalf_20230922',cost:"360"},
                {idx:2,date:'2023/07/24',url:'behalf_20230724',cost:"360"},
                {idx:3,date:'2023/05/22',url:'behalf_20230522',cost:"797"},
                {idx:4,date:'2023/03/22',url:'behalf_20230322',cost:"1294"},
                {idx:5,date:'2023/01/30',url:'behalf_20230130',cost:"178"},              
            ]})
            const PayRecord_project  = reactive({data:[]})
            const PayRecordRender = computed(()=>{
                let key = PayRecordIs.value
                let data = []
                if(key === 'bill') data = PayRecord_bill.data
                if(key === 'behalf') data = PayRecord_behalf.data
                if(key === 'project') data = PayRecord_project.data
                return data
            })
            const PayRecordUrl = ref('')
            const handPayRecordIs = (el=null,key) =>{PayRecordIs.value = key}
            

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

            // 月份選擇
            if(SelectMonth_InvoiceDom.value !== null){
                SelectMonth_InvoiceDom.value.addEventListener('wheel',SelectMonth_Scroll_Invoice)
            }
            if(SelectMonth_CurrentBillDom.value !== null){
                SelectMonth_CurrentBillDom.value.addEventListener('wheel',SelectMonth_Scroll_CurrentBill)
            }

           })
           onUnmounted(()=>{
            SelectMonth_InvoiceDom.value.addEventListener('wheel',SelectMonth_Scroll_Invoice)
            SelectMonth_CurrentBillDom.value.addEventListener('wheel',SelectMonth_Scroll_CurrentBill)
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
                IndexBillStatusRender,

                Detail_Is,
                Detail_Header,
                DetailBackBtn,

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

                // 超商繳費
                ShopDueBoxIsAll,
                handShopDueBoxIs,               
                // ATM
                ATMAccountCopy,
                ATMCopyAlert,
                // 過去帳務
                HistoricalBillPage,
                handHistoricalBillPage,
                HistoricalBillActiveBlock,
                // 選擇月份
                SelectMonth_Click, 
                SelectMonth_Scroll_Invoice,
                SelectMonth_InvoiceDom,
                SelectMonth_InvoiceList,
                SelectMonth_InvoiceRender,
                SelectMonth_InvoiceMoveY,      
                SelectMonth_InvoiceIdx,
                handMonth_InvoiceIdx,  

                SelectMonth_Scroll_CurrentBill,
                SelectMonth_CurrentBillDom,
                SelectMonth_CurrentBillList,
                SelectMonth_CurrentBillRender,
                SelectMonth_CurrentBillMoveY,      
                SelectMonth_CurrentBillIdx,
                handMonth_CurrentBillIdx,  
                // 近期帳單
                CurrentBillUrl,
                // 發票資訊
                InvoiceId,
                // 繳款紀錄
                PayRecordRender,
                PayRecordIs,
                handPayRecordIs,
                PayRecordUrl,
            }   
        },

    }
    createApp(App).mount("#app")    
    


}



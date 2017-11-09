// pages/personal/basic/basic.js
var urlConfig = require("../../../utils/api.js").api;
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ticket:'',
    basic:{},
    name:'',
    gender:'',
    birth_date: '',
    region_name:'',
    region_id:'',
    education:'',
    politics_status:'',
    graduate_year:'',
    contact_mobile: '',
    contact_email:'',
    graduate_school:'',
    detail_major:''
  },
  initFunc:function(){ //基本信息初始化
      var _this = this; 
      wx.request({
        url: urlConfig.getBasicUrl,
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        method: 'POST',
        data:{
          ticket: _this.data.ticket,
          student_id: app.globalData.student_id
        },success:function(res){
            console.log(res);
            if (res.data.returnCode == 0){
               _this.setData({
                 basic: res.data.returnData,
                 name: res.data.returnData.name,
                 gender: res.data.returnData.gender,
                 birth_date: res.data.returnData.birth_date,
                 politics_status: res.data.returnData.politics_status,
                 education: res.data.returnData.education,
                 graduate_year: res.data.returnData.graduate_year,
                 contact_mobile: res.data.returnData.contact_mobile,
                 contact_email: res.data.returnData.contact_email,
                 value_contact_mobile: res.data.returnData.contact_mobile,
                 value_contact_email: res.data.returnData.contact_email,
                 graduate_school: res.data.returnData.graduate_school,
                 detail_major: res.data.returnData.detail_major,
               })
               app.globalData.basicCity.city = res.data.returnData.living_city.region_name;
               app.globalData.basicCity.code = res.data.returnData.living_city.region_id;
               _this.setData({
                 region_name: app.globalData.basicCity.city,
                 region_id: app.globalData.basicCity.code
               })

            }

        }
      }) 
  },
  getTicket: function () { //获取令牌
    var _this = this;
    wx.getStorage({
      key: 'key',
      success: function (res) {
        _this.setData({
          ticket: res.data
        })
        _this.initFunc();
      }
    })
  },
  sex:function(){  //选择性别
    var _this = this;
    wx.showActionSheet({
      itemList: ['男', '女'],
      success: function (res) {
        console.log(res.tapIndex)
        if (res.tapIndex == undefined){
          _this.setData({
            gender: _this.data.gender
          })
        } else{
          var index = res.tapIndex + 1;
          _this.setData({
            gender: index
          })
        }
        
      }
    })
  },
  bindDateChange: function (e) {  //时间选择
    this.setData({
      birth_date: e.detail.value
    })
  },
  bindYearChange: function(e){  //毕业年份
    this.setData({
      graduate_year: e.detail.value
    })
  },
  politicsFunc: function(e){  //政治面貌
    var _this = this;
    wx.showActionSheet({
      itemList: ['党员', '非党员'],
      success: function (res) {
        console.log(res.tapIndex)
        if (res.tapIndex == undefined) {
          _this.setData({
            politics_status: _this.data.politics_status
          })
        } else {
          var index = res.tapIndex + 1;
          _this.setData({
            politics_status: index
          })
        }

      }
    })
  },
  eduFunc: function () {   //学历
    var _this = this;
    wx.showActionSheet({
      itemList: ['大专', '本科', '研究生', '博士'],
      success: function (res) {
        console.log(res.tapIndex)
        if (res.tapIndex == undefined) {
          _this.setData({
            education: _this.data.education
          })
        } else {
          var index = res.tapIndex + 1;
          _this.setData({
            education: index
          })
        }

      }
    })
  },
  bindKeyInput: function(e){
     if (e.target.dataset.type == 'name'){
        this.setData({
          name: e.detail.value
        })
     } else if (e.target.dataset.type == 'school'){
       this.setData({
         graduate_school: e.detail.value
       })
     } else if (e.target.dataset.type == 'major') {
       this.setData({
         detail_major: e.detail.value
       })
     }
  },
  check: function(e){
    if (e.target.dataset.type == 'tel'){
      if (/^[1][3,4,5,7,8][0-9]{9}$/.test(e.detail.value)){
        this.setData({
          contact_mobile: e.detail.value,
          value_contact_mobile: e.detail.value,
        })
      } else{
        this.setData({
          value_contact_mobile: ''
        })
      }
    } else if (e.target.dataset.type == 'email'){
      var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
      if (filter.test(e.detail.value)) {
        this.setData({
          contact_email: e.detail.value,
          value_contact_email: e.detail.value,
        })
      } else {
        this.setData({
          value_contact_email: ''
        })
      }
    }
  },
  submit: function(){
    wx.showToast({
      title: '数据提交中...',
      icon: 'loading',
      duration: 20000
    })
    var _this = this;
     wx.request({
       url: urlConfig.updateInfo,
       header: { "Content-Type": "application/x-www-form-urlencoded" },
       method: 'POST',
       data: {
         ticket: _this.data.ticket,
         student_id: app.globalData.student_id,
         name: _this.data.name,
         gender: _this.data.gender,
         birth_date: _this.data.birth_date,
        //  region_name: _this.data.region_name,
         living_city: _this.data.region_id,
         education: _this.data.education,
         politics_status: _this.data.politics_status,
         graduate_year: _this.data.graduate_year,
         contact_mobile: _this.data.contact_mobile,
         contact_email: _this.data.contact_email,
         graduate_school: _this.data.graduate_school,
         detail_major: _this.data.detail_major
       },success: function(res){
         if (res.data.returnCode == 0){
           wx.redirectTo({
             url: "/pages/resume/resume"
           })
         }
       }
     })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.getTicket(); 
  },
  onUnload: function (options){
    console.log(options)
  }
})
// pages/detail/detail.js
var urlConfig = require("../../utils/api.js").api;
//获取应用实例
var app = getApp();
var id = '';
var shareTitle='';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    ticket:'',
    detail:{},
    descripationText:[],
    isCollect: 1,
    btnStatus : 1,
    rate:0,
    show: false,
    goOn: true,
    shareBg: false,
    low: false,
    location:''
  },
  getDetail:function(){
    var _this = this;
    wx.request({
      url: urlConfig.getDetail,
      method: 'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      data:{
        ticket: _this.data.ticket,
        student_id: app.globalData.student_id,
        id: id
      },success:function(res){
        if (res.data.returnCode == '0'){
          _this.setData({
            detail: res.data.returnData,
            descripationText: _this.format(res.data.returnData.description),
            isCollect: res.data.returnData.collect_status,
            btnStatus: res.data.returnData.can_post,
            rate: res.data.returnData.complete_rate,
            location: res.data.returnData.location,
          })
          shareTitle = res.data.returnData.title;
        } else{
          wx.navigateTo({
            url: '../index/index',
          })
        }
        
      }
    })
  },getTicket: function () { //获取令牌
    var _this = this;
    wx.getStorage({
      key: 'key',
      success: function (res) {
        _this.setData({
          ticket: res.data,
        })
        _this.getDetail();
      }
    })
  },
  format:function(str){ //文本格式
    return str.split('\r\n')
  },
  collect:function(e){ //收藏
    var _this = this;
    if(this.lock()){
        if (e.currentTarget.dataset.id == 1){
          var url = urlConfig.myCollect;
          var title = '收藏成功';
          _this.setData({
            isCollect: 1,
          })
        } else{
          var url = urlConfig.delList;
          var title = '取消收藏';
          _this.setData({
            isCollect: 2,
          })
        }
        
        wx.request({
          url: url,
          method: 'POST',
          header: { "Content-Type": "application/x-www-form-urlencoded" },
          data: {
            ticket: _this.data.ticket,
            student_id: app.globalData.student_id,
            post_id: _this.data.detail.pkid,
            type: 1
          },success:function(res){
            if (res.data.returnCode == '0'){
              wx.showToast({
                title: title,
                icon: 'success',
                duration: 1500
              })
            }
          }
        });
    } else{  //授权
      wx.openSetting({
        success: function (data) {
          console.log(data)
          if (data.authSetting['scope.userInfo']) {
            app.wxAuthor();
          }
        }
      })
    }
  },
  quit: function(){
    this.setData({
      low: false,
    })
  },
  submit:function(){  //提交简历
    var _this = this;
    if (this.lock()) {
      if (this.data.rate > 22 && this.data.rate<=66){
        _this.setData({
          show: true,
          rate: 100
        })
        return false;
      }

      if (this.data.rate <= 22) {
        _this.setData({
          low: true,
        })

        return false;
      }

      wx.request({
        url: urlConfig.deliver,
        method: 'POST',
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        data: {
          ticket: _this.data.ticket,
          student_id: app.globalData.student_id,
          post_id: _this.data.detail.pkid,
          enterprise_id: _this.data.detail.enterprise_id,
          resume_id: _this.data.detail.resume_id,
        }, success: function (res) {
          if (res.data.returnCode == '0') {
            wx.showToast({
              title: '简历投递成功',
              icon: 'success',
              duration: 1500
            })
            _this.setData({
              btnStatus: 2,
            })
          }
        }
      });
    } else {  //授权
      wx.openSetting({
        success: function (data) {
          console.log(data)
          if (data.authSetting['scope.userInfo']) {
            app.wxAuthor();
          }
        }
      })
    }
  },
  lock: function () {
    // console.log(app.globalData.userInfo.user.rawData)
    if (app.globalData.userInfo.user.rawData != undefined) {
      return true;
    } else {
      return false;
    }
  },
  adressFunc: function(){ //地图
    var _this = this;
    var loc = {}
    if (this.data.location != ''){
      loc.x = parseFloat(_this.data.location.split(',')[0])
      loc.y = parseFloat(_this.data.location.split(',')[1])
      wx.openLocation({
        latitude: loc.y,
        longitude: loc.x,
        scale: 28
      })
    } 
    
  },
  share: function(){
    var _this = this;
     this.setData({
       shareBg: true
     })

     setTimeout(function(){
       _this.setData({
         shareBg: false
       })
     },1200)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    id = options.id;
    this.getTicket();
  },
  onShareAppMessage: function (res) {
    var _this = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: shareTitle,
      path: 'pages/detail/detail?id='+id,
      success: function (res) {
        console.log('detail/detail?id=' + id)
      }
    }
  }

})
// pages/bind/bind.js
var urlConfig = require("../../utils/api.js").api;
var app = getApp();
var timer;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tel: '',
    code:'',
    time:60,
    show: true,
    ticket:""
  },
  bind:function(e){
    var _this = this;
    if (e.currentTarget.dataset.type == 'tel'){
       _this.setData({
          tel: e.detail.value
       })
    } else{
       _this.setData({
         code: e.detail.value
      })
    }
  },
  blur: function (e) {
    var _this = this;
    console.log((/^1[34578]\d{9}$/.test(_this.data.tel)));
    if (e.currentTarget.dataset.type == 'tel') {
      if (!(/^1[34578]\d{9}$/.test(_this.data.tel))) {
        wx.showToast({
          title: '手机号码不合法',
          icon: 'danger',
          mask: false,
          image:'/images/danger.png',
          duration: 1500
        })
        _this.setData({
          tel: ''
        })
      } 
    }
  },
  getCode: function(){
    var _this = this;
    if (this.data.tel == ''){
      wx.showToast({
        title: '手机号码空缺',
        icon: 'danger',
        mask: false,
        image: '/images/danger.png',
        duration: 1500
      })
    } else{
      wx.request({
        url: urlConfig.sendSmsCode,
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        method: 'POST',
        data: {
          ticket: _this.data.ticket,
          student_id: app.globalData.student_id,
          registMobile: this.data.tel,
          type: 1,
        }, success: function (res) {
          console.log(res.data);
          if (res.data.returnCode == 0) {
            _this.setData({
              show: false
            })
            _this.timerFunc();
          } else {
            wx.showToast({
              title: res.data.returnDesc,
              icon: 'danger',
              mask: false,
              image: '/images/danger.png',
              duration: 1500
            })
          }

        }
      })
    }
  },
  timerFunc:function(){
    var _this = this;
    setTimeout(function () {
      if (_this.data.time != 0) {
        _this.setData({
          time: _this.data.time - 1
        })
        _this.timerFunc();
      } else {
        _this.setData({
          time: 60,
          show: true,
        })
      }

    }, 1000)
  },
  getTicket: function () { //获取令牌
    var _this = this;
    wx.getStorage({
      key: 'key',
      success: function (res) {
        _this.setData({
          ticket: res.data
        })
      }
    })
  },
  submit: function(){
    var _this = this;
    if (this.data.tel != '' && this.data.code != '' ){
      wx.request({
        url: urlConfig.bindAccount,
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        method: 'POST',
        data: {
          ticket: _this.data.ticket,
          student_id: app.globalData.student_id,
          account_id: app.globalData.account_id,
          mobile: _this.data.tel,
          code: _this.data.code,
          type: 1,
        }, success: function (res) {
          if (res.data.returnCode == 0){
            var pages = getCurrentPages();
            var prevPage = pages[pages.length - 2];  //上一个页面
            var getData = prevPage.getUser();
            wx.navigateBack()
          }
        }
      })
    } else{
      wx.showToast({
        title: "请填写完整信息",
        icon: 'danger',
        mask: false,
        image: '/images/danger.png',
        duration: 1500
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTicket();
  }
})
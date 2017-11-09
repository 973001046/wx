// pages/personal/self/self.js
var urlConfig = require("../../../utils/api.js").api;
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ticket:'',
    text:'',
    textNum: 0,
    show: false,
  },
  initFunc: function(){
    var _this = this;
    wx.request({
      url: urlConfig.dearHr,
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: 'POST',
      data: {
        ticket: _this.data.ticket,
        student_id: app.globalData.student_id
      },
      success: function (res) {
        if (res.data.returnCode == 0) {
          _this.setData({
            text: res.data.returnData.dear_hr
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
  submit:function(){
    var _this = this;
    wx.showToast({
      title: '数据提交中...',
      icon: 'loading',
      duration: 20000
    })
    wx.request({
      url: urlConfig.updateBasicUrl,
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: 'POST',
      data: {
        ticket: _this.data.ticket,
        student_id: app.globalData.student_id,
        dear_hr: _this.data.text
      },
      success: function (res) {
        if (res.data.returnCode == 0) {
          var pages = getCurrentPages();
          var prevPage = pages[pages.length - 2];  //上一个页面
          prevPage.initFuc();
          wx.navigateBack({
            url: "/pages/resume/resume"
          })
        }
      }
    })
    
  },
  bindKeyInput: function (e) {
    if (e.target.dataset.type == 'content') {
      if (e.detail.value == '') {
        this.setData({
          show: false,
        })
      } else {
        this.setData({
          show: true,
        })
      }
      this.setData({
        text: e.detail.value,
        textNum: e.detail.cursor
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTicket()
  }
})
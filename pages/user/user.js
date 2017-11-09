var urlConfig = require("../../utils/api.js").api;
var key='';
var app = getApp();
// pages/user/user.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
     userInfo:[]
  },
  getUser:function(){
    var _this = this;
    wx.request({
      url: urlConfig.getUser,
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: 'POST',
      data: {
        ticket: key,
        student_id: app.globalData.student_id,
      },success: function (res) {
        wx.stopPullDownRefresh();
        if (res.data.returnCode == '0'){
          _this.setData({
            userInfo: res.data.returnData
          });
        } else{
          wx.navigateTo({
            url: '../index/index',
          })
        }
      }
    })
  },
  onPullDownRefresh: function () {
    this.getUser();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    wx.getStorage({
      key: 'key',
      success: function (res) {
        key = res.data;
        _this.getUser();
      }
    })
  },

})
// pages/personal/diplomaList/diplomaList.js
var urlConfig = require("../../../utils/api.js").api;
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ticket: '',
    list: '',
  },
  getList: function () {  //获取列表
    var _this = this;
    wx.request({
      url: urlConfig.cerList,
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: 'POST',
      data: {
        ticket: _this.data.ticket,
        student_id: app.globalData.student_id,
      }, success: function (res) {
        console.log(res.data);
        var obj = res.data.returnData;



        if (res.data.returnData.length > 0) {
          _this.setData({
            list: res.data.returnData
          });
        } else {
          wx.redirectTo({
            url: "/pages/personal/diploma/diploma"
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
        _this.getList();
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTicket();
  }
})
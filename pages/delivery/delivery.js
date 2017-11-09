var urlConfig = require("../../utils/api.js").api;
var app = getApp();
var id = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ticket: '',
    initData: [],
  },
  getInitList: function () {  //收藏列表
    var _this = this;
    wx.request({
      url: urlConfig.record,
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: 'POST',
      data: {
        ticket: _this.data.ticket,
        resume_post_id: id,
      }, success: function (res) {
        console.log(res);
        if (res.data.returnCode == 0) {
            _this.setData({
              initData:res.data.returnData
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
        _this.getInitList();
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    id = options.id;
    this.getTicket();
  },

})
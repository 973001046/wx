var urlConfig = require("../../utils/api.js").api;
//获取应用实例
var app = getApp();
// pages/companey/companey.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    ticket:'',
    id:'',
    info:{},
    list:[],
    show: true
  },
  getTicket: function () { //获取令牌
    var _this = this;
    wx.getStorage({
      key: 'key',
      success: function (res) {
        _this.setData({
          ticket: res.data
        })
        _this.getInit();
      }
    })
  },
  getInit:function(){ //获取企业内容
      var _this = this; 
      wx.request({
        url: urlConfig.enterprise,
        method: 'POST',
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        data:{
          ticket: _this.data.ticket,
          id: _this.data.id
        },success:function(res){
           console.log(res.data);
           if (res.data.returnCode == 0){
              _this.setData({
                info: res.data.returnData.info,
                list: res.data.returnData.list
              })
           }
        }
      })
  },
  showText:function(e){
    var _this = this;
    var way = e.currentTarget.dataset.type;
    if(way == 'up'){
      _this.setData({
        show: false
      })
    } else{
      _this.setData({
        show: true
      })
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({
        id: options.id 
      })
      this.getTicket();
  },

})
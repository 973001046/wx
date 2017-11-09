var urlConfig = require("../../utils/api.js").api;
//获取应用实例
var app = getApp();
var page = 1;
var loadMore = false;
var pageNum = 15;
// console.log()
Page({
  data: {
    motto: 'Hello World',
    userInfo: [],
    ticket:'',
    src:'../../images/banner.jpg',
    scrollHeight: 0,
    loading: true,
    loadMore: false,
    cityInfo:[],
  },
  //事件处理函数
  getInitList: function () { //获取初始化列表
    var ticket = this.data.ticket;
    var _this = this;
    wx.request({
      url: urlConfig.postListUrl, 
      method: 'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      data:{
        ticket: ticket,
        page: page,
        city_id: _this.data.cityInfo.code,
        pageNum: pageNum
      },success: function (res) {
        wx.stopPullDownRefresh();
        var list = _this.data.userInfo;
        if (res.data.returnData.post == undefined){
           wx.redirectTo({
             url: '/pages/index/index',
           })
        }
        if (res.data.returnData.post.length < pageNum){
          loadMore = false;
          _this.setData({
            loading: false,
          })
        }else{
          loadMore = true;
          _this.setData({
            loading: true,
          })
        }
        for (var i = 0; i < res.data.returnData.post.length;i++){
          list.push(res.data.returnData.post[i]);
        }
        _this.setData({
          userInfo: list,
        })
        
      }
    })
  },
  getTicket:function(){ //获取令牌
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
  onReachBottom:function(){ //下拉刷新
    var _this = this;
    if (loadMore){
      loadMore = false;
      page++;
      _this.getInitList()
    }
  },
  adress: function () {  //获取地址
    // if (this.lock()) {
      app.globalData.selectAdressBack = '../index/index';
      wx.navigateTo({
        url: '../adress/adress'
      })
    // } else {
    //   wx.openSetting({
    //     success: function (data) {
    //       console.log(data)
    //       if (data.authSetting['scope.userInfo']) {
    //         app.wxAuthor();
    //       }
    //     }
    //   })
    // }
  },
  search: function () {  //搜索
    // if (this.lock()) {
      wx.navigateTo({
        url: '../search/search'
      })
    // } else {
      // wx.openSetting({
      //   success: function (data) {
      //     console.log(data)
      //     if (data.authSetting['scope.userInfo']) {
      //       app.wxAuthor();
      //     }
      //   }
      // })
    // }
  },
  toUser:function(){  //用户信息
    if ( this.lock() ){
      wx.navigateTo({
        url: '../user/user'
      })
    } else{
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
  lock:function(){
    // console.log(app.globalData.userInfo.user.rawData)
    if (app.globalData.userInfo.user.rawData != undefined){
        return true;
    }else{
        return false;
    }
  },
  onPullDownRefresh: function () {
    this.setData({
      userInfo: []
    })
    this.getInitList();
  },
  onLoad: function () {
    // wx.startPullDownRefresh()
    console.log(app.globalData.userInfo)
    var _this = this;
    this.setData({
      cityInfo: app.globalData.cityInfo
    })
    this.getTicket();
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          scrollHeight: res.windowHeight
        });
      }
    });
  }
})

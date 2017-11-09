// pages/collect/collect.js
var urlConfig = require("../../utils/api.js").api;
var app = getApp();
var page = 1;
var loadMore = true;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ticket:'',
    initList:[],
    total: 0,
    scrollHeight: 0,
    pageLength: 10,
    loading: true
  },
  getInitList:function(){  //收藏列表
    var _this = this;
     wx.request({
       url: urlConfig.collect,
       header: { "Content-Type": "application/x-www-form-urlencoded" },
       method: 'POST',
       data:{
         ticket: _this.data.ticket,
         student_id: app.globalData.student_id,
         page: page,
         pageNumber: _this.data.pageLength
       },success:function(res){
         wx.stopPullDownRefresh();
         var lists = _this.data.initList;
         if (res.data.returnCode == 0){

           res.data.returnData.list.forEach(function(arr){
             lists.push(arr);
           })
           if (res.data.returnData.listTotal < _this.data.pageLength){
             loadMore = false;
             page = 1;
             _this.setData({
               loading: false,
             })
           } else{
             loadMore = true;
             _this.setData({
               loading: true,
             })
           }
            _this.setData({
              initList: lists,
              total: res.data.returnData.listTotal
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
  onReachBottom: function () { //下拉刷新
    var _this = this;
    if (loadMore) {
      loadMore = false;
      page++;
      _this.getInitList()
    }
  },
  onPullDownRefresh: function () {
    this.setData({
      initList: [],
      loading: true
    })
    this.getInitList();
  },
  del: function(e){  //取消收藏
    var _this = this;
    var arr = this.data.initList;
    var id = e.currentTarget.dataset.id;
    var newArr = [];
    var _index = e.currentTarget.dataset.index;
    wx.request({
      url: urlConfig.delCollect,
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: 'POST',
      data: {
        ticket: _this.data.ticket,
        student_id: app.globalData.student_id,
        post_id: id,
        type: 1,
      },success: function(res){
        console.log(res);
        if (res.data.returnCode == 0){
          for(var i = 0; i < arr.length; i++ ){
             if(i != _index ){
                newArr.push(arr[i]);
             }
          }
          _this.setData({
            initList: newArr
          })
          wx.showToast({
            title: '取消收藏',
            icon: 'success',
            mask: true,
            duration: 2000
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          scrollHeight: res.windowHeight
        });
      }
    });
    this.getTicket();
  },

})
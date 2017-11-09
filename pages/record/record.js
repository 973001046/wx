// pages/record/record.js
var urlConfig = require("../../utils/api.js").api;
var app = getApp();
var page = 1;
var loadMore = true;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ticket: '',
    initList: [],
    total: 0,
    scrollHeight: 0,
    pageLength: 10,
    loading: true,
    listType: 1,
    tabIndex: 1
  },
  getInitList: function () {  //列表
    var _this = this;
    wx.request({
      url: urlConfig.resumeList,
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: 'POST',
      data: {
        ticket: _this.data.ticket,
        student_id: app.globalData.student_id,
        type: _this.data.tabIndex,
        page: page,
        pageNumber: _this.data.pageLength
      }, success: function (res) {
        var lists = _this.data.initList;
        wx.stopPullDownRefresh();
        if (res.data.returnCode == 0) {

          res.data.returnData.list.forEach(function (arr) {
            lists.push(arr);
          })
          if (res.data.returnData.listTotal < _this.data.pageLength) {
            loadMore = false;
            page = 1;
            _this.setData({
              loading: false,
            })
          } else {
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
  tab:function(e){  //tab切换
    var index = e.currentTarget.dataset.id;
    loadMore = true;
    this.setData({
      initList: [],
      tabIndex: index,
      loading: true
    })
    this.getInitList();
  },
  onPullDownRefresh: function () {
    this.setData({
      initList: [],
      loading: true
    })
    this.getInitList();
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
// pages/personal/activities/activities.js
var urlConfig = require("../../../utils/api.js").api;
var app = getApp();
var id = '';
var index = '';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    ticket: '',
    show: true,
    showText: false,
    initData: '',
    period: '2008-08-08',
    description: '',
    textNum: 0
  },
  initFunc: function () {
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面
    var getData = prevPage.data.list[index];
    console.log(getData);
    this.setData({
      initData: getData,
      period: getData.period,
      description: getData.description,
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
        if (id != '') {
          _this.initFunc();
        }
      }
    })
  },
  bindDateChange: function (e) {  //时间选择
    if (e.target.dataset.type == 'start') {
      this.setData({
        period: e.detail.value
      })
    }

  },

  bindKeyInput: function (e) {  //输入信息
    if (e.target.dataset.type == 'content') {
      // if (e.detail.value == '') {
      //   this.setData({
      //     show: true,
      //     showText: false
      //   })
      // } else {
      //   this.setData({
      //     show: false,
      //     showText: true
      //   })
      // }
      this.setData({
        description: e.detail.value,
        textNum: e.detail.cursor
      })
    }
  },
  submit: function () {
    var _this = this;
    if (!(_this.data.period != '' && _this.data.description != '')) {
      wx.showToast({
        title: '信息不完整',
        icon: 'loading',
        image: '../../../images/danger.png',
        mask: true,
        duration: 1500
      })
      return false;
    }

    wx.showToast({
      title: '数据提交中...',
      icon: 'loading',
      duration: 20000
    })


    if (id == '') {
      var data = {
        ticket: _this.data.ticket,
        student_id: app.globalData.student_id,
        period: _this.data.period,
        description: _this.data.description,
      }
      var url = urlConfig.addExperience;
    } else {
      var data = {
        ticket: _this.data.ticket,
        student_id: app.globalData.student_id,
        id: _this.data.initData.pkid,
        period: _this.data.period,
        description: _this.data.description,
      }
      var url = urlConfig.uptExperience;
    }

    wx.request({
      url: url,
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: 'POST',
      data: data,
      success: function (res) {
        if (res.data.returnCode == 0) {
          var pages = getCurrentPages();
          var currPage = pages[pages.length - 1];   //当前页面
          var prevPage = pages[pages.length - 2];  //上一个页面
          prevPage.getList();
          wx.navigateBack({
            url: "/pages/personal/educateList/educateList"
          })

        }
      }
    })
  },
  deletes: function () {
    var _this = this;
    wx.request({
      url: urlConfig.delEducation,
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: 'POST',
      data: {
        ticket: _this.data.ticket,
        student_id: app.globalData.student_id,
        id: _this.data.initData.pkid,
      }, success: function (res) {
        if (res.data.returnCode == 0) {
          wx.showToast({
            title: '数据已删除',
            icon: 'loading',
            duration: 20000
          })
          var pages = getCurrentPages();
          var currPage = pages[pages.length - 1];   //当前页面
          var prevPage = pages[pages.length - 2];  //上一个页面
          prevPage.getList();
          setTimeout(function () {
            wx.navigateBack({
              url: "/pages/personal/educateList/educateList"
            })
          }, 1000)

        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id) {
      id = options.id;
      index = options.index;
      this.setData({
        show: false
      })
    } else {
      id = ''
    }
    this.getTicket();
  }
})
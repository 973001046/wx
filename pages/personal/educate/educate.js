// pages/personal/educate/educate.js
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
    initData: '',
    start_time: '2008-08-08',
    finish_time: '2008-08-08',
    major_title: '',
    school_name: '',
    degree: '',
  },
  initFunc: function () {
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面
    var getData = prevPage.data.list[index];
    console.log(getData);
    this.setData({
      initData: getData,
      start_time: getData.start_time,
      finish_time: getData.finish_time,
      major_title: getData.major_title,
      school_name: getData.school_name,
      degree: getData.degree.key
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
        start_time: e.detail.value
      })
    } else if (e.target.dataset.type == 'end') {
      this.setData({
        finish_time: e.detail.value
      })
    }

  },
  eduFunc: function () {   //学历
    var _this = this;
    wx.showActionSheet({
      itemList: ['大专', '本科', '研究生', '博士'],
      success: function (res) {
        console.log(res.tapIndex)
        if (res.tapIndex == undefined) {
          _this.setData({
            degree: _this.data.initData.degree.value
          })
        } else {
          var index = res.tapIndex + 1;
          _this.setData({
            degree: index
          })
        }

      }
    })
  },
  bindKeyInput: function (e) {  //输入信息
    if (e.target.dataset.type == 'school_name') {
      this.setData({
        school_name: e.detail.value
      })
    } else if (e.target.dataset.type == 'major_title') {
      this.setData({
        major_title: e.detail.value
      })
    }
  },
  submit: function () {
    var _this = this;
    if (!(_this.data.start_time != '' && _this.data.finish_time != '' && _this.data.major_title != '' && _this.data.school_name != '' && _this.data.degree != '')) {
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
        start_time: _this.data.start_time,
        finish_time: _this.data.finish_time,
        major_title: _this.data.major_title,
        school_name: _this.data.school_name,
        degree: _this.data.degree,
      }
      var url = urlConfig.addEducation;
    } else {
      var data = {
        ticket: _this.data.ticket,
        student_id: app.globalData.student_id,
        id: _this.data.initData.pkid,
        start_time: _this.data.start_time,
        finish_time: _this.data.finish_time,
        major_title: _this.data.major_title,
        school_name: _this.data.school_name,
        degree: _this.data.degree,
      }
      var url = urlConfig.uptEducation;
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
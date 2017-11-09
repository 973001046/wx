// pages/personal/practice/practice.js
var urlConfig = require("../../../utils/api.js").api;
var app = getApp();
var id;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    ticket:'',
    show: true,
    showText:false,
    initData:'',
    start_time: '2008-08-08',
    finish_time: '2008-08-08',
    organization: '',
    quarters:'',
    content: '',
    textNum: 0
  },
  initFunc: function(){
    var _this = this;
     wx.request({
       url: urlConfig.practiceOne,
       header: { "Content-Type": "application/x-www-form-urlencoded" },
       method: 'POST',
       data:{
         ticket: _this.data.ticket,
         id: id
       },success: function(res){
          console.log(res.data)
          if(res.data.returnCode == 0){
             _this.setData({
               initData: res.data.returnData,
               start_time: res.data.returnData.start_time,
               finish_time: res.data.returnData.finish_time,
               organization: res.data.returnData.organization,
               quarters: res.data.returnData.quarters,
               content: res.data.returnData.content
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
        if(id != ''){
          _this.initFunc();
        }
      }
    })
  },
  bindDateChange: function (e) {  //时间选择
    if (e.target.dataset.type == 'start'){
        this.setData({
          start_time: e.detail.value
        })
    } else if (e.target.dataset.type == 'end'){
        this.setData({
          finish_time: e.detail.value
        })
    }

  },
  bindKeyInput: function (e) {
    if (e.target.dataset.type == 'organization') {
      this.setData({
        organization: e.detail.value
      })
    } else if (e.target.dataset.type == 'quarters') {
      this.setData({
        quarters: e.detail.value
      })
    } else if (e.target.dataset.type == 'major') {
      this.setData({
        detail_major: e.detail.value
      })
    } else if (e.target.dataset.type == 'content') {
      console.log(e);
      if (e.detail.value == ''){
        this.setData({
          // show: true,
          showText: false
        })
      } else{
        this.setData({
          // show: false,
          showText: true
        })
      }
      this.setData({
        content: e.detail.value,
        textNum: e.detail.cursor
      })
    }
  },
  submit: function(){
    var _this = this;
    if (!(_this.data.start_time != '' && _this.data.finish_time != '' && _this.data.organization != '' && _this.data.quarters != '' && _this.data.content != '')){
      wx.showToast({
        title: '信息不完整',
        icon: 'loading',
        image: '../../../images/danger.png',
        mask:true,
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
        organization: _this.data.organization,
        quarters: _this.data.quarters,
        content: _this.data.content,
      }
      var url = urlConfig.addPractice;
    } else{
      var data = {
        ticket: _this.data.ticket,
        student_id: app.globalData.student_id,
        id: _this.data.initData.pkid,
        start_time: _this.data.start_time,
        finish_time: _this.data.finish_time,
        organization: _this.data.organization,
        quarters: _this.data.quarters,
        content: _this.data.content,
      }
      var url = urlConfig.updatePractice;
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
            url: "/pages/personal/practiceList/practiceList"
          })

        }
      }
    })
  },
  deletes: function(){
    var _this = this;
    wx.request({
      url: urlConfig.delPractice,
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: 'POST',
      data: {
        ticket: _this.data.ticket,
        student_id: app.globalData.student_id,
        id: _this.data.initData.pkid,
      },success :function(res){
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
          setTimeout(function(){
            wx.navigateBack({
              url: "/pages/personal/practiceList/practiceList"
            })
          },1000)
          
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id){
      id = options.id;
      this.setData({
        show: false
      })
    } else{
      id = ''
    }
    this.getTicket();
  }
})
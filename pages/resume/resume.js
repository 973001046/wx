// pages/resume/resume.js
var urlConfig = require("../../utils/api.js").api;
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgFile:'image/boy.png',
    ticket:'',
    init:{}
  },
  changeImg:function(){  //选择图片
    var _this = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 压缩图
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        _this.upLoadImg(tempFilePaths[0]);
        _this.setData({
          imgFile: tempFilePaths,
        })
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
        _this.initFuc();
      }
    })
  },
  upLoadImg:function(tmp){  //上传图片
      var _this = this;
      wx.uploadFile({
        url: urlConfig.upLoad, //仅为示例，非真实的接口地址
        filePath: tmp,
        name: 'headpic',
        header: { "Content-Type": "multipart/form-data" },
        formData: {
          'ticket': _this.data.ticket,
          'student_id': app.globalData.student_id,
          'type': 1
        },
        success: function (res) {
            wx.showToast({
              title: '上传成功',
              icon: 'success',
              duration: 1500
            })
        }
      })
  },
  initFuc:function(){
    var _this = this;
     wx.request({
       url: urlConfig.preview,
       header: { "Content-Type": "application/x-www-form-urlencoded" },
       method: 'POST',
       data:{
         'ticket': _this.data.ticket,
         'version':3.2,
         'student_id': app.globalData.student_id,
       },success:function(res){
          wx.stopPullDownRefresh();
          console.log(res.data)
          _this.setData({
            init: res.data.returnData,
            imgFile: res.data.returnData.basic.avatar
          });
       }
     });
  },
  schoolFunc: function(){
    var _this = this;
    wx.showActionSheet({
      itemList: ['课外活动', '校内职务'],
      success: function (res) {
        if (res.tapIndex == 0) {
           wx.redirectTo({
             url: '/pages/personal/actList/actList',
           })
        } else if (res.tapIndex == 1){
            wx.redirectTo({
              url: '/pages/personal/jobsList/jobsList',
            })
        }
      }
    })
  },
  honorFunc: function () {
    var _this = this;
    wx.showActionSheet({
      itemList: ['证书', '荣誉'],
      success: function (res) {
        if (res.tapIndex == 0) {
          wx.redirectTo({
            url: '/pages/personal/diplomaList/diplomaList',
          })
        } else if (res.tapIndex == 1) {
          wx.redirectTo({
            url: '/pages/personal/honorList/honorList',
          })
        }
      }
    })
  }, 
  onPullDownRefresh: function () {
    this.initFuc();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTicket();
  },
})
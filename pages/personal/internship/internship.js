// pages/personal/internship/internship.js
var urlConfig = require("../../../utils/api.js").api;
var app = getApp();
var id;
var cityText='';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    ticket: '',
    initData: '',
    period_start: '2008-08-08',
    period_finish: '2008-08-08',
    expect_city: '',
    week_available: '',
    salary_range: '',
    expect_category:'',
  },
  initFunc: function () {
    var _this = this;
    wx.request({
      url: urlConfig.PostSubscribe,
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: 'POST',
      data: {
        ticket: _this.data.ticket,
        student_id: app.globalData.student_id
      }, success: function (res) {
        console.log(res.data)
        if (res.data.returnCode == 0) {
          _this.setData({
            initData: res.data.returnData,
            period_start: res.data.returnData.period_start,
            period_finish: res.data.returnData.period_finish,
            expect_city: res.data.returnData.expect_city,
            week_available: res.data.returnData.week_available,
            salary_range: res.data.returnData.salary_range.key,
            expect_category: res.data.returnData.expect_category.key,
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
        if (id != '') {
          _this.initFunc();
        }
      }
    })
  },
  bindDateChange: function (e) {  //时间选择
    if (e.target.dataset.type == 'start') {
      this.setData({
        period_start: e.detail.value
      })
    } else if (e.target.dataset.type == 'end') {
      this.setData({
        period_finish: e.detail.value
      })
    }

  },
  getText: function(arr){
      var _length = arr.length;
      if (_length == 1) {
        return arr[0].region_id
      } else if (_length > 1) {
        var text = '';
        for (var i = 0; i < _length; i++) {
          if (i != _length - 1) {
            text += arr[i].region_id + ',';
          } else {
            text += arr[i].region_id;
          }
        }
        return text;
      } else {
        return ''
      }
  },
  submit: function () {
    var _this = this;
    var getCityId = this.getText(_this.data.expect_city)
    if (!(_this.data.period_start != '' && _this.data.period_finish != '' && getCityId != '' && _this.data.week_available != '' && _this.data.salary_range != '' && _this.data.expect_category != '')) {
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

    var data = {
      ticket: _this.data.ticket,
      student_id: app.globalData.student_id,
      period_start: _this.data.period_start,
      period_finish: _this.data.period_finish,
      expect_city: getCityId,
      week_available: _this.data.week_available,
      salary_range: _this.data.salary_range,
      expect_category: _this.data.expect_category,
    }
    var url = urlConfig.uptSubscribe;
    console.log(data);
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
          prevPage.initFuc();
          wx.navigateBack({
            url: "/pages/personal/practiceList/practiceList"
          })

        }
      }
    })
  },
  classsfy:function(){
    var _this = this;
    wx.showActionSheet({
      itemList: ['财务/审计/税务', '银行/信托/保险/证券', '资管/融资租赁/财富管理', '投资/基金/期货', '市场/人资/咨询','其他类别'],
      success: function (res) {
        console.log(res.tapIndex)
        if (res.tapIndex == undefined) {
          _this.setData({
            expect_category: _this.data.expect_category
          })
        } else if (res.tapIndex == 0){
          _this.setData({
            expect_category: 1
          })
        } else if (res.tapIndex == 1) {
          _this.setData({
            expect_category: 8
          })
        } else if (res.tapIndex == 2) {
          _this.setData({
            expect_category: 17
          })
        } else if (res.tapIndex == 3) {
          _this.setData({
            expect_category: 26
          })
        } else if (res.tapIndex == 4) {
          _this.setData({
            expect_category: 34
          })
        } else if (res.tapIndex == 5) {
          _this.setData({
            expect_category: 43
          })
        }

      }
    })
  },
  dayFunc: function(){
    var _this = this;
    wx.showActionSheet({
      itemList: ['1天', '2天', '3天', '4天', '5天'],
      success: function (res) {
        console.log(res.tapIndex)
        if (res.tapIndex == undefined) {
          _this.setData({
            week_available: _this.data.week_available
          })
        } else {
          _this.setData({
            week_available: res.tapIndex+1
          })
        }

      }
    })
  },
  money: function(){
    var _this = this;
    wx.showActionSheet({
      itemList: ['50元以下/天', '50~99元/天', '100~200元/天', '200元以上/天'],
      success: function (res) {
        console.log(res.tapIndex)
        if (res.tapIndex == undefined) {
          _this.setData({
            salary_range: _this.data.salary_range
          })
        } else {
          _this.setData({
            salary_range: res.tapIndex + 1
          })
        }

      }
    })
  },
  deletes: function () {
    var _this = this;
    wx.request({
      url: urlConfig.delPractice,
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
              url: "/pages/personal/practiceList/practiceList"
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
    this.getTicket();
  }
})
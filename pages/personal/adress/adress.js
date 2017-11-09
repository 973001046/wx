var cityConfig = require("../../../utils/city.js");
//获取应用实例
var app = getApp();
var way = '';
var chooseList = [];
Page({
  data: {
    hotcityList: [
      { cityCode: 110100, city: '北京市' },
      { cityCode: 310100, city: '上海市' },
      { cityCode: 440100, city: '广州市' },
      { cityCode: 440300, city: '深圳市' },
      { cityCode: 330100, city: '杭州市' },
      { cityCode: 320100, city: '南京市' },
      { cityCode: 420100, city: '武汉市' },
      { cityCode: 410100, city: '郑州市' },
      { cityCode: 120100, city: '天津市' },
      { cityCode: 610100, city: '西安市' },
      { cityCode: 510100, city: '成都市' },
      { cityCode: 500100, city: '重庆市' }
    ],
    allCity: [],
    letter: [],
    toView: '#',
    windowHeight: 0,
    showLetter: 'A',
    turnLetter: false,
    timer: '',
    chooseArr: [],
  },
  scrollToViewFn: function (e) {  //滚动
    var _this = this;
    var _id = e.target.dataset.id;
    if (_this.data.timer != '') {
      clearTimeout(_this.data.timer);
    }
    this.setData({
      showLetter: _id,
      turnLetter: true,
      timer: setTimeout(function () {
        _this.setData({
          turnLetter: false
        });
      }, 1500)
    });
    this.data.showLetter = _id;
    this.setData({
      toView: 'goTo' + _id
    })

  },
  getCity: function (e) { //获取城市并返回
    var _length = chooseList.length;
    var _city = e.target.dataset.city;
    var _code = e.target.dataset.code;
    if (_length>=5){
      wx.showToast({
        title: '选择超过5个',
        icon: 'success',
        image: "../../../images/danger.png",
        duration: 1500
      })
      return false
    }
    if (_length>=1){
      for (var i = 0; i < _length;i++){
        if (chooseList[i].region_id == _code){
          wx.showToast({
            title: '重复选择',
            icon: 'success',
            image:"../../../images/danger.png",
            duration: 1500
          })
          return false
        }
      }
    }
    var arr = {
      region_id: _code,
      region_name: _city
    }
    chooseList.push(arr)
    this.setData({
      chooseArr: chooseList       
    })
    

  },
  deleteChoose: function(e){
    var key = e.target.dataset.key;
    var arr = [];
    for (var i = 0; i < chooseList.length; i++){
       if(i != key){
         arr.push(chooseList[i]);
       }
    }
    chooseList = arr;
    this.setData({
      chooseArr: arr
    })
  },
  finish: function(){
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面
    prevPage.setData({
      expect_city: chooseList
    })
    wx.navigateBack({
      url: 'pages/personal/internship/internship'
    })
  },
  onLoad: function (options) {
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面
    chooseList = prevPage.data.expect_city;
    console.log(chooseList)
    this.setData({
      chooseArr: prevPage.data.expect_city
    })

    var _this = this;
    wx.getSystemInfo({
      success: function (res) {
        console.log('windowHeight' + res.windowHeight)
        _this.setData({
          windowHeight: res.windowHeight * 3
        });
      }
    })
    this.setData({
      allCity: cityConfig.cityList(),
      letter: cityConfig.searchLetter
    });
    console.log(cityConfig);
  }
})

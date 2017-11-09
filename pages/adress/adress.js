var cityConfig = require("../../utils/city.js");
//获取应用实例
var app = getApp();
var way = '';
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
      { cityCode: 500100, city: '重庆市' }],
    allCity: [],
    letter:[],
    toView:'#',
    windowHeight:0,
    showLetter: 'A',
    turnLetter:false,
    timer:'',
  }, 
  scrollToViewFn: function (e) {  //滚动
    var _this = this;
    var _id = e.target.dataset.id;
    if (_this.data.timer !=''){
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
  getCity:function(e){ //获取城市 并返回
    var _city = e.target.dataset.city;
    var _code = e.target.dataset.code;
    if( way == 'basic' ){
      var pages = getCurrentPages();
      var currPage = pages[pages.length - 1];   //当前页面
      var prevPage = pages[pages.length - 2];  //上一个页面
      prevPage.setData({
        region_name: _city,
        region_id: _code
      })
      app.globalData.basicCity.city = _city;
      app.globalData.basicCity.code = _code;
      wx.navigateBack({
        url: 'pages/personal/basic/basic?city=' + _city + 'code=' + _code, 
      })
    } else{
      app.globalData.cityInfo.city = _city;
      app.globalData.cityInfo.code = _code;
      wx.redirectTo({
        url: app.globalData.selectAdressBack
      })
    }
  },
  onLoad: function (options) {
    if (options.way){
      way = options.way;
    }
    var _this = this;
    wx.getSystemInfo({
      success: function (res) {
        console.log('windowHeight'+res.windowHeight)
        _this.setData({
          windowHeight: res.windowHeight*3
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

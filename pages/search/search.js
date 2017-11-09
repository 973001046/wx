var urlConfig = require("../../utils/api.js").api;
//获取应用实例
var app = getApp();
var page = 1;
var loadMore = false;
var pageNum = 15;
Page({
  data: {
    motto: 'Hello World',
    userInfo: [],
    ticket: '',
    src: '../../images/banner.jpg',
    scrollHeight: 0,
    loading: true,
    loadMore: false,
    cityInfo: [],
    history: [],
    hot:[],
    show: true,
    searchText:'',
    positionList: [],
    emulateList: [{ id: 0, name: '全部' }, { id: 1, name: '专科' }, { id: 2, name: '本科' }, { id: 3, name: '硕士' }, { id: 4, name: '博士' }],
    graduationList: ['2012','2013','2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021'],
    positionIf: false,
    emulateListIf: false,
    graduationListIf: false,
    year: '',
    cate_id: '',
    edu:''
  },
  //事件处理函数
  getInitList: function () { //获取初始化列表
    var ticket = this.data.ticket;
    var _this = this;
    wx.request({
      url: urlConfig.postListUrl,
      method: 'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      data: {
        ticket: ticket,
        page: page,
        city_id: _this.data.cityInfo.code,
        grad_year: _this.data.year,
        edu: _this.data.edu,
        cate_id: _this.data.cate_id,
        keyword: _this.data.searchText,
        pageNum: pageNum
      }, success: function (res) {
        var list = _this.data.userInfo;
        if (res.data.returnData.post.length < pageNum) {
          loadMore = false;
          _this.setData({
            loading: false,
          })
        } else {
          loadMore = true;
          _this.setData({
            loading: true,
          })
        }
        for (var i = 0; i < res.data.returnData.post.length; i++) {
          list.push(res.data.returnData.post[i]);
        }
        _this.setData({
          userInfo: list,
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
        _this.getHistory();
        _this.getHot();
        _this.positionClassfy();
      }
    })
  },
  bindDownLoad: function () { //下拉刷新
    var _this = this;
    if (loadMore) {
      loadMore = false;
      page++;
      _this.getInitList()
    }
  },
  adress: function () {  //选择地址
    app.globalData.selectAdressBack = '../search/search';
    wx.navigateTo({
      url: '../adress/adress'
    })
  },
  getHistory: function(){// 获取搜索历史
    var ticket = this.data.ticket;
    var _this = this;
    console.log(urlConfig.history);
    wx.request({
      url: urlConfig.history,
      method: 'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      data: {
        ticket: ticket,
        student_id: 122
      }, success: function (res) {
        if (res.data.returnCode == 0){
          _this.setData({
            history: res.data.returnData.list
          })
        }
      }

    })
  },
  getHot: function () {// 获取热搜
    var ticket = this.data.ticket;
    var _this = this;
    wx.request({
      url: urlConfig.hot,
      method: 'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      data: {
        ticket: ticket,
        range: 2
      }, success: function (res) {
        if (res.data.returnCode == 0) {
          _this.setData({
            hot: res.data.returnData
          })
        }
      }

    })
  },
  clear:function(){  //清空历史搜索
      var ticket = this.data.ticket;
      var _this = this;
      wx.request({
        url: urlConfig.clearHistory,
        method: 'POST',
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        data: {
          ticket: ticket,
          student_id: 112
        }, success: function (res) {
          console.log(res);
          if (res.data.returnCode == 0) {
            _this.setData({
              history: []
            })
          }
        }

      })
  },
  bindKeyInput:function(e){  //键入存值
    this.setData({
      searchText: e.detail.value
    })
  },
  goToSearch:function(){ //点击搜索
    this.setData({
      show: false
    })
    this.getInitList();
  },
  search:function(){  //输入框搜索
    this.setData({
      show: false,
      userInfo: []
    })
    this.getInitList();
  },
  positionClassfy:function(){ //获取专业分类列表
    var ticket = this.data.ticket;
    var _this = this;
    wx.request({
      url: urlConfig.MajorType,
      method: 'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      data: {
        ticket: ticket,
      }, success: function (res) {
        console.log(res);
        if (res.data.returnCode == 0) {
          _this.setData({
            positionList: res.data.returnData
          })
        }
      }

    })
  },
  change:function(e){  //tab切换
    var _this = this;
    var _id = e.currentTarget.dataset.id;
    if(_id == '1'){
      if (_this.data.positionIf){
        _this.setData({
          positionIf:false
        });
      }else{
        _this.setData({
          positionIf: true,
          emulateListIf: false,
          graduationListIf: false
        });
      }
    } else if (_id == '2'){
      if (_this.data.emulateListIf) {
        _this.setData({
          emulateListIf: false
        });
      } else {
        _this.setData({
          positionIf: false,
          emulateListIf: true,
          graduationListIf: false
        });
      }
    } else{
      if (_this.data.graduationListIf) {
        _this.setData({
          graduationListIf: false
        });
      } else {
        _this.setData({
          positionIf: false,
          emulateListIf: false,
          graduationListIf: true
        });
      }
    }
  },
  conditionFun:function(e){
    var _this = this;
    var _id = e.currentTarget.dataset.id;
    var _name = e.currentTarget.dataset.name;
    if(_name == '1'){
      _this.setData({
        cate_id: _id,
        positionIf: false,
        emulateListIf: false,
        graduationListIf: false,
        userInfo: []
      });
      _this.getInitList();
    } else if (_name == '2'){
      _this.setData({
        edu: _id,
        positionIf: false,
        emulateListIf: false,
        graduationListIf: false,
        userInfo:[]
      });
      _this.getInitList();
    }else{
      _this.setData({
        year: _id,
        positionIf: false,
        emulateListIf: false,
        graduationListIf: false,
        userInfo: []
      });
      _this.getInitList();
    }
  },
  onLoad: function () {
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

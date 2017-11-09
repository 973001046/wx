var urlConfig = require("utils/api.js").api;
var formatTime = require("utils/util.js").formatTime;
var hexMD5 = require("utils/md5.js").hexMD5;
//app.js
var ticket = '';
var userInfos = {
  code: '',
  user: {}
};
App({
  onLaunch: function() {  //函数初始化
    this.getAuthor();
    this.wxAuthor();
    this.globalData.userInfo = userInfos   
    console.log(this.globalData.userInfo)
  },
  getAuthor: function() {  //api授权
    var authSign = hexMD5(urlConfig.authSign + formatTime(new Date()));
    console.log(formatTime(new Date()))
    console.log(urlConfig.authSign)
    wx.request({
      url: urlConfig.getAuthor,
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: 'POST',
      data:{
        authUserAcc: 'sxwx',
        authUserPwd: '123456',
        authSign: authSign
      },
      success: function (res) {
        if (res.data.returnCode == '0'){
          ticket = res.data.returnData.ticket;
          wx.setStorage({
            key: "key",
            data: res.data.returnData.ticket,
          })
        }
        
      }
    })
  },
  wxAuthor: function(){
    var _this = this;
    wx.getSetting({  //查询用户是否授权
      success(res) {
        console.log(res.authSetting['scope.userInfo'])
        console.log(res)
        if (res.authSetting['scope.userInfo'] == undefined){
          wx.login({
            success: function (res) {
              console.log("++++++++++++++++++++++++51")
              console.log(res)
              userInfos.code = res.code;
              wx.getUserInfo({
                success: function (res) {
                  userInfos.user = res;
                  // _this.getUserFunc();
                }
              })
              // console.log('userInfos++++++++++++++')
              // console.log(userInfos)
              
            }
          });
        } else{
            console.log(res.authSetting['scope.userInfo'])
            if (res.authSetting['scope.userInfo']) {  //获取用户信息
                wx.login({
                  success: function (res) {
                    console.log("++++++++++++++++++++++++69")
                    console.log(res)
                    userInfos.code = res.code;
                    wx.getUserInfo({
                      success: function (res) {
                        userInfos.user = res;
                        _this.getUserFunc();
                      }
                    })
                    console.log('userInfos++++++++++++++')
                    console.log(userInfos)
                   
                  }
                });
            } else{   //开启授权面板
              wx.openSetting({success:function(data){
                console.log(data)
                if (data.authSetting['scope.userInfo']){
                  _this.wxAuthor();
                }
              }})
            }
        }
      }
    })
  },
  getUserFunc:function(){
    var _this = this;
    console.log('userInfos++++++++++++++93')
    console.log(_this.globalData.userInfo)
    wx.request({
      url: urlConfig.getUserLogin,
      method: 'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      data: {
        ticket: ticket,
        grant_code: userInfos.code,
        rawData: userInfos.user.rawData,
        signature: userInfos.user.signature,
        encryptedData: userInfos.user.encryptedData,
        iv: userInfos.user.iv,
      },success: function(res){
        console.log(res)
      }
    })
  },
  globalData: {
    userInfo:{
      code:'',
      user:{}
    },
    cityInfo: {
       code:'',
       city:'全国',
    },
    basicCity:{
      code: '',
      city: '',
    },
    selectAdressBack:'',
    student_id: '16850',
    account_id: '18240',
  }
})

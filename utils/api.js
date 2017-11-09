var host = 'https://api.hishixi.com';
var api = {
  getAuthor: `${host}/Auth/index`,                         //获取令牌
  authSign:'sxwx123456',                                   //密钥
  checkLoginTicket: `${host}/Auth/checkLoginTicket`,       //登录验证
  postBannerUrl: `${host}/Adver/getList`,                  // 获取adv
  postListUrl: `${host}/Post/getList`,                     // 获取职位列表
  postDetailUrl: `${host}/Post/getInfo`,                   //职位详情
  enterpriseDetailUrl: `${host}/Enterprise/getLatestInfo`, //企业详情
  postResumeUrl: `${host}/ResumePost/deliverResume`,       //投递职位
  getBasicUrl: `${host}/Student/getInfo`,                  //获取基本信息
  updateBasicUrl: `${host}/Student/updateInfo`,            //更新基本信息
  history: `${host}/PostView/getList`,                     //浏览记录列表
  hot: `${host}/HotSearch/getHot`,                         //热门记录列表
  clearHistory: `${host}/PostView/clearList`,              //清除浏览记录
  MajorType: `${host}/PostCategory/getList`,               //获取专业分类列表
  getUser: `${host}/Student/getInfo`,                      //获取专业分类列表
  getDetail: `${host}/Post/getInfo`,                       //职位详情
  myCollect: `${host}/PostCollect/addInfo`,                //收藏
  delList: `${host}/PostCollect/delList`,                  //取消收藏
  deliver: `${host}/ResumePost/deliverResume`,             //简历投递
  enterprise: `${host}/Enterprise/getLatestInfo`,          //企业详情 
  upLoad: `${host}/Student/uploadImage`,                   //上传图像
  preview: `${host}/Resume/getInfo`,                       //预览简历
  collect: `${host}/PostCollect/getList`,                  //预览简历
  record: `${host}/ResumePost/getResumePostRecord`,        //简历投递记录
  resumeList: `${host}/ResumePost/getList`,                //简历
  updateInfo: `${host}/Student/updateInfo`,                //更新个人信息
  practice: `${host}/Practice/getList`,                    //获取实习列表
  practiceOne: `${host}/Practice/getOne`,                  //获取单个实习
  updatePractice: `${host}/Practice/updateInfo`,           //更新获取实习
  delPractice: `${host}/Practice/delInfo`,                 //删除实习
  addPractice: `${host}/Practice/addInfo`,                 //新增实习经历
  educationList: `${host}/Education/getList`,              //获取教育背景列表
  educationOne: `${host}/Education/getOne`,                //获取单条教育背景
  delEducation: `${host}/Education/delInfo`,               //删除单条教育背景
  addEducation: `${host}/Education/addInfo`,               //新增单条教育背景
  uptEducation: `${host}/Education/updateInfo`,            //更新单条教育背景
  dearHr: `${host}/Student/getDearHr`,                     //获取自我评价
  delDearHr: `${host}/Student/delDearHr`,                  //删除自我评价
  ActExperience: `${host}/ActivityExperience/getList`,     //课外活动列表
  addExperience: `${host}/ActivityExperience/addInfo`,     //新增活动列表
  uptExperience: `${host}/ActivityExperience/updateInfo`,  //课外活动列表
  jobList: `${host}/JobExperience/getList`,                //校内职位列表
  addJob: `${host}/JobExperience/addInfo`,                 //新增校内职位
  uptJob: `${host}/JobExperience/updateInfo`,              //更新校内职位
  delJob: `${host}/JobExperience/delInfo`,                 //删除校内职位
  PostSubscribe: `${host}/PostSubscribe/getInfo`,          //获取实习意向
  uptSubscribe: `${host}/PostSubscribe/updateInfo`,        //更新实习意向
  prizeExperience: `${host}/PrizeExperience/getList`,      //获取荣誉列表
  addPrize: `${host}/PrizeExperience/addInfo`,             //新增荣誉列表
  uptPrize: `${host}/PrizeExperience/updateInfo`,          //更新荣誉列表
  delPrize: `${host}/PrizeExperience/delInfo`,             //删除荣誉列表
  cerList: `${host}/StudentCertificate/getList`,           //证书列表
  sendSmsCode: `${host}/Account/sendSmsCode`,              //获取验证码
  bindAccount: `${host}/Account/bindAccount`,              //绑定账号
  delCollect: `${host}/PostCollect/delList`,               //取消收藏
  getUserLogin: `${host}/XcxAccount/getUserLogin`          //用户登录
}
module.exports = {
  api:api
};
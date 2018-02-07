var util = require('../../utils/util.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inTheaters: {},
    comingSoon: {},
    top250: {},
    searchResult: {},
    containerShow: true,
    searchPanelShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var inTheatersUrl = app.globalData.doubanBase + '/v2/movie/in_theaters' + '?start=0&count=3'; // 正在热映
    var comingSoonUrl = app.globalData.doubanBase + '/v2/movie/coming_soon' + '?start=0&count=3'; // 即将上映
    var top250Url = app.globalData.doubanBase + '/v2/movie/top250' + '?start=0&count=3';          // Top250

    this.getMovieListData(inTheatersUrl, '正在热映', 'inTheaters');
    this.getMovieListData(comingSoonUrl, '即将上映', 'comingSoon');
    this.getMovieListData(top250Url, '豆瓣Top250', 'top250');

  },

  // 点击更多跳转页面
  onMoreTap: function (event) {
    var cateSign = event.currentTarget.dataset.cate;
    wx.navigateTo({
      url: 'more-movie/more-movie?cateName=' + cateSign,
    })
  },

  onCancelImgTap: function (event) {
    this.setData({
      containerShow: true,
      searchPanelShow: false
    }
    )
  },

  onBindFocus: function (event) {
    this.setData({
      containerShow: false,
      searchPanelShow: true
    })
  },

  onBindBlur: function (event) {
    var text = event.detail.value;
    var searchUrl = app.globalData.doubanBase + "/v2/movie/search?q=" + text;
    this.getMovieListData(searchUrl, '', 'searchResult');
  },

  onCancelImgTap: function (event) {
    this.setData({
      containerShow: true,
      searchPanelShow: false,
      searchResult: {}
    })
  },

  // 请求地址（豆瓣电影）
  getMovieListData: function (url, cateName, setkey) {
    var _this = this;
    wx.request({
      url: url,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'GET',
      dataType: 'json',
      success: function (res) {
        _this.processDouban(res.data, cateName, setkey);
      }
    })
  },

  // 豆瓣电影数据处理
  processDouban: function (moviesDouban, cateName, setkey) {
    var movies = [];
    for (var idx in moviesDouban.subjects) {
      var subject = moviesDouban.subjects[idx];
      var title = subject.title;

      // 电影名超出6字节省略号处理
      if (title.length >= 6) {
        title = title.substring(0,6) + '...'
      }

      var temp = {
        stars: util.convertToStarsArray(subject.rating.stars), // 电影星级
        title: title,                   // 电影名
        imgUrl: subject.images.large,   // 电影海报
        movieId: subject.id,            // 电影id
        average: subject.rating.average // 电影评分
      }
      movies.push(temp)
    }
    var readyData = {};
    readyData[setkey] = {
      cateName: cateName,
      movies: movies
    }
    this.setData(readyData)
  }

})
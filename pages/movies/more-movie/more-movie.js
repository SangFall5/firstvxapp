var util = require('../../../utils/util.js');
var app = getApp();

Page({

  data: {
    navTitle: '',  // 页面标题
    movies: {},
    requestUrl: '',
    totalCount: 0,
    isEmpty: true
  },

  onLoad: function (options) {
    var cateSign = options.cateName;
    this.data.navTitle = cateSign;

    var dataUrl = '';
    switch (cateSign) {
      case '正在热映':
        dataUrl = app.globalData.doubanBase + '/v2/movie/in_theaters'; // 正在热映
        break;
      case '即将上映':
        dataUrl = app.globalData.doubanBase + '/v2/movie/coming_soon'; // 即将上映
        break;
      case '豆瓣Top250':
        dataUrl = app.globalData.doubanBase + '/v2/movie/top250';      // Top250
        break;
    }
    this.data.requestUrl = dataUrl;
    util.http(dataUrl, this.processDouban);

  },

  onScrollLower: function (event) {
    var nextUrl = this.data.requestUrl + '?start=' + this.data.totalCount + '&count=20';
    util.http(nextUrl, this.processDouban);
    wx.showNavigationBarLoading();
  },

  onPullDownRefresh: function (event) {
    var refreshUrl = this.data.requestUrl + '?start=0&count=20';
    this.data.movies = {};
    this.data.totalCount = 0;
    this.data.isEmpty = true;
    util.http(refreshUrl, this.processDouban);
    wx.showNavigationBarLoading();
  },

  // 豆瓣电影数据处理
  processDouban: function (moviesDouban) {
    var movies = [];
    for (var idx in moviesDouban.subjects) {
      var subject = moviesDouban.subjects[idx];
      var title = subject.title;

      // 电影名超出6字节省略号处理
      if (title.length >= 6) {
        title = title.substring(0, 6) + '...'
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
    var totalMovies = {};
    if (!this.data.isEmpty) {
      totalMovies = this.data.movies.concat(movies);
    }
    else {
      totalMovies = movies;
      this.data.isEmpty = false;
    }
    this.setData({
      movies: totalMovies
    })
    this.data.totalCount += 20;
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  },

  onReady: function (event) {
    wx.setNavigationBarTitle({
      title: this.data.navTitle
    })
  }

})
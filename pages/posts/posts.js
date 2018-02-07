var postsData = require("../../data/posts-data.js");

Page({
  data: {
  },
  onPostTap: function (event) {
    var postId = event.currentTarget.dataset.postid;
    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + postId
    })
  },
  onSwiperTap: function (event) {
    var postId = event.target.dataset.postid;
    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + postId
    })
  },
  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    this.setData({
      postList: postsData.postList
    });
  }
})
var postsData = require('../../../data/posts-data.js');
var app = getApp();

Page({
  data: {
    isMusicPlay: false
  },
  onLoad: function (option) {
    var postId = option.id;
    this.data.currentPostId = postId;
    var postData = postsData.postList[postId];

    // 获取数据
    this.setData({
      postData: postData
    });

    // 收藏の缓存
    var postsCollected = wx.getStorageSync('posts_collected');
    if (postsCollected) {
      var postCollected = postsCollected[postId];
      this.setData({
        collected: postCollected
      })
    } else {
      var postsCollected = {};
      postsCollected[postId] = false;
      wx.setStorageSync('posts_collected', postsCollected);
    };

    if (app.globalData.g_isMusicPlay && app.globalData.g_currentMusicPlayId === postId) {
      this.setData({
        isMusicPlay: true
      })
    }
    this.setMusicMoniter();

  },

  // 音乐播放控制
  setMusicMoniter: function () {
    var _this = this;
    wx.onBackgroundAudioPause(function () {
      _this.setData({
        isMusicPlay: false
      })
      app.globalData.g_isMusicPlay = false;
      app.globalData.g_currentMusicPlayId = null;
    });

    wx.onBackgroundAudioPlay(function () {
      _this.setData({
        isMusicPlay: true
      })
      app.globalData.g_isMusicPlay = true;
      app.globalData.g_currentMusicPlayId = _this.data.currentPostId;
    })
  },

  // 收藏事件
  onColletionTap: function (event) {
    var postsCollected = wx.getStorageSync('posts_collected');
    var postCollected = postsCollected[this.data.currentPostId];
    // 收藏变为未收藏，未收藏变为已收藏
    postCollected = !postCollected;
    postsCollected[this.data.currentPostId] = postCollected;

    this.showToast(postsCollected, postCollected);

  },
  showModal: function (postsCollected, postCollected) {
    var _this = this;
    wx.showModal({
      title: '提示',
      content: postCollected ? '是否收藏该文章？' : '取消收藏该文章？',
      success: function (res) {
        if (res.confirm) {
          // 更新文章是否收藏的缓存值
          wx.setStorageSync('posts_collected', postsCollected);
          // 更新数据绑定变量，控制收藏图片切换
          _this.setData({
            collected: postCollected
          })
        }
      }
    })
  },
  showToast: function (postsCollected, postCollected) {
    // 更新文章是否收藏的缓存值
    wx.setStorageSync('posts_collected', postsCollected);
    // 更新数据绑定变量，控制收藏图片切换
    this.setData({
      collected: postCollected
    })
    wx.showToast({
      title: postCollected ? '收藏成功' : '取消成功',
      duration: 1000
    })
  },
  onShareTap: function (event) {
    wx.showActionSheet({
      itemList: [
        '分享给朋友',
        '分享到朋友圈'
      ],
      success: function (res) {
        // console.log(res.tapIndex)
      }
    })
  },
  onMusicTap: function (event) {
    var postId = this.data.currentPostId;
    var postData = postsData.postList[postId];
    if (this.data.isMusicPlay) {
      wx.pauseBackgroundAudio();
      this.setData({
        isMusicPlay: false
      })
    } else {
      wx.playBackgroundAudio({
        dataUrl: postData.music.url,
        title: postData.music.title,
        coverImg: postData.music.coverImg
      });
      this.setData({
        isMusicPlay: true
      })
    }
  }
})
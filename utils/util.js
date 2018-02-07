function convertToStarsArray(stars) {
  var num = stars.toString().substring(0, 1);
  var array = [];
  for (var i = 1; i <= 5; i++) {
    if (i <= num) {
      array.push(1)
    }
    else {
      array.push(0)
    }
  }
  return array;
}

// 请求地址（豆瓣电影）
function http(url, callback) {
  var _this = this;
  wx.request({
    url: url,
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    method: 'GET',
    dataType: 'json',
    success: function (res) {
      callback(res.data);
    }
  })
}

module.exports = {
  convertToStarsArray: convertToStarsArray,
  http: http
}
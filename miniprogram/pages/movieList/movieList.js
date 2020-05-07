// miniprogram/pages/movieList/movieList.js
const db = wx.cloud.database();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        movieList: [ ]
    },
    
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        db.collection('movies').get({
            success: res => {
                let movieList = res.data;
                this.setData({
                    movieList: movieList
                })
            },
            fail: err => {
                wx.showToast({
                    title: err.errMsg,
                })
            }
        })
    },

    // 跳转至电影详情页面（传递参数 movieId）
    toMovieDetail: function (event) {
        let movieId = event.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../movieDetail/movieDetail?movieId=' + movieId,
        })
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        wx.showToast({
            title: '刷新成功',
        });
        wx.stopPullDownRefresh();
    },
})
// miniprogram/pages/home/home.js
const db = wx.cloud.database();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        comment: null,
    },

    // 跳转至影评详情
    toCommentDetail() {
        wx.navigateTo({
            url: '../commentDetail/commentDetail?commentid='+this.data.comment._id,
        })
    },

    // 跳转至电影详情
    toMovieDetail() {
        wx.navigateTo({
            url: '../movieDetail/movieDetail?movieId='+this.data.comment.movieId,
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        db.collection('comments').get({
            success: res => {
                if (res.data.length > 0) {  //  有评论
                    let comment = res.data[0];
                    this.setData({
                        comment: comment
                    })
                }
            }
        })
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        wx.showToast({
            title: '刷新成功',
        })
        wx.stopPullDownRefresh();
    },
})
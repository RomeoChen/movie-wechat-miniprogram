// miniprogram/pages/commentList/commentList.js
const db = wx.cloud.database();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        commentList: [],
        movieId: '',
    },

    // 跳转至影评详情页，传递参数 comment_id
    toCommentDetail(e) {
        let commentid = e.currentTarget.dataset.commentid;
        wx.navigateTo({
            url: '../commentDetail/commentDetail?commentid='+commentid,
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {    // movieId
        this.setData({
            movieId: options.movieId
        })
        this.getCommentList();
        this.innerAudioContext = wx.createInnerAudioContext();
        this.innerAudioContext.onError((res) => {
            that.tip("播放录音失败！")
        })
    },

    // 请求数据并赋值
    getCommentList() {
        db.collection('comments').where({
            movieId: this.data.movieId
        }).get({
            success: res => {
                this.setData({
                    commentList: res.data
                })
            },
            fail: err => {
                console.log(err)
            }
        })
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        this.getCommentList();
        wx.showToast({
            title: '刷新成功',
        })
        wx.stopPullDownRefresh();
    },

    // 播放录音
    playRecord(e) {
        let src = e.currentTarget.dataset.src;
        this.innerAudioContext.src = src;
        this.innerAudioContext.play()
    }
})
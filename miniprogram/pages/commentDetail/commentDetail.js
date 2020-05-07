// miniprogram/pages/commentDetail/commentDetail.js
const db = wx.cloud.database();
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        comment: {},
        hasCommented: false,
    },

    // 收藏影评
    collectComment() {
        db.collection('collectedComments').where({
            _openid: app.globalData.openid,
            commentId: this.data.comment._id
        }).get({
            success: res => {
                console.log(res.data)
                if (res.data.length > 0) {     // 已经收藏过
                    wx.showToast({
                        title: '已收藏过啦~',
                    })
                } else {    // 说明之前没收藏
                    db.collection('collectedComments').add({
                        data: {
                            commentId: this.data.comment._id
                        },
                        success: res => {
                            wx.showToast({
                                title: '收藏成功！',
                            })
                        }
                    })
                }
            }
        })
    },

    // 写评论
    writeComment() {
        wx.showActionSheet({
            itemList: ['文字', '音频'],
            success: res => {
                let type = res.tapIndex === 0 ? 'text' : 'voice';
                let movieId = this.data.comment.movieId;
                console.log(type, movieId)
                wx.navigateTo({
                    url: '../commentEdit/commentEdit?type='+type+'&movieId=' + movieId,
                })
            },
            fail: err => {
                console.log(err.errMsg);
            }
        })
    },

    // 转到我对该影评的评论详情页
    switchMyComment() {
        let openid = app.globalData.openid;
        let movieId = this.data.comment.movieId;
        db.collection('comments').where({
            _openid: openid,
            movieId: movieId,
        }).get({
            success: res => {
                this.setData({
                    comment: res.data[0],
                })
            }
        })
    },

    // 检查是否评论过
    checkHasCommented() {
        let openid = app.globalData.openid;
        let movieId = this.data.comment.movieId;
        db.collection('comments').where({
            _openid: openid,
            movieId: movieId,
        }).get({
            success: res => {
                if (res.data.length > 0) {
                    this.setData({
                        hasCommented: true,
                    })
                } else {
                    this.setData({
                        hasCommented: false,
                    })
                }
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {    // commentid
        let commentid = options.commentid;  // 测试成功
        db.collection('comments').doc(commentid).get({
            success: res => {
                // let { _id, _openid, content, movieId} = res.data;
                let comment = res.data;
                console.log('comment', comment)
                this.setData({
                    comment: comment
                })
            },
        })
        this.checkHasCommented();
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },
})
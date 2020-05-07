// miniprogram/pages/movieDetail/movieDetail.js
const db = wx.cloud.database();
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // movie: {
        //     movieId: '',
        //     imageUrl: '../../images/p2517753454.jpg',
        //     title: '复仇者联盟3：无限战争',
        //     description: '《复仇者联盟3：无限战争》是漫威电影宇宙10周年的历史性集结，将为影迷们带来史诗版的终极对决。面对灭霸突然发起的闪电袭击，复仇者联盟及其所有超级英雄盟友必须全力以赴，才能阻止他对全宇宙造成毁灭性的打击。'
        // },
        movie: {},
        hasCommented: false,
        openId: '',
    },

    // 点击登录按钮
    onTapLogin(e) {
        wx.cloud.callFunction({
            name: 'login',
            complete: res => {
                console.log('callFunction login result: ', res);
                app.globalData.openId = res.result.openid;
                this.setData({
                    openId: res.result.openid
                })
            }
        })
    },

    // 添加影评
    addComment() {
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权
                    this.toCommentEdit();
                } else {
                    wx.authorize({
                        scope: '未登录，请先授权登录',
                    })
                }
            }
        })
    },

    // 跳转至影评编辑页
    toCommentEdit() {
        wx.showActionSheet({
            itemList: ['文字', '音频'],
            success: res => {
                let type = res.tapIndex === 0 ? 'text' : 'voice'
                wx.navigateTo({
                    url: '../commentEdit/commentEdit?movieId='+this.data.movie._id + '&type='+type,
                })
            },
            fail: err => {
                console.log(err.errMsg);
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let movieId = options.movieId;
        let hasCommented = false;
        let openId = app.globalData.openId
        db.collection('comments').where({
            _openid: openId
        }).get({
            success: res => {   // 获取用户的评论列表
                let commentsOfUser = res.data;
                commentsOfUser.forEach( item => {
                    if (item.movieId === movieId) {
                        hasCommented = true;
                    }
                })
            },
            complete: () => {   // 判断用户是否评论过该影评之后要做的事
                this.setData({
                    openId: openId,
                    hasCommented: hasCommented
                })
                db.collection('movies').doc(movieId).get({
                    success: res => {
                        this.setData({
                            movie: res.data
                        })
                    }, 
                    fail: err => {
                        console.log(err.errMsg)
                    }
                })
            }
        })
    },

    // 查看影评
    toCommentList: function() {
        wx.navigateTo({
            url: '../commentList/commentList?movieId=' + this.data.movie._id,
        })
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

})
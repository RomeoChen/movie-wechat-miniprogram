// miniprogram/pages/user/user.js
const db = wx.cloud.database();
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        commentList: [ ],
        logged: false,
        userInfo: null,
        currentTab: 'released',
        // userInfo: {
        //     nickName: '火山',
        //     avatarUrl: '',
        // }
    },

    // 点击登录按钮
    onTapLogin(e) {
        if (!this.logged && e.detail.userInfo) {
            this.setData({
                logged: true,
                userInfo: e.detail.userInfo,
            })
        }
        wx.cloud.callFunction({
            name: 'login',
            complete: res => {
                console.log('callFunction login result: ', res);
                app.globalData.openId = res.result.openid;
            }
        })
    },

    // 显示收藏的影评
    showCollectd() {
        this.setData({
            currentTab: 'collected'
        })
        let commentList = [];
        this.setData({
            commentList
        })
        db.collection('collectedComments').where({
            _openid: app.globalData.openId
        }).get({
            success: res => {
                let colletedComments = res.data;
                for (let comment of colletedComments) {
                    db.collection('comments').doc(comment.commentId).get({
                        success: res => {
                            commentList.push(res.data)  // 测试添加成功
                            this.setData({
                                commentList: commentList
                            })
                        }
                    })
                }
            },
        })
    },

    // 显示发布的影评
    showReleased() {
        this.setData({
            currentTab: 'released'
        })
        db.collection('comments').where({
            _openid: app.globalData.openId
        }).get({
            success: res => {
                this.setData({
                    commentList: res.data
                })
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.showReleased();
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: res => {
                            this.setData({
                                userInfo: res.userInfo
                            })
                        }
                    })
                }
            }
        })
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        if (this.data.currentTab === 'released') {
            this.showReleased();
        } else {
            this.showCollectd();
        }
        wx.showToast({
            title: '刷新成功',
        });
        wx.stopPullDownRefresh();
    },

    // 跳转到影评详情
    toCommentDetail(e) {
        let commentid = e.currentTarget.dataset.commentid;
        console.log('commentid',commentid)
        wx.navigateTo({
            url: '../commentDetail/commentDetail?commentid='+commentid,
        })
    }
})
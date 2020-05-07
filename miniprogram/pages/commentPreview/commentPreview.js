// miniprogram/pages/commentPreview/commentPreview.js
const db = wx.cloud.database();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        movie: {},
        nickName: '',
        avatarUrl: '',
        comment: '',
        type: '',
        src: '',
    },

    // 重新编辑
    editAgain() {
        wx.navigateBack({})
    },

    // 发布影评
    releaseComment() {
        if (this.data.type === 'voice') {
            let src = this.data.src;
            let tempArr = src.split('/')
            let id = tempArr[tempArr.length-1].split('.')[1]    // src中的随机id
            wx.cloud.uploadFile({
                cloudPath: 'records/'+id+'.mp3',
                filePath: this.data.src,
                success: res => {
                    console.log(res.fileID);
                    db.collection('comments').add({
                        data: {
                            content: this.data.comment,
                            movieId: this.data.movie._id,
                            nickName: this.data.nickName,
                            avatarUrl: this.data.avatarUrl,
                            type: this.data.type,
                            title: this.data.movie.title,
                            movieImageUrl: this.data.movie.imageUrl,
                            src: res.fileID,
                        },
                        success: res => {
                            wx.showToast({
                                title: '发布成功',
                            });
                            wx.navigateTo({
                                url: '../commentList/commentList?movieId='+this.data.movie._id,
                            });
                        },
                        fail: err => {
                            console.log(err.errMsg);
                            wx.showToast({
                                title: '发布失败，请重试',
                            })
                        }
                    })
                },
                fail: err => {console.log(err.errMsg)}
            })
        } else {
            db.collection('comments').add({
                data: {
                    content: this.data.comment,
                    movieId: this.data.movie._id,
                    nickName: this.data.nickName,
                    avatarUrl: this.data.avatarUrl,
                    type: this.data.type,
                    title: this.data.movie.title,
                    movieImageUrl: this.data.movie.imageUrl,
                },
                success: res => {
                    wx.showToast({
                        title: '发布成功',
                    });
                    wx.navigateTo({
                        url: '../commentList/commentList?movieId=' + this.data.movie._id,
                    });
                },
                fail: err => {
                    console.log(err.errMsg);
                    wx.showToast({
                        title: '发布失败，请重试',
                    })
                }
            })
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {    // type, comment, movieId, src
        this.setData({
            type: options.type,
            comment: options.comment,
            src: options.src.replace('%3D', '='),
        })
        db.collection('movies').doc(options.movieId).get({
            success: res => {
                this.setData({
                    movie: res.data
                })
            }
        })
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: res => {
                            console.log(res.userInfo)
                            this.setData({
                                nickName: res.userInfo.nickName,
                                avatarUrl: res.userInfo.avatarUrl,
                            })
                        }
                    })
                }
            }
        });
        this.innerAudioContext = wx.createInnerAudioContext();
        this.innerAudioContext.onError((res) => {
            that.tip("播放录音失败！")
        })
    },

    // 播放录音
    playRecord() {
        let src = this.data.src;
        if (src === '') {
            wx.showModal({
                title: '提示',
                content: '请先登录',
                showCancel: false,
            })
            return;
        }
        this.innerAudioContext.src = src;
        this.innerAudioContext.play();
    },

})
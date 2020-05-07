// miniprogram/pages/commentEdit/commentEdit.js
const db = wx.cloud.database();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        movie: {},
        comment: '',
        type: '',   // text or voice
        src: '',    // voice file path
    },

    // 完成编辑
    confirmEdit() {
        if (this.data.type === 'voice' && this.data.src === '') {
            this.tip('请先录音');
        } else {
            wx.navigateTo({
                url: `../commentPreview/commentPreview?comment=${this.data.comment}&type=${this.data.type}&movieId=${this.data.movie._id}&src=${this.data.src.replace('=', '%3D')}`,
            })
        }
    },

    // 绑定输入的评论
    bindInput(e) {
        this.setData({
            comment: e.detail.value
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {    // type, movieId
        this.setData({
            type: options.type
        })
        db.collection('movies').doc(options.movieId).get({
            success: res => {
                this.setData({
                    movie: res.data,
                })
            }
        })
        let that = this;
        this.recorderManager = wx.getRecorderManager();
        this.recorderManager.onError(function() {
            that.tip("录音失败！");
        })
        this.recorderManager.onStop(function (res) {
            that.setData({
                src: res.tempFilePath
            })
            console.log(res.tempFilePath)
            that.tip("录音完成！")
        });

        this.innerAudioContext = wx.createInnerAudioContext();
        this.innerAudioContext.onError((res) => {
            that.tip("播放录音失败！")
        })
    },

    // 录音提示
    tip: function (msg) {
        wx.showModal({
            title: '提示',
            content: msg,
            showCancel: false
        })
    },

    //  开始录音
    startRecord() {
        this.recorderManager.start({
            format: 'mp3'
        });
    },

    // 结束录音
    stopRecord() {
        this.recorderManager.stop()
    },

    // 播放录音
    playRecord() {
        var that = this;
        var src = this.data.src;
        if (src == '') {
            this.tip("请先录音！")
            return;
        }
        this.innerAudioContext.src = this.data.src;
        this.innerAudioContext.play()
    },
})
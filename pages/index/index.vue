<template>
  <view class="container">
    <!-- 输入表单 -->
	<up-notice-bar text="注意，频率限制为一分钟10次，公用限制"></up-notice-bar>
    <u-form :model="form" ref="uForm">
      <u-form-item label="" prop="link">
        <up-textarea
          v-model="inputLink" 
          autoHeight 
          placeholder="请输入抖音视频链接" 
          border="solid"
          :border-color="inputBorderColor"
        />
      </u-form-item>

      <!-- 提交按钮 -->
      <u-button 
        type="primary" 
        shape="circle" 
        @click="submitLink"
        :loading="loading"
      >
        解析视频
      </u-button>
    </u-form>

    <!-- 结果展示 -->
    <view v-if="showResult" class="result-card">
      <u-card 
        title="解析结果"
        :sub-title="'原始链接：' + inputLink"
        :border="false"
      > 
        <!-- 操作按钮 -->
      </u-card>
<!-- 	  <view class="video-container">
	    <video 
	      src="videoLink"
	      controls
	      :style="{ width: '100%', height: 'auto' }"
		    @error="handleVideoError">
			</video>
	  </view> -->
    </view>
	<view class="action-buttons" v-if="showResult">
	  <u-button 
	    type="success" 
	    shape="circle"
	    @click="saveVideo"
	    :disabled="!videoLink"
	  >
	    保存到相册
	  </u-button>
	  <u-button 
	    type="warning"
	    shape="circle"
	    @click="copyLink"
	    :disabled="!videoLink"
	  >
	    复制链接
	  </u-button>
	</view>
  </view>
</template>

<script>
export default {
  data() {
	const videoLink= ""
	 const  handleVideoError=(event)=> {
	      console.error('视频播放失败:', event);
	      uni.showToast({
	        title: '视频播放失败，请检查链接',icon: 'none'});
	    }
    return {
      inputLink: '',
      videoLink,
      showResult: false,
      loading: false,
      inputBorderColor: '#eee',
	  handleVideoError
    }
  },
  methods: {
    // 提交链接
    async submitLink() {
      if (!this.inputLink) {
        this.$refs.uForm.validateField('link', (errMsg) => {
          uni.showToast({
            title: errMsg || '请输入视频链接',
            icon: 'none'
          })
        })
        return
      }

      try {
        this.loading = true
        this.inputBorderColor = '#2867ce'
        this.inputLink = this.inputLink.replace(/#/g, ''); // 新增正则过滤逻辑
		// console.log(this.inputLink)
        // 调用接口
        const res = await uni.request({
          url: 'https://api.tangdouz.com/dy.php?lj=' + this.inputLink,
          data: {}
        })
        
        if (res.data!="") {
          this.videoLink = res.data; // 假设res.data直接返回视频URL
          this.showResult = true;
        } else {
          uni.showToast({
            title: '解析失败,已通知工程师',
            icon: 'none'
          })
        }
      } catch (error) {
        uni.showToast({
          title: '请求失败，请检查网络',
          icon: 'none'
        })
      } finally {
        this.loading = false
        this.inputBorderColor = '#eee'
      }
    },

    // 保存视频
    saveVideo() {
      uni.showModal({
        title: '保存视频',
        content: '是否将视频保存到手机相册？',
        success: (res) => {
          if (res.confirm) {
            uni.downloadFile({
              url: this.videoLink,
              success: (downloadResult) => {
                if (downloadResult.statusCode === 200) {
                  uni.saveVideoToPhotosAlbum({
                    filePath: downloadResult.tempFilePath,
                    success: () => {
                      uni.showToast({
                        title: '保存成功',
                        icon: 'success'
                      })
                    },
                    fail: (err) => {
                      uni.showToast({
                        title: `保存失败：${err.errMsg}`,
                        icon: 'none'
                      })
                    }
                  })
                } else {
                  uni.showToast({
                    title: '下载失败',
                    icon: 'none'
                  })
                }
              },
              fail: (err) => {
                uni.showToast({
                  title: `下载失败：${err.errMsg}`,
                  icon: 'none'
                })
              }
            })
          }
        }
      })
    },

    // 复制链接
    copyLink() {
      uni.setClipboardData({
        data: this.videoLink,
        success: () => {
          uni.showToast({
            title: '复制成功',
            icon: 'success'
          })
        }
      })
    },

    // 视频容器点击处理
    handleVideoClick() {
      if (!this.videoLink) return
      uni.navigateTo({
        url: `/pages/detail/detail?url=${encodeURIComponent(this.videoLink)}`
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 20rpx;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.u-form {
  background: #fff;
  border-radius: 16rpx;
  padding: 40rpx;
  margin-bottom: 40rpx;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.05);
}

.result-card {
  background: #fff;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.05);

  .video-container {
    position: relative;
    padding-top: 56.25%; /* 16:9 比例 */
    overflow: hidden;
    
    video {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .action-buttons {
    display: flex;
    justify-content: center;
    gap: 20rpx;
    padding: 40rpx;
    
    .u-button {
      width: 48%;
    }
  }
}

.u-button {
  margin-top: 20rpx;
  width: 100%;
}
</style>
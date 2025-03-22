<template>
  <view class="container">
    <!-- 留言板标题 -->
<view class="custom-section">
  <view class="section-title">开发中</view>
  <!-- 内容区域 -->
</view>
    <!-- 留言列表 -->
    <view class="message-list">
      <u-list>
        <u-list-item 
          v-for="(item, index) in messageList" 
          :key="index"
          :border-bottom="index !== messageList.length - 1"
        >
          <!-- 用户头像 -->
          <template v-slot:icon>
            <u-avatar 
              :src="item.avatar" 
              size="60" 
              shape="circle"
              :border="false"
            ></u-avatar>
          </template>

          <!-- 留言内容 -->
          <view class="message-content">
            <view class="user-info">
              <text class="nickname">{{ item.nickname }}</text>
              <text class="time">{{ formatTime(item.timestamp) }}</text>
            </view>
            <view class="content">{{ item.content }}</view>
          </view>
        </u-list-item>
      </u-list>
    </view>

    <!-- 留言输入框 -->
    <view class="input-area">
      <u-input 
        v-model="newMessage" 
        placeholder="写下你的留言..." 
        border="none"
        :clearable="false"
        class="input-field"
		
      />
      <u-button 
        type="primary" 
        shape="circle" 
        @click="submitMessage"
        class="submit-btn"
      >发送</u-button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      newMessage: '',
      messageList: [] // 留言数据
    }
  },
  methods: {
    // 提交留言
    async submitMessage() {
      if (!this.newMessage.trim()) {
        uni.showToast({ title: '留言内容不能为空', icon: 'none' })
        return
      }

      // 获取微信用户信息（需先获取用户授权）
      const userInfo = await this.getWechatUserInfo()
      
      this.messageList.unshift({
        avatar: userInfo.avatarUrl,
        nickname: userInfo.nickName,
        content: this.newMessage,
        timestamp: Date.now()
      })

      this.newMessage = ''
    },

    // 格式化时间
    formatTime(timestamp) {
      const date = new Date(timestamp)
      return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`
    },

    // 获取微信用户信息（示例方法，需实际实现授权逻辑）
    async getWechatUserInfo() {
      // 实际开发中需要处理用户授权逻辑
      return {
        avatarUrl: '/static/logo.png', // 默认头像
        nickName: '微信用户'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 20rpx;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.message-list {
  margin-bottom: 100rpx;
    max-height: calc(100vh - 200rpx); 
  .message-content {
    padding-left: 20rpx;
    
    .user-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10rpx;
      
      .nickname {
        font-weight: bold;
        color: #333;
      }
      
      .time {
        color: #999;
        font-size: 24rpx;
      }
    }
    
    .content {
      color: #666;
      line-height: 1.6;
    }
  }
}

.input-area {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20rpx;
  background-color: #fff;
  display: flex;
  align-items: center;
  box-shadow: 0 -2rpx 10rpx rgba(0,0,0,0.05);
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  .input-field {
    flex: 1;
    margin-right: 20rpx;
  }

  .submit-btn {
    width: 120rpx;
    height: 60rpx;
    font-size: 28rpx;
  }
}
.custom-section {
  padding: 20rpx;
  border-bottom: 1rpx solid #eee;
}
.section-title {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
}
</style>
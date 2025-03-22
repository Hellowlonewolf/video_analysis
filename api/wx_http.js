
export default function wxhttp(url, data={}, method = 'GET') {
	console.log(url)
	// 对外支持链式调用
	return new Promise((resolve, reject) => {
	
		uni.request({
			url:  url,
			data,
			method,
			header: {
			},
			success: res => {
				console.log("成功",res)
				
				if (res.statusCode == 200) {				
					resolve(res.data)
					}else{
					console.log("异常")
					reject(res.data)
					
				}
			},
			fail: () => {
				uni.showToast({
					title: '服务器请求异常',
					icon: 'none'
				})
			}
		})
	})}
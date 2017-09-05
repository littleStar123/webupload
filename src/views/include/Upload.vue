<template>
	<div class="uploadArea">
		<div class="selfile" id="uploader">
			<div id="picker">选择文件</div>
			<div id="thelist">
				<el-table :data="filesArr" highlight-current-row border max-height="330" :empty-text="emptyText">
					<el-table-column align="center" type="index" label="序号" width="65">
					</el-table-column>
					<el-table-column align="center" prop="name" label="文件名" width="250">
					</el-table-column>
					<el-table-column align="center" prop="progress" label="上传进度" width="100">
					</el-table-column>
					<el-table-column align="center" prop="size" label="文件大小" width="100">
						<template scope="scope">
							{{bytesToSize(scope.row.size)}}
						</template>
					</el-table-column>
					<el-table-column align="center" prop="index" label="操作" width="100">
						<template scope="scope">
							<el-button type="text" @click="delfile(scope.row)" v-if="scope.row.isUpload === 0">删除</el-button>
							<el-button type="text" @click="pauseUpload()" v-if="scope.row.isUpload === 1">暂停</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</div>
	</div>
</template>
<script>
	import WebUploader from 'webuploader'
	import { fspath } from '../../api/api'
	import { bytesToSize } from '../../api/format'

	export default {
		name: 'v-upload',
		data() {
			return {
				state: 'pending', //初始状态
				uploader: null, //uploader 对象
				fileMd5: null, //文件唯一标识  
				fileName: '', //文件名称  
				fileExtName:'',//文件扩展名
				fileLength:0,//文件总大小
				groupName:'',//组名(从第二个分片开始必须有)
				filePath:'',//文件路径(从第二个分片开始必须有)
				chunks:0,//总分片数
				chunk:1,//当前分片
				chunkSize:0,//分片文件大小
				count: 0, // 当前正在上传的文件在数组中的下标，一次上传多个文件时使用  
				filesArr: [], // 文件数组：每当有文件被添加进队列的时候 就 push 到数组中  
				emptyText:'暂无文件信息'
			}
		},
		methods: {
			bytesToSize(bytes) {
				return bytesToSize(bytes);
			},
			uploadRegister() {
				let that = this;
				WebUploader.Uploader.register({
					"before-send-file": "beforeSendFile", // 整个文件上传前  
					"before-send": "beforeSend", // 每个分片上传前  
					"after-send-file": "afterSendFile", // 分片上传完毕
				}, {
					beforeSendFile: function(file) {
						var deferred = WebUploader.Deferred();
						//1、计算文件的唯一标记 fileMd5，用于断点续传  如果. md5File(file) 方法里只写一个 file 参数则计算 MD5 值会很慢 所以加了后面的参数：10*1024*1024  
						(new WebUploader.Uploader()).md5File(file, 0, 5 * 1024 * 1024).progress(function(percentage) {})
							.then(function(val) {
								that.fileMd5 = val;
								// 获取文件信息后进入下一步    
								deferred.resolve();
							});
						that.fileName = file.name; // 为自定义参数文件名赋值  
						that.fileExtName = file.ext;
						that.fileLength = file.size;
						that.chunks = Math.ceil(file.size/(5 * 1024 * 1024));
						return deferred.promise();
					},
					beforeSend: function(block) {
						var deferred = WebUploader.Deferred();
						this.owner.options.formData.fileMd5 = that.fileMd5;
						that.chunkSize = block.end-block.start;
						that.chunk = block.chunk;
//						deferred.reject();//跳过分块    
						deferred.resolve();
						return deferred.promise();
					},
					afterSendFile: function() {
						
					}
				});
			},
			uploadCreate() {
				this.uploader = WebUploader.create({
					auto: false, // 选择文件后是否自动上传  
					chunked: true, // 开启分片上传  
					chunkSize: 5 * 1024 * 1024, // 如果要分片，分多大一片？默认大小为 5M  
					chunkRetry: 3, // 如果某个分片由于网络问题出错，允许自动重传多少次  
					threads: 1, // 上传并发数。允许同时最大上传进程数 [默认值：3]  
					duplicate: false, // 是否重复上传（同时选择多个一样的文件），true 可以重复上传  
					prepareNextFile: true, // 上传当前分片时预处理下一分片  
					swf: 'Uploader.swf', // swf 文件路径    
					server: fspath + '/file/upload/singleFile', // 文件接收服务端  
					fileSizeLimit: 5 * 1024 * 1024 * 1024, //5G 验证文件总大小是否超出限制, 超出则不允许加入队列  
//					fileNumLimit: 5,//只能选5个文件
					fileSingleSizeLimit: 1 * 1024 * 1024 * 1024, //1G 验证单个文件大小是否超出限制, 超出则不允许加入队列  
					pick: {
						id: '#picker', // 这个 id 是你要点击上传文件按钮的外层 div 的 id  
						multiple: true // 是否可以批量上传，true 可以同时选择多个文件  
					},
					resize: false, // 不压缩 image, 默认如果是 jpeg，文件上传前会先压缩再上传！  
					accept: {
						// 允许上传的文件后缀，不带点，多个用逗号分割  
						extensions: "txt,jpg,jpeg,bmp,png,zip,rar,war,pdf,cebx,doc,docx,ppt,pptx,xls,xlsx",
						mimeTypes: '.txt,.jpg,.jpeg,.bmp,.png,.zip,.rar,.war,.pdf,.cebx,.doc,.docx,.ppt,.pptx,.xls,.xlsx',
					}
				});
			},
			uploaderFileOperation() {
				// 当有文件被添加进队列的时候（点击上传文件按钮，弹出文件选择框，选择完文件点击确定后触发的事件）   
				let that = this;
				this.uploader.on('fileQueued', function(file) {
					// 限制单个文件的大小 超出了提示  
					if(file.size > 3 * 1024 * 1024 * 1024) {
						that.$message.error("单个文件大小不能超过 3G");
						return false;
					}
					file.progress = '等待上传';
					file.isUpload = 0;
					// 将选择的文件添加进文件数组  
					that.filesArr.push(file); //可以多次选择多次文件
					that.uploader.stop(true);
				});
				
				//当某个文件的分块在发送前触发
				this.uploader.on('uploadBeforeSend', function(object, data,headers) {
					data.fileMd5 = that.fileMd5;
//					data.fileName = that.fileName;
//					data.fileExtName = that.fileExtName;
					data.fileLength = that.fileLength;
					data.groupName = that.groupName;
					data.filePath = that.filePath;
					
					data.chunks = that.chunks;
					data.chunk = that.chunk;
					data.chunkSize = that.chunkSize;
				});
				
				 // 当开始上传流程时触发
			    this.uploader.on( "startUpload", function() {
//			        console.log("startUpload");
			    });
			    
			     //当某个文件上传到服务端响应后，会派送此事件来询问服务端响应是否有效。
			    this.uploader.on( "uploadAccept", function(object,res) {
			    	if(res.code === 200){
				    	if(res.data){
				    		that.filePath = res.data.filePath;
				    		that.groupName = res.data.groupName;
				    	}
				   }else{
						that.uploader.reset();
					}
			    });
			     
				// 文件上传过程中创建进度条实时显示  
				this.uploader.on('uploadProgress', function(file, percentage) {
					//先找到文件列表里的当前上传的那个文件，修改进度
					for(var i = 0; i < that.filesArr.length; i++) {
						if(that.filesArr[i].id === file.id) {
							file.progress = Math.round(percentage * 100) + '%';
							file.isUpload = 1;
							that.$set(that.filesArr,i,file);
							break;
						}
					}
				});

				// 上传成功后执行的方法  
				this.uploader.on('uploadSuccess', function(file, response) {
					//先找到文件列表里的当前上传的那个文件，修改为上传成功
					for(var i = 0; i < that.filesArr.length; i++) {
						if(that.filesArr[i].id === file.id) {
							file.progress = '上传成功';
							file.isUpload = 2;
							that.$set(that.filesArr,i,file);
							break;
						}
					}
				});

				// 上传成功后执行的方法  
				this.uploader.on('uploadFinished', function() {
					that.$emit("listenUploadFinished",false,'上传');
				});

				// 上传出错后执行的方法  
				this.uploader.on('uploadError', function(file) {
					//先找到文件列表里的当前上传的那个文件，修改为错误
					for(var i = 0; i < that.filesArr.length; i++) {
						if(that.filesArr[i].id === file.id) {
							file.progress = '上传出错';
							file.isUpload = 0;
							that.$set(that.filesArr,i,file);
							break;
						}
					}
					that.uploader.stop(true);
					that.$emit("listenUploadFinished",false,'上传');
				});

				//当validate不通过时，会以派送错误事件的形式通知调用者
				this.uploader.on("error",function(type){
				   that.uploader.reset();
			       if(type ==='F_EXCEED_SIZE'){
			       		that.$message.error("文件大小不能超过1G");
			       }else if(type ==='Q_TYPE_DENIED'){
			       		that.$message.error("文件类型错误");
			       }else if(type ==='Q_EXCEED_SIZE_LIMIT'){
			       		that.$message.error("所选文件大小总和不能超过5G");
			       }
//			       else if(type ==='Q_EXCEED_NUM_LIMIT'){
//			       		that.$message.error("所选文件个数不能超过5个");
//			       }
			   });
 
				// 文件上传成功失败都会走这个方法  
				this.uploader.on('uploadComplete', function(file) {
//					console.log("uploadComplete")
				});

				this.uploader.on('all', function(type) {
					if(type === 'startUpload') {
						that.state = 'uploading';
					} else if(type === 'stopUpload') {
						that.state = 'paused';
					} else if(type === 'uploadFinished') {
						that.state = 'done';
					}
				});
			},
			delfile(row) {
				// 删除队列中的文件  
				this.uploader.removeFile(row.id, true);
				// 数组中的文件也要删除  
				for(var i = 0; i < this.filesArr.length; i++) {
					if(this.filesArr[i].id === row.id) {
						this.filesArr.splice(i, 1);
					}
				}
			},
			pauseUpload(){
				this.uploader.stop(true);
				this.$emit("listenUploadFinished",false,"继续上传");
			},
			upload() {
				let that = this;
				if(this.state === 'uploading') {
					this.uploader.stop(true);
				} else {
					this.uploader.upload();
				}
			}
		},
		mounted() {
			this.uploadRegister();
			this.uploadCreate();
			this.uploaderFileOperation();
		}
	}
</script>
<style>
	.uploadArea {
		float: left;
	}
	
	.webuploader-pick {
		padding: 5px 10px !important;
	}
	
	.selfile {
		margin-top: 15px;
	}
</style>
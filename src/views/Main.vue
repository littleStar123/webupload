<template>
	<div>
		<div class="gdul_location">
			<a href="#">全部文件</a>
			<i class="iconfont">&#xe649;</i>
			<a href="#">文档</a>
			<i class="iconfont">&#xe649;</i>
			<span>中国兵器网上超市</span>
		</div>
		<div class="gdul_cont">
			<div class="gdul_btnlist clearfix">
				<a class="fl gdul_btng" href="javascript:;" @click="selectFile"><i class="iconfont">&#xe663;</i>上传文件</a>
				<a class="fl gdul_btnbk" href="javascript:;" @click="createFile"><i class="iconfont">&#xe615;</i>新建文件夹</a>
				<a class="fl gdul_btnbk" href="#"><i class="iconfont">&#xe63c;</i>移到回收站</a>
			</div>
			<div class="gdul_tablist">
				<div class="itemhd">
					<div class="item_tit">
						<div class="label">
							<span class="checkbox">
						                <input type="checkbox" name="checkbox">
						                <label class="cklabel">
						                  <i class="icon"></i>
						                </label>
						              </span>
						</div>
						<div class="name c999">文件名</div>
					</div>
					<div class="item_info">
						<span class="info_list info_size">大小</span>
						<span class="info_list info_time">日期</span>
					</div>
				</div>
				<ul id="fileList">
					<li class="item" v-for="file in listData" :key="file.fileName">
						<div class="item_tit">
							<div class="label">
								<span class="checkbox">
						                  <input type="checkbox" name="checkbox">
						                  <label class="cklabel">
						                    <i class="icon"></i>
						                  </label>
						                </span>
							</div>
							<div class="type"><img :src="filepath+file.fileType"></div>
							<div class="name">
								<span v-if="file.fileName ==='' ">
											<el-input type="text" size="small" name="cfile" @blur="saveFile" autofocus></el-input>
										</span>
								<span else>{{file.fileName}}</span>

							</div>
						</div>
						<div class="item_info">
							<span class="info_list info_icon">
						                <a class="act" href="#"><i class="iconfont">&#xe63c;</i></a>
						                <a class="act" href="#"><i class="iconfont">&#xe61b;</i></a>
						                <a class="act" href="javascript:;" @click="toMove"><i class="iconfont">&#xe61c;</i></a>
						              </span>
							<span class="info_list info_size">{{file.fileSize}}</span>
							<span class="info_list info_time">{{file.fileDate}}</span>
						</div>
					</li>
				</ul>
			</div>
		</div>
		<div class="gdul_popup gdul_popupfile" v-if="showUpload">
			<div class="hd">
				<span>上传文件</span>
				<a class="fr close" href="javascript:;" @click="closeUpload"><i class="iconfont">&#xe604;</i></a>
			</div>
			<div class="bd">
				<div class="cont">
					<div class="filename">上传到：网络硬盘收藏夹</div>
					<div class="gdul_filecata">
						<ul>
							<li>
								<div class="item"><i class="iconfont">&#xe6c3;</i>全部</div>
								<div class="sub_file">
									<ul>
										<li>
											<div class="item"><i class="iconfont">&#xe6c3;</i>网上超市banner文件夹</div>
											<div class="sub_file">
												<ul>
													<li class="cur">
														<div class="item">产品图片</div>
													</li>
												</ul>
											</div>
										</li>
										<li>
											<div class="item">网络硬盘收藏夹</div>
										</li>
										<li>
											<div class="item">QQ文件</div>
										</li>
										<li>
											<div class="item">宣传图</div>
										</li>
									</ul>
								</div>
							</li>
						</ul>
					</div>
				</div>
				<v-upload ref="vupload" v-on:listenUploadFinished="listenUploadFinished"></v-upload>
				<div class="popbtn">
					<el-button type="success" @click="saveUpload" :loading="uploading">{{uploadBtName}}</el-button>
					<el-button type="default" @click="closeUpload">关闭</el-button>
				</div>
			</div>
		</div>
		<div class="gdul_popup_move gdul_popupfile_move" v-if="showMove">
			<div class="hd">
				<span>选择存储位置</span>
				<a class="fr close" href="javascript:;" @click="closeMove"><i class="iconfont">&#xe604;</i></a>
			</div>
			<div class="bd">
				<div class="cont">
					<div class="selfile"><img src="../assets/images/gdul_icon_img.png">电脑主机图片.jpg<span class="fs12 c999">26K</span></div>
					<div class="filename">移动到：网络硬盘收藏夹</div>
					<div class="gdul_filecata_move">
						<ul>
							<li>
								<div class="item"><i class="iconfont">&#xe6c3;</i>全部</div>
								<div class="sub_file">
									<ul>
										<li>
											<div class="item"><i class="iconfont">&#xe6c3;</i>网上超市banner文件夹</div>
											<div class="sub_file">
												<ul>
													<li class="cur">
														<div class="item">产品图片</div>
													</li>
												</ul>
											</div>
										</li>
										<li>
											<div class="item">网络硬盘收藏夹</div>
										</li>
										<li>
											<div class="item">QQ文件</div>
										</li>
										<li>
											<div class="item">宣传图</div>
										</li>
									</ul>
								</div>
							</li>
						</ul>
					</div>
				</div>
				<div class="popbtn">
					<a class="gdul_btng" href="javascript:;" @click="sureMove">确定</a>
					<a class="gdul_btnbk" href="javascript:;" @click="closeMove">取消</a>
				</div>
			</div>
		</div>
		<div class="gdul_poptips" v-if="showTip"><i class="iconfont">&#xe60e;</i>文件移动成功！</div>
	</div>
</template>

<script>
	import vUpload from './include/Upload.vue'
	import {filepath} from '../api/api'
	export default {
		data() {
			return {
				showUpload: false,
				showMove: false,
				showTip:false,
				addFile: {},
				filepath:filepath,
				uploading:false,
				uploadBtName:'上传',
				listData: [{
					filePkid: '1',
					fileType: '/static/images/gdul_icon_file.png',
					fileName: '网上超市banner文件夹',
					fileSize: '',
					fileDate: '2017-08-18 15:30'
				}, {
					filePkid: '2',
					fileType: '/static/images/gdul_icon_video.png',
					fileName: '宣传视频公司介绍.rmvb',
					fileSize: '255.5M',
					fileDate: '2017-08-18 15:30'
				}, {
					filePkid: '3',
					fileType: '/static/images/gdul_icon_img.png',
					fileName: '电脑主机图片.jpg',
					fileSize: '50K',
					fileDate: '2017-08-18 15:30'
				}, {
					filePkid: '4',
					fileType: '/static/images/gdul_icon_txt.png',
					fileName: '中兵网上超市一周工作报告.txt',
					fileSize: '3M',
					fileDate: '2017-08-18 15:30'
				}]
			}
		},
		components: {
			vUpload
		},
		methods: {
			selectFile() {
				this.showUpload = true;
				this.$emit("listenOver",true);
			},
			listenUploadFinished(flag,btName){
				this.uploading = false;
				this.uploadBtName = btName;
			},
			saveUpload(){
//				this.showUpload = false;
//				this.showTip = true;
//				setTimeout(this.hideTip,2000); 
				this.uploading = true;
				this.$refs.vupload.upload();
			},
			hideTip(){
				this.showTip = false;
				this.$emit("listenOver",false);
			},
			closeUpload() {
				this.showUpload = false;
				this.$emit("listenOver",false);
			},
			toMove() {
				this.showMove = true;
				this.$emit("listenOver",true);
			},
			sureMove() {
				this.showMove = false;
				this.$emit("listenOver",false);
			},
			closeMove() {
				this.showMove = false;
				this.$emit("listenOver",false);
			},
			createFile() {
				for(var i = 0; i < this.listData.length; i++) {
					if(this.listData[i].filePkid === '' && this.listData[i].fileName === '') {
						this.listData.splice(i, 1);
					}
				}
				this.addFile = {
					filePkid: '',
					fileType: '/static/images/gdul_icon_file.png',
					fileName: '',
					fileSize: '',
					fileDate: '2017-08-18 15:30'
				}
				this.listData.push(this.addFile);
			},
			saveFile() {
				if($("input[name='cfile']").val().trim() === '') {
					this.listData.pop();
				} else {
					this.listData.pop();
					this.addFile.fileName = $("input[name='cfile']").val().trim();
					this.listData.push(this.addFile);
				}
			}
		}
	}
</script>

<style>

</style>
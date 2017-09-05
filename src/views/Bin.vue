<template>
	<div>
		<div class="gdul_location">
			<a href="#">全部文件</a>
			<i class="iconfont">&#xe649;</i>
			<span>回收站</span>
		</div>
		<div class="gdul_cont">
			<div class="gdul_btnlist clearfix">
				<a class="fl gdul_btnbk" href="javascript:;" @click="toReCover"><i class="iconfont">&#xe63d;</i>全部清空</a>
				<a class="fl gdul_btnbk" href="#"><i class="iconfont">&#xe619;</i>全部恢复</a>
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
						<span class="info_list info_time">日期</span>
						<span class="info_list info_size"></span>
					</div>
				</div>
				<ul>
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
							<div class="name">{{file.fileName}}</div>
						</div>
						<div class="item_info">
							<span class="info_list info_icon">
				               <a class="act" href="#"><i class="iconfont">&#xe63c;</i></a>
				               <a class="act" href="#"><i class="iconfont">&#xe603;</i></a>
				             </span>
							<span class="info_list info_time">{{file.fileDate}}</span>
							<span class="info_list info_size">{{file.fileStay}}</span>
						</div>
					</li>
				</ul>
			</div>
		</div>
		<div class="gdul_popup_bin" v-if="showAllClean">
			<div class="hd">
				<span>清空回收站</span>
				<a class="fr close" href="javascript:;" @click="closeClean"><i class="iconfont">&#xe604;</i></a>
			</div>
			<div class="bd">
				<dl>
					<dt>确定清空回收站吗？</dt>
					<dd>清空后将无法找回已删除的文件</dd>
				</dl>
				<div class="popbtn">
					<a class="gdul_btng" href="javascript:;" @click="sureAllClean">确定</a>
					<a class="gdul_btnbk" href="javascript:;" @click="closeClean">取消</a>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {filepath} from '../api/api'
	export default {
		data() {
			return {
				showAllClean: false,
				filepath:filepath,
				listData: [{
					filePkid: '2',
					fileType: '/static/images/gdul_icon_video.png',
					fileName: '宣传视频公司介绍.rmvb',
					fileStay: '剩余8天',
					fileDate: '2017-08-18 15:30'
				}, {
					filePkid: '3',
					fileType: '/static/images/gdul_icon_img.png',
					fileName: '电脑主机图片.jpg',
					fileStay: '剩余5天',
					fileDate: '2017-08-18 15:30'
				}, {
					filePkid: '4',
					fileType: '/static/images/gdul_icon_txt.png',
					fileName: '中兵网上超市一周工作报告.txt',
					fileStay: '剩余3天',
					fileDate: '2017-08-18 15:30'
				}]
			}
		},
		methods: {
			closeClean() {
				this.showAllClean = false;
				this.$emit("listenOver",false);
			},
			toReCover() {
				this.showAllClean = true;
				this.$emit("listenOver",true);
			},
			sureAllClean() {
				this.listData = [];
				this.showAllClean = false;
				this.$emit("listenOver",false);
			}
		}
	}
</script>

<style>

</style>
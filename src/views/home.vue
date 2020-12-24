<template>
  <div class="wrapper">
		<el-container  style="height: 100%;">
			<!-- 头部 -->
			<el-header>
				<vHead @collapseaa="packup"></vHead>
			</el-header>

			<el-container>
				<!-- 侧边栏 -->
				<vSidebar :logo="isCollapse"></vSidebar>
				<!-- 内容 -->
				<div class="content">
					<vTags></vTags>
					 <div class="content">
                <transition name="move" mode="out-in">
                     <keep-alive :include="tagsList">
                        <router-view></router-view>
                     </keep-alive>
                </transition>
            </div>
				</div>
			</el-container>

		</el-container>
	</div>
</template>
<script>
	import  vHead from "../components/Header.vue"
	import  vSidebar from "../components/Sidebar.vue"
	import  vTags from "../components/Tags.vue"
	export default {
		data () {
			return {
				isCollapse: false,
				tagsList: [],
			}
		},
		components: {
			vHead,
			vSidebar,
			vTags
		},
		created(){
          //  this.$on('collapse', msg => {
          //       this.collapse = msg;
          //   })

            // 只有在标签页列表里的页面才使用keep-alive，即关闭标签之后就不保存到内存中了。
            // bus.$on('tags', msg => {
            //     let arr = [];
            //     for(let i = 0, len = msg.length; i < len; i ++){
            //         msg[i].name && arr.push(msg[i].name);
            //     }
            //     this.tagsList = arr;
            // })
        },
		methods: {
			// 父接收子传过来的
			packup(msg) {
				this.isCollapse = msg
			}
		}
	}
</script>
<style>
 .el-header {
    background-color: #6b5858;
    text-align: center;
    line-height: 60px;
  }
  
  .el-aside {
    text-align: center;
    line-height: 200px;
  }
  
  .el-main {
    background-color: #E9EEF3;
    
  }
  
  body > .el-container {
    margin-bottom: 40px;
  }
	.content {
		width: 100%;
	}
</style>
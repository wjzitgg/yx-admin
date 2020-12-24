<template>
  <div class="header">
    <!-- 左边 -->
    <div class="logo">
      <img src="../assets/image/yx-logo.png" alt="">
      后台系统
       <!-- 折叠按钮 -->
      <div class="fold-btn" @click="collapseChage">
        <i class="el-icon-menu"></i>
      </div>
    </div>
    <!-- 右边 -->
  <div class="head-right">
     <div class="btn-fullscreen" @click="handleFullScreen">
          <el-tooltip effect="dark" :content="fullscreen?`取消全屏`:`全屏`" placement="bottom">
              <i class="el-icon-rank"></i>
          </el-tooltip>
      </div>
      <div class="username">{{username}}</div>
      <!-- 头像 -->
      <div class="user-avator"><img src="../assets/image/avatar.jpeg"></div>
      
       <el-dropdown trigger="click" @command="handleCommand">
        <span class="el-dropdown-link">
          <i class="el-icon-caret-bottom quit"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
    </el-dropdown>
  </div>
   
   

  </div>
</template>
<script>
  export default {
    data () {
      return {
        fullscreen: false,
        collapse: false,
        username:'',
      }
    },
    created () {
      this.username = localStorage.getItem('username')
    },
    methods: {
      // 全屏事件
            handleFullScreen(){
                let element = document.documentElement;
                if (this.fullscreen) {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.webkitCancelFullScreen) {
                        document.webkitCancelFullScreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if (document.msExitFullscreen) {
                        document.msExitFullscreen();
                    }
                } else {
                    if (element.requestFullscreen) {
                        element.requestFullscreen();
                    } else if (element.webkitRequestFullScreen) {
                        element.webkitRequestFullScreen();
                    } else if (element.mozRequestFullScreen) {
                        element.mozRequestFullScreen();
                    } else if (element.msRequestFullscreen) {
                        // IE11
                        element.msRequestFullscreen();
                    }
                }
                this.fullscreen = !this.fullscreen;
            },
          //退出登录
          handleCommand(command) {
            if(command == "logout") {
              localStorage.clear();
              this.$router.push('/login')
            }
          },
           // 侧边栏折叠
          collapseChage(){
              this.collapse = !this.collapse;
              this.$emit('collapseaa', this.collapse);
          },
    }
  }
</script>
<style lang="scss" scoped>
  .header{
        display: flex;
        justify-content: space-between;
        box-sizing: border-box;
        width: 100%;
        font-size: 22px;
        color: #fff;
      .fold-btn {
          padding: 0 21px;
          cursor: pointer;
   
      }
      .logo {
          color: #fff;
          display: flex;
          align-items: center;
        img {
          width: 60px;
          height: 60px;
        }
      }
  }
  .username {
    font-size: 16px;
    margin-right: 10px;
  }
  // 头像右边
  .head-right {
    display: flex;
    align-items: center;
    position: relative;
    margin-right: 30px;
    .btn-fullscreen {
      cursor: pointer;
      margin-right: 20px;
      font-size: 26px;
    }
      // 头像
   .user-avator {
       width:40px;
       height:40px;
       border-radius: 50%;
       overflow: hidden;
    }
    .user-avator img{
       width: 100%;
       height: 100%;
    }
    // .quit {
    //   cursor: pointer;
    //   position: absolute;
    //   right: -22px;
     
    // }
  }
  .el-dropdown-link {
    cursor: pointer;
    color: #fff;
    position: absolute;
    top: -16px;

  }
  .el-dropdown-menu , .el-popper {
    top: 42px !important;
  }
  
 
</style>
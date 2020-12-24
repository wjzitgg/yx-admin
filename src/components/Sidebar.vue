<template>
  <div class="sidebar">
    <el-menu
      :default-active="onRoutes"
      class="el-menu-vertical-demo"
      :collapse="logo"
      background-color="#545c64"
      text-color="rgb(191, 203, 217)"
      router
    >
       <el-menu-item :index="item.menu_url" v-for="item in titleData" :key="item.index">
          <i :class="item.icon"></i>
          <span slot="title">{{item.power_name}}</span>
      </el-menu-item>
      
    </el-menu>
  </div>
</template>
<script>
  export default {
    data () {
      return {
         isCollapse: false,
        //  侧边栏数据
         textList: JSON.parse(localStorage.getItem("permissions")),
         titleData:[]
      }
    },
    props: ['logo'],
    // 计算属性 点击tags路由变化触发
    computed:{
          onRoutes(){
            // console.log('触发吗？');
              return this.$route.path.replace('/','');
          }
      },
    created () {
      this.permissionsText()
    },
    methods: {
      // 获取侧边栏数据
      permissionsText() {
        for (let i = 0; i < this.textList.length; i++) {
          let o = this.textList[i];
          if (this.textList[i].power_name == '系统首页') {
                 o.icon = 'el-icon-s-home'
          }if(this.textList[i].power_name=='管理员列表'){
                 o.icon = 'el-icon-s-custom'
          }if (this.textList[i].power_name == '权限列表') {
                 o.icon = 'el-icon-s-management'
          }if (this.textList[i].power_name == '角色列表') {
                 o.icon = 'el-icon-s-check'
          }if (this.textList[i].power_name == '部门列表') {
                 o.icon = 'el-icon-s-cooperation'
          }if (this.textList[i].power_name == '订单列表') {
                 o.icon = 'el-icon-s-order'
          }
           this.titleData.push(o);
        }
        // console.log(this.titleData);
      },
    }
  }
</script>
<style lang="scss" scoped>
 .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    height: 100%;
  }
  .el-menu-vertical-demo {
    height: 100%;
  }
  .el-menu-item {
 
  font-size: 16px;
}
</style>
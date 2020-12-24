<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
  /* 初始化样式 */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  html,
  body,
  #app,
  .wrapper {
    width: 100%;
    height: 100%;
  }
  a {
    text-decoration: none;
  }
  .app-container {
    padding: 20px 20px 45px 20px;
  }
/* 分页样式 */
.pagination {
    margin: 20px 0;
    /* text-align: right; */
}
</style>

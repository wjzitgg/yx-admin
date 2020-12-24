<template>
  <div class="login-warp">
    <!-- 登录框 -->
    <div class="login-box">
      <div class="yx-tit">研芯后台管理系统</div>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        class="demo-ruleForm"
      >
        <el-form-item prop="name">
          <el-input
            type="text"
            v-model="ruleForm.name"
            autocomplete="off"
            placeholder="账号"
          >
            <i slot="prefix" class="iconfont iconzhanghao" />
          </el-input>
        </el-form-item>
        <el-form-item prop="pass">
          <el-input
            type="password"
            v-model="ruleForm.pass"
            autocomplete="off"
            placeholder="密码"
          >
            <i slot="prefix" class="iconfont iconmima1" />
          </el-input>
        </el-form-item>
        <el-form-item prop="code" class="yx-code">
          <el-input
            type="text"
            v-model="ruleForm.code"
            autocomplete="off"
            placeholder="请输入验证码"
            style="width: 50%;"
          >
            <i slot="prefix" class="iconfont iconverification-code" />
          </el-input>
          <div class="login-code" @click="getCode">
            <img :src="codeUrl">

          </div>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            @click="submitForm('ruleForm')"
            style="width: 100%"
          >
            <span v-if="!loading">登 录</span>
            <span v-else>登 录 中...</span>
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>


  export default {
    data() {
      return {
        ruleForm: {
          name: "",
          pass: "",
          code: ""
        },
        rules: {
          name: [{ required: true, message: "用户名不能为空", trigger: "blur" }],
          pass: [{ required: true, message: "密码不能为空", trigger: "blur" }],
          code: [{ required: true, message: "验证码不能为空", trigger: "blur" }],
        },
        loading: false,
        codeUrl: "",
        
      };
    },
    created () {
      this.getCode()
    },
    methods: {
      submitForm(formName) {
       
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loading = true;

        //     this.$axios.post("login/login", {
        //       username: this.ruleForm.name,
        //       password: this.ruleForm.pass,
        //       value: this.ruleForm.code
        //     }, {headers: {
        //     'Content-type': "application/json",
        //     'Set-Cookie': 'PHPSESSID=' + cooke}})
        //     .then(response => {
        //     console.log(response)})
        //     .catch(error => {
        //     console.log(error)
        // })
            // console.log(cooke);
            this.$post("login/login", {
              username: this.ruleForm.name,
              password: this.ruleForm.pass,
              value: this.ruleForm.code
            })
              .then((res) => {
                console.log(res);
                if (res.code == "success") {
                  this.$message.success(res.msg);
                  localStorage.setItem('token',res.data.token);
                  localStorage.setItem('permissions',JSON.stringify(res.data.role_power));
                  localStorage.setItem('username',this.ruleForm.name);
               
                  this.$router.push('/');

                } else {
                  this.loading = !this.loading;
                  this.$message.error(res.msg);
                }
              })
              .catch((err) => {
                console.log(err);
                this.loading = !this.loading;
                this.$message.error(err.message);
              });
          }
        });
      },
      getCode() {
          // 获取远端验证码
          // window.location.reload();
        let numb = Math.ceil(Math.random()*10);
        console.log(numb);
        let that = this
        this.$axios({
          method:'get',
          url: 'http://5343.94un.com/admin/login/verify'+"?id="+numb,
        })
          .then(function(res) {
          console.log(res);
          that.codeUrl = res.config.url;
        });
      },
      
    },
  };
</script>
<style lang="scss">
  .login-warp {
    width: 100%;
    height: 100%;
    background-image: url("../assets/image/background.jpg");
    background-size: cover;
  }
  .login-box {
    position: fixed;
    top: 30%;
    left: 50%;
    margin-left: -192.5px;
    border-radius: 6px;
    background: #ffffff;
    width: 385px;
    padding: 25px 25px 5px 25px;
    .yx-tit {
      margin: 0 auto 30px auto;
      text-align: center;
      color: #707070;
      font-size: 20px;
      font-weight: bold;
    }
  }
 
  .login-code {
    cursor: pointer;
    position: absolute;
    top: -14px;
    right: 0;
    width: 49%;
    height: 60px;
    img{
      width: 100%;
      height: 100%;
    }
  }
</style>
<template>
  <div class="app-container">
    <!-- 添加按钮 -->
    <div>
      <el-button type="primary" icon="el-icon-plus" @click="addAssets" class="added">新增</el-button>
      <el-input v-model="yxorder" size="medium" clearable placeholder="请输入要搜索的合同编号" @clear="empty" style="width: 300px; margin-left: 20px;">
        <el-button slot="append" icon="el-icon-search" @click="orderSearch"></el-button>
      </el-input>
    </div>
    
    <!-- 金额 -->
    <div class="yx-money">
        <span class="order-money">订单总业绩：{{money_count}}元</span>
        <span>订单已收款：{{get_money}}元</span>
    </div>
    <!-- 表格数据 -->
    <div class="table">
       <el-table ref="singleTable" border :data="tableData" style="width: 100%">
        <el-table-column property="id" label="id" width="50"> </el-table-column>
        <el-table-column property="order_number" label="合同编号"></el-table-column>
        <el-table-column property="sale_name" label="销售姓名"></el-table-column>
        <el-table-column property="product_name" label="产品名称"></el-table-column>
        <el-table-column property="order_name" label="项目名称"></el-table-column>
        <el-table-column property="money_count" label="总金额"></el-table-column>
        <el-table-column property="get_money" label="已付金额"></el-table-column>
        <el-table-column property="signup_time" :formatter="dateFormat" label="签约时间" width="200"></el-table-column>
        <el-table-column property="development_time" label="开发周期(天)"></el-table-column>
        <el-table-column property="product_money" label="产品提成"></el-table-column>
        <el-table-column property="note" label="短信金额"></el-table-column>
        <el-table-column property="type" label="完成状态">
            <template slot-scope="scope">
              <div v-if="scope.row.type === 1 ">
                开发中
              </div>
              <div v-else>
                已完成
              </div>
          </template>
        </el-table-column>
        <el-table-column property="domain_name" label="域名" width="150"></el-table-column>
      
        <el-table-column fixed="right" label="操作"  width="200">
          <template slot-scope="scope">
            <div class="btnTop">
                <el-button size="mini" type="success" icon="el-icon-edit" @click="retainage(scope.row)">尾款</el-button>
              <el-button size="mini" type="primary" icon="el-icon-edit" @click="addAssets(scope.row)">编辑</el-button>
            </div>

              <el-button size="mini" type="info" icon="el-icon-check" @click="accomplish(scope.row)">完成</el-button>
              <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
              
          </template>
        </el-table-column>
      </el-table>
       <!-- 分页脚 -->
      <div class="pagination">
          <el-pagination background @current-change="handleCurrentChange" :page-size="length" layout="total, prev, pager, next" :total='total'>
          </el-pagination>
      </div>
    </div>
      <!-- 添加编辑弹出框 -->
      <el-dialog :title="form.id?'订单修改':'添加订单'" :visible.sync="editVisible" >
          <el-form ref="form" :model="form" inline label-width="100px">
              <el-form-item label="合同编号 :">
                  <el-input v-model="form.order_number"></el-input>
              </el-form-item>
              <el-form-item label="销售姓名 :">
                  <el-input  v-model="form.sale_name"></el-input>
              </el-form-item>
              <el-form-item label="产品名称 :">
                  <el-input  v-model="form.product_name"></el-input>
              </el-form-item>
              <el-form-item label="项目名称 :">
                  <el-input  v-model="form.order_name"></el-input>
              </el-form-item>
              <el-form-item label="总金额(元) :">
                  <el-input  v-model="form.money_count"></el-input>
              </el-form-item>
              <el-form-item label="已付金额(元) :">
                  <el-input  v-model="form.get_money"></el-input>
              </el-form-item>
              <el-form-item label="产品提成(元):">
                  <el-input  v-model="form.product_money"></el-input>
              </el-form-item>
              <el-form-item label="短信金额(元) :">
                  <el-input  v-model="form.note"></el-input>
              </el-form-item>
              <el-form-item label="域名 :">
                  <el-input  v-model="form.domain_name"></el-input>
              </el-form-item>
               <el-form-item label="开发周期(天) :">
                  <el-input  v-model="form.development_time"></el-input>
              </el-form-item>
                <el-form-item label="签约时间:">
                   <el-date-picker
                   value-format="timestamp"
                   @change="optionDate"
                    v-model="value1"
                    type="datetime"
                    placeholder="选择日期时间">
                  </el-date-picker>
              </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
              <el-button @click="editVisible = false">取 消</el-button>
              <el-button type="primary" @click="saveEdit(form)">确 定</el-button>
          </span>
      </el-dialog>
       <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px">
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow(delid)">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 订单完成状态弹框 -->
        <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
        <el-radio-group v-model="radio">
          <el-radio :label="1">开发中</el-radio>
          <el-radio :label="2">已完成</el-radio>
        </el-radio-group>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="determine(orderId)">确 定</el-button>
        </span>
      </el-dialog>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        tableData: [],
        money_count:'',
        get_money:'',
        yxorder:"",
        // 当前页数
        cur_page: 1,
        length: 10,
        total:0,
        form:{},
        // 订单列表
        data3: [],
        editVisible: false,
        delVisible: false,
        // 时间日期
         value1: '',
        //  订单完成弹窗
         dialogVisible:false,
         radio: 2,
      };
    },
    created() {
      this.getData();
    },
    methods: {
      // 订单列表
       getData() {
        this.$post("order/order_lst", {
          lenght: this.length,
          current: this.cur_page,
        }).then( res => {
          console.log(res);
           if (res.code == 'success') {
            this.total = res.data.count;
            this.tableData = res.data.data;
            // 总金额
            this.money_count = res.data.money_count;
            // 已收取金额
            this.get_money = res.data.get_money;
          } else {
            this.$message.error(res.msg);
          }
        }).catch((err) => {
                this.$message.error(err.msg);
          });
      },
      // 时间选择器
      optionDate(res) {
        console.log(res);
        console.log(this.value1);
      },
      // 时间戳转格式
      dateFormat(row, column) {
      var date = new Date(row.signup_time*1000) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + '年'
      var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '月'
      var D = date.getDate() + '日' + " "
      var h = date.getHours() + ':'
      var m = date.getMinutes() + ':'
      var s = date.getSeconds()
      return Y+M+D+h+m+s
      },
       // 分页导航
      handleCurrentChange(val) {
          this.cur_page = val;
          this.getData();
      },
      // 添加
      addAssets(row) {
          if(row.id!=undefined){
            console.log(row);
              this.form = row;
              this.value1 = row.signup_time * 1000;
              this.adduid = false
          }else{
              this.form={};
              this.adduid=true
              this.value4 = []
          }
          this.editVisible = true;
      },
      // 尾款写入
      retainage(row) {
        console.log(row);
         this.$prompt('请输入尾款金额', row.order_name, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /(?:^[1-9]([0-9]+)?(?:\.[0-9]{1,2})?$)|(?:^(?:0){1}$)|(?:^[0-9]\.[0-9](?:[0-9])?$)/,
          inputErrorMessage: '请输入正确金额'
        }).then(({ value }) => {
          // 成功
          this.$post("order/order_money_add", {
              money: value,
              id: row.id
            }).then( res => {
              console.log(res);
              if (res.code == 'success') {
                this.$message.success(res.msg);
                this.getData();
              } else {
                this.$message.error(res.msg);
              }
            }).catch((err) => {
                    this.$message.error(err.msg);
              });
        }).catch(() => {
          // 点击取消
          this.$message({
            type: 'info',
            message: '已取消'
          })   
         })
      },
      // 订单搜索
      orderSearch(){
        this.$post("order/order_lst", {
          order_number: this.yxorder,
        }).then( res => {
          console.log(res);
           if (res.code == 'success') {
            this.tableData = res.data.data;
          } else {
            this.$message.error(res.msg);
          }
        }).catch((err) => {
                this.$message.error(err.msg);
          });
      },
      // 搜索输入框清空
      empty() {
        this.getData();
      },
         // 保存编辑
        saveEdit(form) {
            // alert(this.value4);
            // if(form.domain_name=='' || form.domain_name==undefined){
            //     this.$message.error('请输入订单名称！');
            //     return
            // }else if(form.development_time=='' || form.url==development_time){
            //     this.$message.error('请输入订单路径');
            //     return
            // }
            let time_stamping = this.value1/1000;
            console.log(time_stamping);
            if(!form.id){
                // 添加
                this.$post('order/order_add',
                {
              development_time: this.form.development_time,
              domain_name: this.form.domain_name,
              get_money: this.form.get_money,
              money_count: this.form.money_count,
              note: this.form.note,
              order_name: this.form.order_name,
              order_number: this.form.order_number,
              product_money: this.form.product_money,
              product_name: this.form.product_name,
              sale_name: this.form.sale_name,
              signup_time: time_stamping,
                }).then((res) => {
                  console.log(res);
                    if(res.code == "success"){
                        this.cur_page = this.cur_page;
                        this.getData();
                        this.editVisible = false;
                        this.$message.success(res.msg)
                    }else{
                        this.$message.error(res.msg);
                    }
                }).catch((err) => {
                    this.$message.error(err.msg);
                });
            }else{
                // 编辑修改
                this.$post('order/order_upd',{
                    id:this.form.id,
                    development_time: this.form.development_time,
                    domain_name: this.form.domain_name,
                    get_money: this.form.get_money,
                    money_count: this.form.money_count,
                    note: this.form.note,
                    order_name: this.form.order_name,
                    order_number: this.form.order_number,
                    product_money: this.form.product_money,
                    product_name: this.form.product_name,
                    sale_name: this.form.sale_name,
                    signup_time: time_stamping,
                }).then((res) => {
                  console.log(res);
                    if(res.code == "success"){
                        this.cur_page = this.cur_page;
                        this.getData();
                        this.$message.success("修改成功！");
                        this.editVisible = false;
                    }else{
                        this.$message.error(res.msg);
                    }
                }).catch((err) => {
                    this.$message.error(err.msg);
                });
            }
        },
      // 编辑
      handleEdit(index, row) {
        console.log(index, row);
      },
      // 删除
      handleDelete(row) {
        // console.log(row)
        this.delid=row.id;
        this.delVisible = true;
      },
      // 确定删除
      deleteRow(id){
          this.$post('order/order_del',{
              id:id
          }).then((res) => {
              if(res.code == "success"){
                  this.cur_page = this.cur_page;
                  this.getData();
                  this.$message.success(res.msg)
              }else{
                  this.$message.error(res.msg);
              }
          }).catch((err) => {
              this.$message.error(err.msg);
          });
          this.delVisible = false;
      },
      // 订单完成确认
      accomplish(row) {
        // console.log(row);
        this.orderId = row.id;
        this.radio = row.type;
        this.dialogVisible = true;
      },
      determine(id){
        // console.log(this.radio,id);
        // return;
        this.$post('order/order_type_upd',{
              id:id,
              type:this.radio
          }).then((res) => {
              if(res.code == "success"){
                  this.getData();
                  this.$message.success(res.msg)
              }else{
                  this.$message.error(res.msg);
              }
          }).catch((err) => {
              this.$message.error(err.msg);
          });
           this.dialogVisible = false;
      }
    },
  };
</script>
<style lang="scss" scoped>
  .added {
    margin-bottom: 10px;
    padding: 10px 10px;
  }
  .yx-money {
    height: 30px;
  }
  .yx-money .order-money {
    margin-right: 36px;
  }
  .btnTop {
    margin-bottom: 5px;
  }
</style>
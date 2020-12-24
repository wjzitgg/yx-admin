<template>
  <div class="app-container">
    <!-- 添加按钮 -->
    <el-button type="primary" icon="el-icon-plus" @click="addAssets" class="added">新增</el-button>
    <!-- 表格数据 -->
    <div class="table">
       <el-table ref="singleTable" border :data="tableData" style="width: 100%">
        <el-table-column property="id" label="id" width="50"> </el-table-column>
        <el-table-column property="last_time" label="最近登录时间">
        </el-table-column>
        <el-table-column property="username" label="管理员账号">
        </el-table-column>
        <el-table-column property="role_name" label="拥有权限">
        </el-table-column>
        <el-table-column property="password" label="密码">
          <div>***********</div>
        </el-table-column>
        <el-table-column property="phone" label="手机">
        </el-table-column>
        <el-table-column property="department_name" label="所属部门">
        </el-table-column>

        <el-table-column property="type" label="状态">
          <template slot-scope="scope">
              <div v-if="scope.row.id === 1">
                 <el-switch
                disabled
                v-model="scope.row.type"
                :active-value="1"
                :inactive-value="2">
              </el-switch>
              </div>
              <div v-else>
                 <el-switch
                  @change="changeStatus(scope.row)"
                  v-model="scope.row.type"
                  :active-value="1"
                  :inactive-value="2">
                </el-switch>
              </div>
             
          </template>
        </el-table-column>

        <el-table-column fixed="right" label="操作"  width="200">
          <template slot-scope="scope">
              <el-button size="mini" type="primary" icon="el-icon-edit" @click="addAssets(scope.row)"></el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(scope.row)"></el-button>
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
      <el-dialog :title="form.id?'角色修改':'添加角色'" :visible.sync="editVisible" width="40%">
          <el-form ref="form" :model="form" label-width="100px">
              <el-form-item label="账号:">
                  <el-input v-model="form.username" maxlength="60"></el-input>
              </el-form-item>
              <el-form-item label="密码:">
                  <el-input type="password" v-model="form.password"></el-input>
              </el-form-item>
              <el-form-item label="手机:">
                  <el-input v-model="form.phone"></el-input>
              </el-form-item>
               <el-form-item label="权限:">
                    <el-select v-model="selectValue" popper-class="selectJob" size="small" placeholder="请选择权限">
                        <el-option
                            v-for="item in selectData"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                             <span style="float: left;width: 120px" :title="item.id" >{{item.id}}</span>
                            <span style="float: left;width: 120px;text-align: right" >{{item.name}}</span>
                        </el-option>
                        <div class="topbom">
                            <span class="text" @click.stop="prevePage">上一页</span>
                            <span class="text" style="padding-left: 30px" @click.stop="nextPage" v-show="selectPage !==pageCount">下一页</span>
                        </div>
                    </el-select>
<!--                    <el-input  v-model="form.administrators_id"></el-input>-->
                </el-form-item>
               <el-form-item label="部门:">
                    <el-select v-model="value2" popper-class="selectJob" size="small" placeholder="请选择部门" @change="choose">
                        <el-option
                            v-for="item in options"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                             <span style="float: left;width: 120px" :title="item.id" >{{item.id}}</span>
                            <span style="float: left;width: 120px;text-align: right" >{{item.name}}</span>
                        </el-option>
                    </el-select>
<!--                    <el-input  v-model="form.administrators_id"></el-input>-->
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
  </div>
</template>
<script>
  export default {
    data() {
      return {
        tableData: [],
        valfales:false,
        valtrue:true,
        // 当前页数
        cur_page: 1,
        length: 10,
        total:0,
        form:{},
        // 权限列表
        data3: [],
        editVisible: false,
        delVisible: false,

        value: 1,
        //  权限id
        selectData:[],
        selectValue:'',
        pageCount: null,
        selectPage: 1,
        // 部门
        options:[],
        value2: '',
      };
    },
    created() {
      this.getData();
    },
    methods: {
      // 管理角色列表
       getData() {
        this.$post("admin/admin_lst", {
          lenght: this.length,
          current: this.cur_page,
        }).then( res => {
          console.log(res);
           if (res.code == 'success') {
            this.total = res.data.count;
            this.tableData = res.data.data;
          } else {
            this.$message.error(res.msg);
          }
        }).catch((err) => {
                this.$message.error(err.msg);
          });
      },
       // 分页导航
      handleCurrentChange(val) {
          this.cur_page = val;
          this.getData();
      },
      // 添加
      addAssets(row) {
          this.selectFun();
          this.branch();
          if(row.id!=undefined){
            console.log(row);
              this.form = row;
              this.adduid = false;
              this.selectValue=row.role_id;
              this.value2=row.department_id;
          }else{
              this.form={};
              this.adduid=true
              this.value4 = []
          }
          this.editVisible = true;
      },
        prevePage () {
                this.selectPage--
                if (this.selectPage < 1) { // 判断点击的页数是否小于1
                    this.selectPage = 1;
                };
                this.selectFun();
            },
        nextPage () {
            if (this.selectPage < this.pageCount) { // 判断点击的页数是否小于总页数;
                ++this.selectPage;
                this.selectFun();
            }
        },
        // 获取管理id权限
        selectFun(){
            this.$post('role/role_lst',{
                current:this.selectPage,
                lenght:5,
            }).then((res) => {
                console.log(res);
                if(res.code=="success"){
                    this.pageCount= Math.ceil(res.data.count/res.data.lenght);
                    this.selectData=res.data.data;
                    console.log(this.selectData);
                }else{
                    this.$message.error(res.msg);
                }
            }).catch((err) => {
                this.$message.error(err.msg);
            });
        },
        // 部门
        branch(){
            this.$post('department/department_lst',{
                current:this.selectPage,
                lenght:5,
            }).then((res) => {
                console.log(res);
                if(res.code=="success"){
                    this.options=res.data.data;
                }else{
                    this.$message.error(res.msg);
                }
            }).catch((err) => {
                this.$message.error(err.msg);
            });
        },
        // 选中的部门id
        choose(res) {
          
          this.value2 = res
          console.log(this.value2);
        },
         // 保存编辑
        saveEdit(form) {
            // alert(this.value4);
            if(form.username=='' || form.username==undefined){
                this.$message.error('请输入账号！');
                return
            }else if(form.password=='' || form.password==undefined){
                this.$message.error('请输入密码');
                return
            }else if(this.selectValue=='' || this.selectValue==undefined){
                this.$message.error('请设置权限');
                return
            }else if(this.value2=='' || this.value2==undefined){
                this.$message.error('请设置部门');
                return
            }
            if(!form.id){
                // 添加
                this.$post('admin/admin_add',{
                    username:this.form.username,
                    password:this.form.password,
                    phone:this.form.phone,
                    role_id:this.selectValue,
                    department_id:this.value2
                }).then((res) => {
                  console.log(res);
                    if(res.code == "success"){
                        this.cur_page =  this.cur_page;
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
                this.$post('admin/admin_upd',{
                    id:this.form.id,
                    username:this.form.username,
                    password:this.form.password,
                    phone:this.form.phone,
                    role_id:this.selectValue,
                    department_id:this.value2
                }).then((res) => {
                    if(res.code == "success"){
                        this.cur_page = this.cur_page;
                        this.getData();
                        this.$message.success(res.msg);
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
        console.log(row)
        this.delid=row.id;
        this.delVisible = true;
      },
      // 确定删除
      deleteRow(id){
       
          this.$post('admin/admin_del',{
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
      // 状态修改
      changeStatus(row) {
        // console.log(row);
        // return;
        this.$post('admin/admin_type_upd',{
              id:row.id,
              type:row.type
          }).then((res) => {
            console.log(res);
              if(res.code == "success"){
                  this.$message.success("状态更新成功！")
              }else{
                  this.$message.error(res.msg);
              }
          }).catch((err) => {
              this.$message.error(err.msg);
          });
      }
    },
  };
</script>
<style lang="scss" scoped>
  .added {
    margin-bottom: 10px;
    padding: 10px 10px;
  }
  // 分页上下
   .selectJob

    span{
        width :120px;
        overflow :hidden;
        text-overflow :ellipsis;
        white-space :nowrap}
     .text{
         padding-left: 10px;
         font-size: 14px;
         font-weight: bold;
         cursor: pointer;
         color: cornflowerblue;
     }
    .topbom {
      display: flex;
      padding: 5px 20px;
    }
</style>
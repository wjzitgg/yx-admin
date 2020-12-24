<template>
  <div class="app-container">
    <!-- 添加按钮 -->
    <el-button type="primary" icon="el-icon-plus" @click="addAssets" class="added">新增</el-button>
    <!-- 表格数据 -->
    <div class="table">
       <el-table ref="singleTable" border :data="tableData" style="width: 100%">
        <el-table-column property="id" label="id" width="50"> </el-table-column>
        <el-table-column property="create_time" label="创建时间" width="200"> </el-table-column>
        <el-table-column property="name" label="权限名称" width="220" center>
        </el-table-column>
        <el-table-column property="power_name" label="拥有权限">
          <template slot-scope="scope" >
              <span v-for="item in scope.row.power_name" :key="item.index">
                {{item + ','}}
              </span>
          </template>
        </el-table-column>
         <el-table-column property="update_time" label="更新时间" width="200"> </el-table-column>
        <el-table-column fixed="right" label="操作" width="200">
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
      <el-dialog :title="form.id?'管理权限修改':'添加管理员权限'" :visible.sync="editVisible" width="60%">
          <el-form ref="form" :model="form" label-width="100px">
              <el-form-item label="权限名称">
                  <el-input v-model="form.name"></el-input>
              </el-form-item>
              <el-form-item label="权限">
                  <template>
                      <el-transfer
                          v-model="value4"
                          :props="{
                            key: 'id',
                            label: 'name',
                          }"
                          :titles="['权限列表', '获取权限列表']"
                          :data="data3">
                      </el-transfer>
                  </template>
<!--                    <el-input  v-model="form.jurisdiction_name"></el-input>-->
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
        // 当前页数
        cur_page: 1,
        length: 10,
        total:0,
        form:{},
        // 权限列表
        data3: [],
        editVisible: false,
        delVisible: false,
        value4: []
        
      };
    },
    created() {
      this.getController();
    },
    methods: {
      // 管理员列表
       getController() {
        this.$post("role/role_lst", {
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
          this.getController();
      },
      // 添加
      addAssets(row) {
         this.selectFun();
          if(row.id!=undefined){
              this.form = row;
              this.adduid = false
              // this.value4 = row.jurisdiction_name
          }else{
              this.form={};
              this.adduid=true
              this.value4 = []
          }
          this.editVisible = true;
      },
       // 获取权限列表
        selectFun(){
            this.$post('power/power_lst',{lenght:100
            }).then((res) => {
              console.log(res);
                if(res.code=="success"){
                    this.data3=res.data.data;
                }else{
                    this.$message.error(res.msg);
                }
            }).catch((err) => {
                this.$message.error(err.msg);
            });
        },
         // 保存编辑
        saveEdit(form) {
            // alert(this.value4);
            if(form.name=='' || form.name==undefined){
                this.$message.error('请设置管理员名称！');
                return
            }else if(this.value4=='' || this.value4==undefined){
                this.$message.error('请输入权限id！');
                return
            }
            if(!form.id){
                // 添加
                console.log(this.value4);
                this.$post('role/role_add',{
                    name:this.form.name,
                    power_id:this.value4,
                }).then((res) => {
                  console.log(res);
                    if(res.code == "success"){
                        this.cur_page = 1;
                        this.getController();
                        this.editVisible = false;
                        this.$message.success(res.msg)
                    }else{
                        this.$message.error(res.msg);
                    }
                }).catch((err) => {
                    this.$message.error(err.msg);
                });
            }else{
              console.log("修改");
                // 编辑修改
                this.$post('role/role_upd',{
                    id:this.form.id,
                    name:this.form.name,
                    power_id:this.value4,
                }).then((res) => {
                  console.log(res);
                    if(res.code == "success"){
                        this.cur_page = 1;
                        this.getController();
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
        console.log(row)
        this.delid=row.id;
        this.delVisible = true;
      },
      // 确定删除
      deleteRow(id){
          this.$post('role/role_del',{
              id:id
          }).then((res) => {
              if(res.code == "success"){
                  this.cur_page = 1;
                  this.getController();
                  this.$message.success("删除成功！")
              }else{
                  this.$message.error(res.msg);
              }
          }).catch((err) => {
              this.$message.error(err.msg);
          });
          this.delVisible = false;
      }
    },
  };
</script>
<style lang="scss" scoped>
  .added {
    margin-bottom: 10px;
    padding: 10px 10px;
  }
</style>
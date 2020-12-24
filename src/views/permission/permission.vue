<template>
  <div class="app-container">
    <!-- 添加按钮 -->
    <el-button type="primary" icon="el-icon-plus" @click="addAssets" class="added">新增</el-button>
    <!-- 表格数据 -->
    <div class="table">
       <el-table ref="singleTable" border :data="tableData" style="width: 100%">
        <el-table-column property="id" label="id" width="150"> </el-table-column>
        <el-table-column property="name" label="权限名称">
        </el-table-column>
        <el-table-column property="menu_url" label="权限url">
          
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
      <el-dialog :title="form.id?'权限修改':'新增权限'" :visible.sync="editVisible" width="40%">
          <el-form ref="form" :model="form" label-width="100px">
              <el-form-item label="权限名称">
                  <el-input v-model="form.name" maxlength="60"></el-input>
              </el-form-item>
              <el-form-item label="权限路径">
                  <el-input :disabled="disabled" v-model="form.menu_url"></el-input>
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
        disabled:true
      };
    },
    created() {
      this.getData();
    },
    methods: {
      // 权限列表
       getData() {
        this.$post("power/power_lst", {
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
          if(row.id!=undefined){
              this.disabled = true
              this.form = row;
              // console.log(this.form);
              this.adduid = false
          }else{
              this.disabled = false
              this.form={};
              this.adduid=true
              this.value4 = []
          }
          this.editVisible = true;
      },
      
         // 保存编辑
        saveEdit(form) {
            // alert(this.value4);
            if(form.name=='' || form.name==undefined){
                this.$message.error('请输入权限名称！');
                return
            }else if(form.menu_url=='' || form.menu_url==undefined){
                this.$message.error('请输入权限路径');
                return
            }
            if(!form.id){
                // 添加
                this.$post('power/power_add',{
                    name:this.form.name,
                    menu_url:this.form.menu_url,
                    // type:1,
                }).then((res) => {
                  console.log(res);
                    if(res.code == "success"){
                       
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
                this.$post('power/power_upd',{
                    id:this.form.id,
                    name:this.form.name,
                    // url:this.form.url,
                    // type:this.form.type,
                   
                }).then((res) => {
                    if(res.code == "success"){
                      
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
          this.$post('power/power_del',{
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
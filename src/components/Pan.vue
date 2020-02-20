<template>
  <div class="pan">
     <div class="header">
       <div class="logo-lf">
         <div class="logo"></div>
         <div class="text">文案库</div>
       </div>
       
       <div class="nav-cont">
         <div 
           :class="currentCkNavIndex === index ? 'active' : ''"
           v-for="(item, index) in navitemList"
           :key="item.id"
           class="nav-item" 
           @click="handleCKNavItemClick(index)"
         >{{ item.name }}</div>
         <div class="item-icon" @click="handleCKmangeClick">
           仓库管理
         </div>
       </div>
     </div>
     <div class="content">
       <div class="left-bar">
          <div class="wenj">
            <!-- <el-scrollbar style="height:100%;"> -->
              <div class="item-head wen-li" @click="handlewenanjiaClick">
                <span class="file-icon"></span>
                <span class="file-text">
                  文案架
                </span>
              </div>
              <div 
                v-for="item in rackNavList"
                :Key="item.id"
                class="wen-li" @click="rackNavClick(item)">{{ item.docName }}</div>
            <!-- </el-scrollbar> -->
          </div>
          <div class="huishou" @click="handlehuishouzhanClick"></div>
       </div>
       <div class="right-cont">
         <div class="tool">
           <div class="too-btn">
              <el-button class="el-icon-upload2" type="primary"> 上传</el-button>
              <el-button class="el-icon-folder-opened" plain @click="handleAddWenjianjaClick"> 新建文件夹</el-button>
              <el-button class="el-icon-download" plain> 下载</el-button>
              <el-button class="el-icon-delete" plain @click="handleFileDeleteClick"> 删除</el-button>
           </div>
           <div class="too-ipt">
              <el-input 
                  suffix-icon="el-icon-search"
                  v-model="searchvalue" 
                  style="width:240px;" 
                  placeholder="搜索您的文件">
              </el-input>
              <span class="change-icon" v-if="fileTableShow" @click="fileTableShow=false"></span>
              <span class="change1-icon" v-if="!fileTableShow" @click="fileTableShow=true"></span>
           </div>
         </div>
         <div class="breadcrumb">
            <div class="bread-left">
               <el-row>
                 <el-col :span="1.5">
                    <span>当前位置：</span>
                 </el-col>
                 <el-col :span="20">
                    <el-breadcrumb separator="/">
                      <el-breadcrumb-item 
                      @click.native="forwardTo(index)"
                       v-for="(item, index) in breadLevelList"
                       :key="item.id"
                      >
                        <a href="javascript:;">{{ item.docName }}</a>
                      </el-breadcrumb-item>
                    </el-breadcrumb>
                 </el-col>
               </el-row>
            </div>
            <div class="bread-right">
              已全部加载完，共 {{ fileTotal }} 个
            </div>
         </div>
         <!-- files -->
         <div class="file-table" v-if="fileTableShow">
            <el-table
              ref="fileTable"
              :data="rackFileList"
              tooltip-effect="dark"
              style="width: 100%;margin-top:10px;"
              @selection-change="handleSelectionChange">
              <el-table-column
                align="center"
                type="selection"
                width="55">
              </el-table-column>
              <el-table-column
                label="文件名"
                prop="docName"
                align="center"
                show-overflow-tooltip
                width="">
                <template slot-scope="scope">
                  <FileIcon :type="scope.row.type"></FileIcon>
                  <a class="file-name"  @click="handleFolderClick(scope.row.id, scope.row.docName, scope.row)" v-if="scope.row.type === 'folder'">
                      {{scope.row.docName}}
                  </a>
                  <a class="file-name" v-else>
                      {{scope.row.docName}}
                  </a>
                </template>
              </el-table-column>
              <el-table-column
                prop="docCount"
                align="center"
                label="文件数量(历史文件数)"
                width="">
              </el-table-column>
              <el-table-column
                prop="version"
                align="center"
                label="版本号"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="docSize"
                align="center"
                label="大小"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="notes"
                align="center"
                label="备注"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="createTime"
                align="center"
                label="修改日期"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="createName"
                align="center"
                label="操作人"
                show-overflow-tooltip>
              </el-table-column>
            </el-table>
         </div>
         <div class="file-list" v-if="!fileTableShow">
           <div class="select-item">
             <el-checkbox size="small"></el-checkbox>
             <span class="select-text">已选中 2 文件 / 文件夹</span>
           </div>
           <div 
             class="file-list-item"
             v-for="item in rackFileList"
             :key="item.id"
            >
             <FileItem 
              v-model="item.checked"
              :title="item.name"
              :type="item.type"
              ></FileItem>
           </div>
            
         </div>
       </div>
     </div>
     <!-- 仓库管理dialog -->
     <el-dialog 
        title="仓库管理" 
        custom-class="my-dialog"
        :visible.sync="cangkuShowDia">
        <el-button  type="primary" size="small" @click="handleAddCKClick">新增</el-button>
        <el-button  type="primary" size="small" @click="handleEditCKClick">修改</el-button>
        <el-button  type="primary" size="small" @click="handleDeleteCangKu">删除</el-button>
        <el-table :data="cangkuTableList"  @selection-change="handleSelectionChange_cangku">
          <el-table-column type="selection" width="60" align="center"></el-table-column>
          <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
          <el-table-column property="name" label="名称" width="" align="center"></el-table-column>
          <el-table-column property="notes" label="说明" align="center"></el-table-column>
          <el-table-column property="status" label="状态" align="center">
            <template slot-scope="scope">
                <el-tag type="success" size="small" v-if="scope.row.status == '0'">正常</el-tag>
                <el-tag type="danger" size="small" v-if="scope.row.status == '1'">封闭</el-tag>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange_ck"
          @current-change="handleCurrentChange_ck"
          :current-page="pagenum_ck"
          :page-sizes="[10, 50, 100, 200]"
          :page-size="pagesize_ck"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total_ck">
      </el-pagination>
    </el-dialog>
    <!-- 仓库新增弹出框 -->
    <el-dialog 
        title="新增仓库" 
        @close="addCangkuClose('addCangKuForm')"
        :visible.sync="cangkuAddShowDia">
        <el-form ref="addCangKuForm" :model="addCangKuForm" label-width="80px" :rules="addCangKuRules">
          <el-row>
            <el-col :span="12">
                <el-form-item label="名称" prop="name">
                  <el-input v-model="addCangKuForm.name"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="状态" prop="status">
                <el-select v-model="addCangKuForm.status" placeholder="请选择状态" style="width:100%;">
                  <el-option label="正常" value="0"></el-option>
                  <el-option label="封闭" value="1"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="备注">
            <el-input type="textarea" v-model="addCangKuForm.notes"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cangkuAddShowDia = false">取 消</el-button>
          <el-button type="primary" @click="handleAddCangkuSubmit('addCangKuForm')">确 定</el-button>
        </div>
    </el-dialog>
    <!-- 仓库修改弹出框 -->
    <el-dialog 
        title="修改仓库" 
        @close="editCangkuClose('editCangKuForm')"
        :visible.sync="cangkuEditShowDia">
        <el-form ref="editCangKuForm" :model="editCangKuForm" label-width="80px" :rules="addCangKuRules">
          <el-row>
            <el-col :span="12">
                <el-form-item label="名称" prop="name">
                  <el-input v-model="editCangKuForm.name"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="状态" prop="status">
                <el-select v-model="editCangKuForm.status" placeholder="请选择状态" style="width:100%;">
                  <el-option label="正常" value="0"></el-option>
                  <el-option label="封闭" value="1"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="备注">
            <el-input type="textarea" v-model="editCangKuForm.notes"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cangkuEditShowDia = false">取 消</el-button>
          <el-button type="primary" @click="handleEditCangkuSubmit('editCangKuForm')">确 定</el-button>
        </div>
    </el-dialog>
    <!-- 文案架管理dialog -->
     <el-dialog 
        title="文案架管理" 
        custom-class="my-dialog"
        :visible.sync="wenanjiaShowDia">
      <el-button  type="primary" size="small">新增</el-button>
      <el-button  type="primary" size="small">修改</el-button>
      <el-button  type="primary" size="small">删除</el-button>
      <el-table :data="wenanjiaTableList">
        <el-table-column property="date" label="序号" width="60" align="center"></el-table-column>
        <el-table-column property="name" label="名称" width="" align="center"></el-table-column>
        <el-table-column property="address" label="说明" align="center"></el-table-column>
        <el-table-column property="address" label="状态" align="center"></el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange_waj"
        @current-change="handleCurrentChange_waj"
        :current-page="pagenum_waj"
        :page-sizes="[10, 50, 100, 200]"
        :page-size="pagesize_waj"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total_waj">
    </el-pagination>
    </el-dialog>
    <!-- 回收站dialog -->
     <el-dialog 
        title="回收站" 
        custom-class="my-dialog"
        :visible.sync="huishouzhanShowDia">
      <el-button  type="primary" size="small" @click="deleteFileForerver">彻底删除</el-button>
      <el-button  type="primary" size="small" @click="handleRestoreReCycle">还原</el-button>
      <span style="margin-left:100px;">回收站为你保存10天内删除的文件</span>
      <el-table :data="huishouzhanTableList" @selection-change="handleSelectionChange_hsz">
        <el-table-column  type="selection" width="60" align="center"></el-table-column>
        <el-table-column  type="index" label="序号" width="60" align="center"></el-table-column>
        <el-table-column property="docName" label="文档名称" width="" align="center"></el-table-column>
        <el-table-column property="ceateTime" label="删除时间" align="center"></el-table-column>
        <el-table-column property="ceateName" label="操作人" align="center"></el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange_hsz"
        @current-change="handleCurrentChange_hsz"
        :current-page="pagenum_hsz"
        :page-sizes="[10, 50, 100, 200]"
        :page-size="pagesize_hsz"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total_hsz">
    </el-pagination>
    </el-dialog>
    <!-- 新建文件夹dialog -->
     <el-dialog 
        title="新建文件夹" 
        custom-class="my-dialog"
        :visible.sync="wenjianjiaShowDia">
      <el-button  type="primary" size="small">保存</el-button>
      <el-form ref="form" :model="wenjianjiaForm" label-width="150px" style="margin-top:10px;">
        <el-form-item label="文件夹名称">
          <el-input v-model="wenjianjiaForm.name"></el-input>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-input v-model="wenjianjiaForm.time"></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import FileIcon from './common/FileIcon'
import FileItem from './common/FileItem'
export default {
  data(){
    return {
      //仓库新增校验
      addCangKuRules:{
        name: [
          { required: true, message: '仓库名称不能为空', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '状态不能为空', trigger: 'change' }
        ],
      }, 
      // 仓库数据
      navitemList:[
        {
          name:'根仓库',
          id:1
        },
        {
          name:'通知仓库',
          id:2
        },
        {
          name:'会议仓库',
          id:3
        },
        {
          name:'预案仓库',
          id:4
        }
      ],
      // 文案架数据
      rackNavList:[
        {
          docName:'文案架1',
          id:1
        },
        {
          docName:'文案架2',
          id:2
        },
        {
          docName:'文案架3',
          id:3
        },
        {
          docName:'文案架4',
          id:4
        }
      ],
      // table选中数据
      rackFileSelectedList:[],
      searchvalue:'',
      //显示table还是list
      fileTableShow:true,
      //文件数据
      rackFileList:[
        {
          type:'folder',
          docName:'文件夹一',
          id:'1-1',
          checked:true,
          children:[
            {
              type:'folder',
              docName:'文件夹1-1',
              id:'1-1-1',
            }
          ]
        },
        {
          type:'folder',
          docName:'文件夹2',
          id:'1-2',
          checked:false
        },
        {
          type:'default',
          docName:'文件3',
          id:'1-3'
        },
        {
          type:'pdf',
          docName:'新能源213213124124124.pdf',
          id:'1-4'
        }
      ],
      //仓库nav导航当前选中
      currentCkNavIndex:0,
      //仓库管理
      cangkuShowDia:false,
      //仓库table数据
      cangkuTableList:[],
      //仓库选中数据
      cangkuSelectList:[],
      //仓库管理分页
      pagenum_ck:1,
      pagesize_ck:10,
      total_ck:0,
      //仓库管理新增
      addCangKuForm:{status:'0'},
      cangkuAddShowDia:false,
      //仓库管理修改
      editCangKuForm:{},
      cangkuEditShowDia:false,
      //文案架管理
      wenanjiaShowDia:false,
      //文案架table数据
      wenanjiaTableList:[],
      //文案架管理分页
      pagenum_waj:1,
      pagesize_waj:10,
      total_waj:0,
      //回收站
      huishouzhanShowDia:false,
      ///回收站table数据
      huishouzhanTableList:[],
      //回收站选中数据
      huishouSelectedList:[],
      ///回收站管理分页
      pagenum_hsz:1,
      pagesize_hsz:10,
      total_hsz:0,
      //创建文件夹
      wenjianjiaShowDia:false,
      wenjianjiaForm:{},
      //面包屑level数据
      breadLevelList:[]
    }
  },
  components:{
    FileIcon,
    FileItem
  },
  mounted(){
    //获取仓库列表 - 导航数据
    // this.getWareHoseNavList()

  },
  computed:{
    // 当前点击的仓库id
    currentCkNavId(){
      if(this.navitemList.length > 0){
        return this.navitemList[this.currentCkNavIndex].id
      }else{
        return null
      }
    },
    // 文件总数
    fileTotal(){
      return this.rackFileList.length
    }
  },
  methods:{
    /*
      仓库点击: 文案架数据变， 文件数据变， 面包屑变
      文案架点击：文件数据变，面包屑变
    */
    //仓库导航
    handleCKNavItemClick(index){
      this.currentCkNavIndex = index
      // 根据仓库id获取文案架数据和文件数据
      this.getWenanJiaWithDocByCKId()
      // 面包屑直接置空
      this.breadLevelList = []
    },
    // 面包屑导航
    forwardTo(index){
      this.breadLevelList.splice(index + 1, this.breadLevelList.length - index - 1)
      // 获取file数据
      if(this.breadLevelList === 0) return
      let item = this.breadLevelList[this.breadLevelList.length - 1]
      // 判断是文案架 还是 文件夹
      let isFolder = true //假设是文件夹
      isFolder ? this.getFileListByFolderId(item.id) : this.getFileDataByRackId(item.id)
    },
    //文案架nav点击
    rackNavClick(item){
       this.breadLevelList = [item] //文案架点击设置面包屑
      //this.getFileDataByRackId(item.id) // 根据文案架id获取文件夹及文件
    },
    // 添加面包屑导航
    addToBread(item){
      this.breadLevelList.push(item)
    },
    // 根据文案架id获取文件夹及文件
    getFileDataByRackId(rackId){
      this.$http({
          url: this.$http.adornUrl('/docLibrary/copywritingRack/listRack'),
          method: 'post',
          data: rackId
      }).then((res) => {
        const {data: { code, result, msg } } = res
        if(code == 200){
            this.rackFileList = result
            return
        }
        this.$message.warning(msg)
      })
    },
    // 文件夹点击
    handleFolderClick(id, name, row){
      let obj = {docName:name, id: id}
      this.addToBread(obj) // 添加面包屑
      this.getFileListByFolderId(id, name, row) // 文件夹id获取文件夹及文件
    },
    // 根据文件夹id获取文件夹及文件
    getFileListByFolderId(id, name, row){
      this.rackFileList = row.children
      return
      // this.$http({
      //     url: this.$http.adornUrl('/docLibrary/copywritingRack/listRackFile'),
      //     method: 'post',
      //     data: id
      // }).then((res) => {
      //   const {data: { code, result, msg } } = res
      //   if(code == 200){
      //       this.rackFileList = result
      //       return
      //   }
      //   this.$message.warning(msg)
      // })
    },
    //根据仓库id获取文案架数据及以下数据
    getWenanJiaWithDocByCKId(){
      this.$http({
          url: this.$http.adornUrl('/docLibrary/copywritingRack/listDoc'),
          method: 'post',
          data: {
            warehouseId: this.currentCkNavId
          }
      }).then((res) => {
        const {data: { code,result, msg } } = res
        if(code == 200){
            this.rackNavList = result.rackList //文案架nav数据
            this.rackFileList = result.rackFileList // 文件列表数据
            return
        }
        this.$message.warning(msg)
      })
    },
    handleSelectionChange(val){
      this.rackFileSelectedList = val
    },
    //新建文件夹点击
    handleAddWenjianjaClick(){
      this.wenjianjiaShowDia = true
    },
    //仓库管理点击
    handleCKmangeClick(){
      // this.getWareHoseDiaList() // 获取仓库管理列表数据
      this.cangkuShowDia = true
    },
    //获取仓库管理列表
    getWareHouseDataList(pageObj){
       return new Promise((resolve, reject)=>{
          let { pagenum, pagesize } = pageObj
          this.$http({
                url: this.$http.adornUrl('/docLibrary/warehouse/listWarehouse'),
                method: 'get',
                params: {
                  pageNum: pagenum,
                  pageSize: pagesize
                }  
            }).then((res) => {
                const {data: { code, msg } } = res
                if(code == 200){
                    resolve(res)
                    return
                }
                reject(msg)
            })
       })
    },
    //1. navitemList仓库导航数据
    async getWareHoseNavList(){
      let res = await this.getWareHouseDataList({pagenum: 1, pagesize: 20})
      const {data: { code, result,msg } } = res
      if(code == 200){
          this.navitemList = result.list
          //根据仓库id获取文案架数据以及以下数据
          this.getWenanJiaWithDocByCKId()
          return
      }
      this.$message.warning(msg)
    },
    //2. 获取弹出框仓库列表
    async getWareHoseDiaList(){
      let res = await this.getWareHouseDataList({pagenum: this.pagenum_ck, pagesize: this.pagesize_ck})
      const {data: { code, result,msg } } = res
      if(code == 200){
          this.cangkuTableList = result.list
          this.total_ck = result.total
          return
      }
      this.$message.warning(msg)
    },
    // 仓库新增点击
    handleAddCKClick(){
      this.cangkuAddShowDia = true
    },
    // 新增仓库发送请求
    handleAddCangkuSubmit(formName){
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return this.$message.warning('校验失败')
        } 
        //发送新增仓库请求
        this.$http({
            url: this.$http.adornUrl('/docLibrary/warehouse/save'),
            method: 'post',
            data: this.addCangKuForm
         }).then((res) => {
            const {data: { code, msg } } = res
            if(code == 200){
                this.cangkuAddShowDia = false
                this.$message.success(msg)
                this.getWareHoseDiaList()
                return
            }
            this.$message.warning(msg)
         })
     })
    },
    //新增仓库关闭
    addCangkuClose(formName){
      this.addCangKuForm = { status: '0' }
      this.$refs[formName].resetFields()
    },
    handleSelectionChange_cangku(val){
      this.cangkuSelectList = val
    },
    //修改仓库点击
    handleEditCKClick(){
      if(this.cangkuSelectList.length === 0){
        return this.$message.warning('未选择数据')
      }
      if(this.cangkuSelectList.length > 1){
        return this.$message.warning('只能选择一条数据')
      }
      let rows = this.cangkuSelectList[0]
      this.editCangKuForm = rows
      this.cangkuEditShowDia = true
    },
    // 修改仓库发送请求
    handleEditCangkuSubmit(formName){
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return this.$message.warning('校验失败')
        } 
        //发送修改仓库请求
        this.$http({
            url: this.$http.adornUrl('/docLibrary/warehouse/update'),
            method: 'post',
            data: this.editCangKuForm
         }).then((res) => {
            const {data: { code, msg } } = res
            if(code == 200){
                this.cangkuEditShowDia = false
                this.$message.success(msg)
                this.getWareHoseDiaList()
                return
            }
            this.$message.warning(msg)
         })
     })
    },
    //修改仓库关闭
    editCangkuClose(formName){
      this.addCangKuForm = {}
      this.$refs[formName].resetFields()
      this.cangkuSelectList = []
    },
    //删除仓库
    handleDeleteCangKu(){
      // 校验
      if(this.cangkuSelectList.length == 0){
          this.$message.warning('请选择一条数据')
          return
      }
      this.$confirm(`选中[${this.cangkuSelectList.length}]条记录`, '确定删除?', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
      }).then(() => {
      // 处理参数
      const nolist = this.cangkuSelectList.map(item => item.id)
      this.$http({
          url: this.$http.adornUrl('/docLibrary/warehouse/delete'),
          method: 'post',
          data: nolist.join(',')
          }).then((res) => {
          const {data: { code, msg } } = res
          if(code == 200){
              this.$message.success(msg)
              this.pagenum_ck = 1
              this.getWareHoseDiaList()
              return
          }
          this.$message.warning(msg)
          })
      
      }).catch(() => {
          this.$message({
              type: 'info',
              message: '已取消'
          });          
          });
    },
    //仓库管理分页
    handleSizeChange_ck(val){
      this.pagesize_ck = val
    },
    handleCurrentChange_ck(val){
      this.pagenum_ck = val
    },
    //文案架点击
    handlewenanjiaClick(){
       this.wenanjiaShowDia = true
    },
    //文案架管理分页
    handleSizeChange_waj(val){
      this.pagesize_waj = val
    },
    handleCurrentChange_waj(val){
      this.pagenum_waj = val
    },
    //回收站点击
    handlehuishouzhanClick(){
      this.getCycleList()
      this.huishouzhanShowDia = true
    },
    //获取回收站列表
    getCycleList(){
      this.$http({
          url: this.$http.adornUrl('/docLibrary/copywritingRack/listCycle'),
          method: 'post',
          data: {
            pageNum: this.pagenum_hsz,
            pageSize: this.pagesize_hsz

          }
      }).then((res) => {
        const {data: { code,result, msg } } = res
        if(code == 200){
            this.huishouzhanTableList = result.list
            this.total_hsz = result.total
            return
        }
        this.$message.warning(msg)
      })
    },
    //回收站选中数据
    handleSelectionChange_hsz(val){
      this.huishouSelectedList = val
    },
    // 彻底删除
    deleteFileForerver(){
      // 校验
      if(this.huishouSelectedList.length == 0){
          this.$message.warning('请选择一条数据')
          return
      }
      this.$confirm(`选中[${this.huishouSelectedList.length}]条记录`, '确定彻底删除?', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
      }).then(() => {
      // 处理参数
      const nolist = this.huishouSelectedList.map(item => item.id)
      this.$http({
          url: this.$http.adornUrl('/docLibrary/copywritingRack/deleteCycle'),
          method: 'post',
          data: {
            reCycleBinId: nolist
          }
          }).then((res) => {
          const {data: { code, msg } } = res
          if(code == 200){
              this.$message.success(msg)
              this.pagenum_hsz = 1
              this.getCycleList()
              return
          }
          this.$message.warning(msg)
          })
      
      }).catch(() => {
          this.$message({
              type: 'info',
              message: '已取消'
          });          
       });
    },
    //还原
    handleRestoreReCycle(){
      // 校验
      if(this.huishouSelectedList.length == 0){
          this.$message.warning('请选择一条数据')
          return
      }
      this.$confirm(`选中[${this.huishouSelectedList.length}]条记录`, '确定还原?', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'success'
      }).then(() => {
      // 处理参数
      const nolist = this.huishouSelectedList.map(item => item.id)
      this.$http({
          url: this.$http.adornUrl('/docLibrary/copywritingRack/restoreReCycle'),
          method: 'post',
          data: {
            reCycleBinId: nolist
          }
          }).then((res) => {
          const {data: { code, msg } } = res
          if(code == 200){
              this.$message.success(msg)
              this.pagenum_hsz = 1
              this.getCycleList()
              return
          }
          this.$message.warning(msg)
          })
      
      }).catch(() => {
          this.$message({
              type: 'info',
              message: '已取消'
          });          
       });
    },
    //回收站分页
    handleSizeChange_hsz(val){
      this.pagesize_hsz = val
    },
    handleCurrentChange_hsz(val){
      this.pagenum_hsz = val
    },
    // 删除到回收站
    handleFileDeleteClick(){
      // 校验
      if(this.rackFileSelectedList.length == 0){
          this.$message.warning('请选择一条数据')
          return
      }
      if(this.rackFileSelectedList.length > 1){
          this.$message.warning('只能删除一条数据')
          return
      }
      this.$confirm(`选中[${this.rackFileSelectedList.length}]条记录`, '确定删除?', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
      }).then(() => {
      // 处理参数
      const rackItem = this.rackFileSelectedList[0]
      this.$http({
          url: this.$http.adornUrl('/docLibrary/copywritingRack/svaeCycle'),
          method: 'post',
          data: {
            copywritingRackId: rackItem.id,
            id: this.currentCkNavId, //仓库id
            isFile: rackItem.isFile
          }
          }).then((res) => {
          const {data: { code, msg } } = res
          if(code == 200){
              this.$message.success(msg)
              this.getWenanJiaWithDocByCKId()
              return
          }
          this.$message.warning(msg)
          })
      
      }).catch(() => {
          this.$message({
              type: 'info',
              message: '已取消'
          });          
       });
    }
  }
  
}
</script>

<style  lang="scss">
  html,body{
    margin: 0;
    padding: 0;
    background-color: #fff;
  }
  /* dialog */
  .my-dialog{
      min-height: 400px;
  }
  .my-dialog .el-dialog__header{
      padding: 8px;
      background-color: rgb(17, 187, 158);
      color:#fff;
      
    }
   .my-dialog .el-dialog__header .el-dialog__title{
        color: #fff;
        font-size: 16px;
        box-sizing: border-box;
        padding-left: 14px;
    }
   .my-dialog .el-dialog__header .el-dialog__headerbtn{
        top: 12px;
    }
    .my-dialog .el-dialog__header .el-dialog__headerbtn i{
        color:#fff;
    }
   .my-dialog .el-dialog__body {
        padding: 10px 20px;
    }
  .pan{
    height: 100vh;
    display: flex;
    flex-direction: column;
    .header{
      height: 80px;
      display: flex;
      .logo-lf{
        width: 300px;
        height: 100%;
        display: flex;
        .text{
          flex:1;
          height: 100%;
          text-align: center;
          font-size: 35px;
          line-height: 80px;
        }
        .logo{
          height: 100%;
          width: 75px;
          background: url(../assets/images/logo.png) no-repeat center;
          background-size: 100%;
        }
      }
      .nav-cont{
        height: 80px;
        flex:1;
        background-color: rgb(2,137,122);
        box-sizing: border-box;
        padding-left: 30px;
        display: flex;
        position: relative;
        .nav-item{
          box-sizing: border-box;
          height: 70px;
          margin-top: 5px;
          color:black;
          font-size: 25px;
          line-height: 70px;
          margin-right: 50px;
          cursor: pointer;
        }
        .nav-item.active{
          box-sizing: border-box;
          color: #fff;
          border-bottom: 2px solid #fff;
          cursor: pointer;
        }
        .item-icon{
          position: absolute;
          cursor: pointer;
          right: 20px;
          top:0px;
          height: 70px;
          line-height: 70px;
          margin-top: 5px;
          font-size: 15px;
          padding-left: 20px;
          background: url(../assets/images/manage.png) no-repeat left center;

        }
      }
    }
    /*content */
    .content{
      flex:1;
      background-color: #fff;
      display: flex;
      .left-bar{
        width: 300px;
        height: 100%;
        background-color: #fff;
        box-sizing: border-box;
        .wenj{
          height: calc(100% - 70px);
          background-color: rgb(247,247,247);
          padding: 8px 8px 0 8px;
          .item-head{
            font-size: 23px;
            .file-icon{
              display: inline-block;
              background: url(../assets/images/wenanjia.png) no-repeat center;
              width: 32px;
              height: 23px;
              margin-right: 15px;
            }
            .file-text{
              display: inline-block;
              height: 100%;
              line-height: 50px;
            }
          }
          .wen-li{
            background: #fff;
            margin-bottom: 10px;
            height: 50px;
            line-height: 50px;
            text-align: center;
            border-radius: 4px;
            cursor: pointer;
          }
          
        }
        .huishou{
          height: 50px;
          line-height: 50px;
          text-align: center;
          background: rgb(247,247,247);
          background-image: url(../assets/images/huishou.png);
          background-position: center;
          background-repeat: no-repeat;
          cursor: pointer;
        }
      }
      .right-cont{
        margin-top: 10px;
        box-sizing: border-box;
        padding-left: 10px;
        flex:1;
        .tool{
          display: flex;
          .too-btn{
            flex:1
          }
          .too-ipt{
            width: 330px;
            position: relative;
            .change-icon{
              display: inline-block;
              background: url(../assets/images/change.png) no-repeat center;
              width: 32px;
              height: 32px;
              position: absolute;
              right: 30px;
              top:0;
              cursor: pointer;
            }
            .change1-icon{
              display: inline-block;
              background: url(../assets/images/change1.png) no-repeat center;
              width: 32px;
              height: 32px;
              position: absolute;
              right: 30px;
              top:0;
              cursor: pointer;
            }
          }
          
        }
        .breadcrumb{
          display: flex;
          margin-top: 15px;
          border-bottom: 1px solid #E4E7ED;
          padding-bottom: 6px;
          .el-breadcrumb{
            margin-top: 5px;
          }
          .bread-left{
            flex:1
          }
          .bread-right{
            margin-right: 25px;
            font-size: 14px;
          }
        }
        .file-list{
          width: 100%;
          overflow: hidden;
          .select-item{
            margin-top: 10px;
            height: 35px;
            .select-text{
              font-size: 13px;
              margin-left: 10px;
            }
          }
          .file-list-item{
            float: left;
            margin-right: 15px;
            margin-top: 15px;
          }
        }
      }
    }
  }
</style>

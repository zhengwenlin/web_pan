<template>
  <div class="pan">
     <div class="header">
       <div class="logo-lf">
         <div class="logo"></div>
         <div class="text">文案库</div>
       </div>
       
       <div class="nav-cont">
         <div 
           :class="item.id === 1 ? 'active' : ''"
           v-for="item in navitemList"
           :key="item.id"
           class="nav-item" >{{ item.name }}</div>
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
                v-for="item in wenanList"
                :Key="item.id"
                class="wen-li" @click="addToBread(item, true)">{{ item.name }}</div>
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
              <el-button class="el-icon-delete" plain> 删除</el-button>
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
                        <a href="javascript:;">{{ item.name }}</a>
                      </el-breadcrumb-item>
                    </el-breadcrumb>
                 </el-col>
               </el-row>
            </div>
            <div class="bread-right">
              已全部加载完，共33个
            </div>
         </div>
         <!-- files -->
         <div class="file-table" v-if="fileTableShow">
            <el-table
              ref="fileTable"
              :data="fileTableList"
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
                prop="name"
                align="center"
                show-overflow-tooltip
                width="">
                <template slot-scope="scope">
                  <FileIcon :type="scope.row.type"></FileIcon>
                  <a class="file-name"  @click="getFileList(scope.row.id, scope.row.name, scope.row)" v-if="scope.row.type === 'folder'">
                      {{scope.row.name}}
                  </a>
                  <a class="file-name" v-else>
                      {{scope.row.name}}
                  </a>
                </template>
              </el-table-column>
              <el-table-column
                prop=""
                align="center"
                label="文件数量(历史文件数)"
                width="">
              </el-table-column>
              <el-table-column
                prop="address"
                align="center"
                label="版本号"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="address"
                align="center"
                label="大小"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="address"
                align="center"
                label="备注"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="address"
                align="center"
                label="修改日期"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="address"
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
             v-for="item in fileTableList"
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
      <el-button  type="primary" size="small">新增</el-button>
      <el-button  type="primary" size="small">修改</el-button>
      <el-button  type="primary" size="small">删除</el-button>
      <el-table :data="cangkuTableList">
        <el-table-column property="date" label="序号" width="60" align="center"></el-table-column>
        <el-table-column property="name" label="名称" width="" align="center"></el-table-column>
        <el-table-column property="address" label="说明" align="center"></el-table-column>
        <el-table-column property="address" label="状态" align="center"></el-table-column>
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
      <el-button  type="primary" size="small">彻底删除</el-button>
      <el-button  type="primary" size="small">还原</el-button>
      <span style="margin-left:100px;">回收站为你保存10天内删除的文件</span>
      <el-table :data="huishouzhanTableList">
        <el-table-column property="date" label="序号" width="60" align="center"></el-table-column>
        <el-table-column property="name" label="文档名称" width="" align="center"></el-table-column>
        <el-table-column property="address" label="删除时间" align="center"></el-table-column>
        <el-table-column property="address" label="操作人" align="center"></el-table-column>
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
      wenanList:[
        {
          name:'文案架1',
          id:1
        },
        {
          name:'文案架2',
          id:2
        },
        {
          name:'文案架3',
          id:3
        },
        {
          name:'文案架4',
          id:4
        }
      ],
      searchvalue:'',
      //显示table还是list
      fileTableShow:true,
      //文件数据
      fileTableList:[
        {
          type:'folder',
          name:'文件夹一',
          id:'1-1',
          checked:true,
          children:[
            {
              type:'folder',
              name:'文件夹1-1',
              id:'1-1-1',
            }
          ]
        },
        {
          type:'folder',
          name:'文件夹2',
          id:'1-2',
          checked:false
        },
        {
          type:'default',
          name:'文件3',
          id:'1-3'
        },
        {
          type:'pdf',
          name:'新能源213213124124124.pdf',
          id:'1-4'
        }
      ],
      //仓库管理
      cangkuShowDia:false,
      //仓库table数据
      cangkuTableList:[],
      //仓库管理分页
      pagenum_ck:1,
      pagesize_ck:10,
      total_ck:0,
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
  methods:{
    // 面包屑导航
    forwardTo(index){
      this.breadLevelList.splice(index + 1, this.breadLevelList.length - index - 1)
    },
    // 添加面包屑导航
    addToBread(item, flag){
      if(flag){
        if(this.breadLevelList.length===0){
          this.breadLevelList = [item]
        }else{
          if(item.id !== this.breadLevelList[0].id){
            this.breadLevelList = [item]
          }
        }
      }else{
        this.breadLevelList.push(item)
      }
    },
    handleSelectionChange(){

    },
    //新建文件夹点击
    handleAddWenjianjaClick(){
      this.wenjianjiaShowDia = true
    },
    //仓库管理点击
    handleCKmangeClick(){
      this.cangkuShowDia = true
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
      this.huishouzhanShowDia = true
    },
     //仓库管理分页
    handleSizeChange_hsz(val){
      this.pagesize_hsz = val
    },
    handleCurrentChange_hsz(val){
      this.pagenum_hsz = val
    },
    // 文件操作
    //1. 获取文件table数据
    getFileList(id, name, row){
      let obj = {name:name, id: id}
      this.addToBread(obj)
      this.fileTableList = row.children
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

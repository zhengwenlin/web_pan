<template>
    <div :style="{ width: width, height: height}" class="conbox">
        <el-checkbox v-model="selfChecked"></el-checkbox>
        <div class="top file-icon" :class="[type]"></div>
        <div class="bottom">{{ title }}</div>
        <div class="hov-box"></div>
    </div>
</template>

<script>
export default {
    props: {
        type: {
            validator: function(value){
                return ['default', 'folder', 'pdf', 'compress_file', "web",
                    'video', 'audio', 'picture', 'doc', 'txt', 'torrent', 'ppt',
                    'code'].indexOf(value) !== -1
            }
        },
        checked:{
            type:Boolean,
            default:false
        },
        width:{
            type:String,
            default:'120px'
        },
        height:{
            type:String,
            default:'120px'
        },
        title:{
            type:String,
            default:'暂无'
        }
    },
    computed:{
        selfChecked:{
            get(){
                return this.checked
            },
            set(value){
                alert(value)
                this.$emit('input', value);
            }
        }
    }
}
</script>


<style ref="stylesheet/scss" lang="scss" scoped>
.conbox{
    position: relative;
    display: flex;
    flex-direction: column;
    .top{
        flex:1;
    }
    .bottom{
        height: 30px;
        width: 100%;
        font-size: 14px;
        text-align: center;
        white-space: nowrap; 
        width: 100%; 
        overflow: hidden;
        text-overflow:ellipsis;
    }
    .hov-box{
        position: absolute;
        width: 100%;
        height: 100%;
        display: none;
    }
    &:hover .hov-box{
        display: block;
        background-color: rgba(233,233,233,0.5);
    }
   
}
.file-icon {
    display: inline-block;
    background-image: url(../../assets/file_icons.png);
    background-repeat: no-repeat;
    background-size: 1240px 3444px;
    width: 52px;
    height: 46px;
    margin: 0 auto;
}
.default{
    background-position: -1192px -1132px;
}
.folder{
    background-position: -1188px -1724px;
}
.pdf{
    background-position: -1192px -270px;
}
.compress_file{
    background-position: -1192px -2328px;
}
.video{
    background-position: -1192px -3260px;
}
.audio{
    background-position: -1192px -884px;
}
.picture{
    background-position: -1192px -612px;
}
.doc {
    background-position: -1192px -340px;
}
.txt {
    background-position: -1192px -204px;
}
.ppt {
    background-position: -1192px -408px;
}
.torrent {
    background-position: -1192px 0px;
}
.web{
    background-position: -1188px -2916px;
}
.code {
    background-position: -1192px -2848px;
}
</style>

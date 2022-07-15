<template>
    <div class="row justify-content-center align-items-center" v-if="!document">
                    <div class="col-7">
                        <el-input :placeholder="$t('document_title')" v-model="documentTitle" @change="onDataChanged"></el-input>
                    </div>
                    <div class="col-4">
                        <Upload
                            class="upload-demo"
                            :on-remove="handleRemove"
                            :multiple="false"
                            :on-change="onfileChanged"
                            >
                            <Button size="small" type="primary">{{$t('upload_document')}}</Button>
                            </Upload>
                    </div>
                    <div class="col-1">
                        <icon-button type="delete" @click="() => deleteNewDocument()"></icon-button>
                    </div>
                </div>
    <div v-else class="row">
        <div class="col-10">
                        <a :href="document.document.link" target="_blanc">{{document.display_text}}</a>
                    </div>
                    <div class="col-1" v-if="isDraft">
                        <icon-button type="delete" @click="() => deleteOldDocument()"></icon-button>
                    </div>
    </div>
</template>
<script>
import { Upload,Button } from "element-ui";
import IconButton from '@/components/common/Buttons/IconButton';
export default {
    props:{
        document:{
            type:Object,
            default:null
        },
        index:{
            type:Number,
            default:-1
        },
        isDraft:{
            type:Boolean,
            default:true
        }
    },
    components:{
        Upload,
        Button,
        IconButton
    },
    data(){
        return{
            documentTitle:null,
            file:null
        }
    },
    methods:{
        deleteNewDocument(){
            this.$emit('deleted',this.index);
        },
        onfileChanged(file){
            this.file = file;
            this.onDataChanged()
        },
        onDataChanged(){
            this.$emit('dataChanged',{
                key:this.index,
                title:this.documentTitle,
                file:this.file,
            })
        },
        handleRemove(){
            this.file = null;
            this.onDataChanged();
        }
    }
}
</script>
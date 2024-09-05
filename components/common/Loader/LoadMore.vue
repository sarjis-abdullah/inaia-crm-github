<template>
    <div class="w-100 d-flex justify-content-center align-items-center">
        <span class="loading__anim" v-if="isLoading && !showLinear"></span>
        <LinearLoader v-else-if="isLoading && showLinear" />
        <a v-else-if="currentPage<lastPage"  @click.prevent="clicked"><span class="loadmore">{{$t('load_more')}}</span></a>
    </div>
</template>
<script>
import LinearLoader from "@/components/common/Loader/LinearLoader";

export default {
    components: {
        LinearLoader,
    },
    props:{
        currentPage:{
            type:Number,
            default:1
        },
        lastPage:{
            type:Number,
            default:1
        },
        isLoading:{
            type:Boolean,
            default: false
        },
        showLinear:{
            type:Boolean,
            default: false
        }
    },
    methods:{
        clicked(){
            this.$emit('click');
        }
    }
}
</script>
<style scoped>
    @keyframes rotate { to {  transform: rotate(1turn) }}
    .loading__anim {
        border-radius:50%;
        display: inline-block;
        border: 2px solid rgba(189,189,189 ,0.25);
        border-left-color: rgba(3,155,229 ,1);
        border-top-color: rgba(3,155,229 ,1);
        animation: rotate 600ms infinite linear;
        width: 35px;
        height: 35px;
        }
    .loadmore {
        color: #5e72e4;
        cursor: pointer;
    }
</style>

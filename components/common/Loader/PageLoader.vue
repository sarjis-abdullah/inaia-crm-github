<template>
    <section class="loading d-flex flex-fill flex-column justify-content-center align-items-center">
        <span class="loading__text"> {{loaddingText}}</span>
        <loader :height="50" :width="50"/>
    </section>
</template>
<script>
import Loader from '@/components/common/Loader/Loader'
    export default {
        props:{
            loaddingText:{
                type:String,
                default:''
            }
        },
        components:{
            Loader
        }
    }
</script>
<style scoped>
.loading { background-color: #fff !important; min-height: 70vh; width:100%}
.loading__text 
    {  
        font-weight: normal;  
        font-size: 1.2em;  
        color: rgba(189,189,189 ,1);  
        margin: 0.6rem 0 2rem 0;  
        display: block;
    }
</style>
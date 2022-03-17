<template>
    <div class="mt-3 mb-3 error-text">{{textError}}</div>
</template>
<script>
export default {
    props:{
        textError:{
            type:String,
            default:''
        }
    }
}
</script>
<style scoped>
    .error-text {
        font-size: 0.8em;
        color: #f5365c;
        width: 100%;
        text-align: center;
        min-height: 20px;
    }
</style>

<template>
    <div class="error-text">{{textError}}</div>
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
        font-size: 1em;
        color: #f5365c;
        width: 100%;
        text-align: center;
        min-height: 20px;
    }
</style>

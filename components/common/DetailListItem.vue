<template>
    <div class="list-group-item px-0 py-2 d-flex">
        <div class="col-auto justify-content-center">
            {{title}}
        </div>
        <div class="col justify-content-center">
            <div class="floatRight"><slot name="value"></slot></div>
        </div>
    </div>
</template>
<script>

export default ({
    name:'detail-list-item',
    props:{
        title:{
            type: String,
            default: 'default'
        }
    },
    model:{
        props:['title','value'],
        event:'click'
    },
})
</script>
<style scoped>
 .container {
    display: flex;
    width: 100%;
    padding: 10px 5px;

 }
 .floatRight {
     float: right;
     text-align: right;
 }
</style>

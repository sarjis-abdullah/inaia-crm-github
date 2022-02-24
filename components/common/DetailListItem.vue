<template>
    <div class="list-group-item px-0 py-2 d-flex">
        <div class="col-auto px-0 justify-content-center font-weight-bold">
            {{title}}
        </div>
        <div class="col px-0 text-right justify-content-center">
            <slot name="value"></slot>
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
</style>

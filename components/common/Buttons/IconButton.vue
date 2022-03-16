<template>
    <a class="actionBtnStyle" href="#" @click.prevent="() => onClick()" >
        <i :class="returnIconName()" class="text-sm" :style="returnColor()"></i>
    </a>
</template>
<script>
export default {
    name:'icon-button',
    props:{
        type:{
            type: String,
            default: 'default'
        }
    },
    model:{
        prop:'type',
        event:'click'
    },
    methods:{
        returnColor:function() {
            if(this.type=='info'|| this.type=='default')
            {
                return 'color:#8898aa'
            }
            if(this.type=='delete')
            {
                return 'color:#f5365c'
            }
            if(this.type=='cancel')
            {
                return 'color:#f5365c'
            }
            if(this.type=='confirm')
            {
                return 'color:#2dce89'
            }
        },
        returnIconName:function()
        {
            if(this.type=='info'|| this.type=='default')
            {
                return 'fa fa-eye'
            }
            if(this.type=='delete')
            {
                return 'fa fa-trash'
            }
            if(this.type=='cancel')
            {
                return 'fa fa-window-close'
            }
            if(this.type=='confirm')
            {
                return 'fa fa-check'
            }
        },
        onClick:function(){
            this.$emit('click');
        }
    }
}
</script>
<style scoped>
.actionBtnStyle {
    padding:2px;
    margin-right:3px;
    margin-left:3px;
    font-size:17px;
    color:#f6f9fc;
}
</style>

<template>
    <div v-if="amlStatus=='verified'">
        <img src="/img/icons/common/incognitoVerified.png" class="icon"/><span class="text-xs text-muted ml-1">{{$t(amlStatus)}}</span>
    </div>
    <div v-else-if="amlStatus=='pending'">
        <img src="/img/icons/common/incognitoPending.png" class="icon"/><span class="text-xs text-muted ml-1">{{$t(amlStatus)}}</span>
    </div>
    <div v-else-if="amlStatus=='blocked'">
        <img src="/img/icons/common/incognitoBlocked.png" class="icon"/><span class="blotext-xs text-muted ml-1">{{$t(amlStatus)}}</span>
    </div>
    <div v-else-if="amlStatus=='new_update'">
        <img src="/img/icons/common/incognitoPending.png" class="icon"/><span class="text-xs text-muted ml-1">{{$t(amlStatus)}}</span>
    </div>
</template>
<script>
export default {
    props:{
        amlStatus:{
            type: String,
            default:''
        }
    }
}
</script>
<style scoped>

.icon {
    width: 17px;
    height: 17px;
}
</style>
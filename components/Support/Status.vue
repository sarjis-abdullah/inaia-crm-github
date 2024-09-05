<template>
    <Badge :type="type">{{ $t(updatedTranslationKey) }}
        <i v-if="translationKey == 'has_new_answer'" class="fa fa-check"></i>
        <i v-else-if="translationKey == 'open'" class="fa fa-check-double"></i>
    </Badge>
</template>
<script>
    import {Badge} from '@/components/argon-core';
    export default {
        components:{
            Badge
        },
        props:{
            status:{
                type: Object
            }
        },
        computed: {
            translationKey(){
                const { name_translation_key } = this.status
                return name_translation_key
            },
            type() {
                switch (this.translationKey) {
                    case 'new':
                        return 'success'
                    case 'open':
                        return 'info'
                    case 'has_new_answer':
                        return 'info'
                    case 'has_new_message':
                        return 'danger'
                    case 'closed':
                        return 'primary'
                
                    default:
                        return 'default';
                }
            },
            updatedTranslationKey(){
                if (this.translationKey == 'open' || this.translationKey == 'has_new_answer') {
                    return 'open'
                }
                return this.translationKey
            }
        },
    }
</script>
<template>
  <div>
    You are logging out!
  </div>
</template>



<script>
export default {
    mounted() {
        this.$store.dispatch('auth/logout')
            .then(res => {
            }).catch(err => {
                // console.error('logout exception', err)
            }).finally(() => {
                this.$nextTick(() => {
                    // window.location.href    = process.env.universalLogin + '/logout'
                    this.$router.push("/")
                })
            })
    }
}
</script>

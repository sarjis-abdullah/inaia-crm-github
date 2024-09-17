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
                console.log("Error logging out")
            }).finally(() => {
                this.$nextTick(() => {
                    window.location.href    = "/"
                    // this.$router.push("/")
                })
            })
    }
}
</script>

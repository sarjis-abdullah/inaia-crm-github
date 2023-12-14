<template>
    <div>
    <base-header class="pb-6">
      <div class="row align-items-center py-4">
        <div class="col-lg-2">
          <h6 class="h2 text-white d-inline-block mb-0">{{ $t("pending_verifications") }}</h6>
        </div>
      </div>
    </base-header>

    <div class="container-fluid mt--6">
      <List/>
    </div>
  </div>
</template>
<script>
import List from '@/components/Pending-verifications/List';
export default {
    layout: 'DashboardLayout',
    components:{
        List
    }
}
</script>
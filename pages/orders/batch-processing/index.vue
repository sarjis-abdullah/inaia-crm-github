<template>
  <div>
    <base-header class="pb-6">
        <div class="row align-items-center py-4">
            <div class="col-lg-6 col-7">
                <h6 class="h2 text-white d-inline-block mb-0">{{$t('batch_processing')}}</h6>
                <!--
                <nav aria-label="breadcrumb" class="d-none d-md-inline-block ml-md-4">
                    <route-breadcrumb/>
                </nav>
                -->
            </div>
            <div class="col-lg-6 col-5 text-right">
                <!-- <base-button size="sm" type="neutral">New</base-button> -->
            </div>
        </div>
    </base-header>

    <div class="container-fluid mt--6">
        <List/>
    </div>

  </div>
</template>
<script>
import List from "@/components/Batch-processing/List"

export default {
    layout: 'DashboardLayout',
    components: {
        List
    }
}
</script>
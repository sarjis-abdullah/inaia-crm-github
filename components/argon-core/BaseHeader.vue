<template>
  <div class="header" :class="{[`bg-${type}`]: type}">
    <div class="container-fluid">
      <div class="header-body">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<script>
import appNames from '../../appNames';

  export default {
    name: 'base-header',
    props: {
      type: {
        type: String,
        default: process.env.CURRENT_APP==appNames.getGreenGold?'gradient-primary':'gradient-info',
        description: 'Header background type'
      }
    }
  }
</script>
<style>
</style>

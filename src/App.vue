<script setup lang="ts">
import { Toaster } from "vue-sonner";
import "vue-sonner/style.css";
import AppLayout from './layouts/AppLayout.vue';
import { sonnerConfig } from "./plugins/sonner.ts";
</script>

<template>
  <AppLayout />
  <Toaster v-bind="sonnerConfig" />
</template>

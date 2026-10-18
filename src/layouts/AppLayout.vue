<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue';
import AppSidebar from '@/components/AppSidebar.vue';
import AppTabs from '@/components/AppTabs.vue';
import { RouterView } from 'vue-router';

</script>

<template>
  <div class="h-screen w-screen flex flex-col overflow-hidden bg-zinc-200">
    <AppHeader class="shrink-0" />

    <div class="flex-1 flex min-h-0 w-full">
      <AppSidebar />

      <div class="flex-1 flex flex-col min-h-0 min-w-0">
        <AppTabs class="shrink-0" />

        <main class="flex-1 px-1 min-h-0 pb-1">
          <RouterView />
        </main>
      </div>
    </div>
  </div>
</template>
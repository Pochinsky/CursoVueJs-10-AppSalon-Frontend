<script setup>
import { useServicesStore } from "@/stores/services";
import ServiceItem from "@/components/ServiceItem.vue";

const servicesStore = useServicesStore();
</script>

<template>
  <h2 class="text-4xl font-extrabold text-white">Servicios</h2>
  <p class="text-white text-lg">Elige máximo dos servicios</p>
  <div class="grid grid-cols-2 gap-5">
    <ServiceItem
      v-for="service in servicesStore.services"
      :key="service._id"
      :service="service"
    />
  </div>
</template>

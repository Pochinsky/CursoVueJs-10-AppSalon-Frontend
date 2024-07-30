<script setup>
import { useUserStore } from "@/stores/user";
import Appointment from "@/components/Appointment.vue";

const userStore = useUserStore();
</script>

<template>
  <h2 class="text-4xl font-extrabold text-white">Mis Citas</h2>
  <p class="text-white text-lg">Administra tus próximas citas</p>
  <p v-if="userStore.loading" class="text-white text-2xl text-center mt-5">
    Cargando...
  </p>
  <div v-else>
    <p
      v-if="userStore.noAppointments"
      class="text-white text-2xl text-center mt-5"
    >
      No tienes próximas citas
    </p>
    <div v-else class="grid grid-cols-1 gap-5 mt-10">
      <Appointment
        v-for="appointment in userStore.userAppointments"
        :key="appointment._id"
        :appointment="appointment"
      />
    </div>
  </div>
</template>

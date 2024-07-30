<script setup>
import { ref } from "vue";
import VueTailwindDatepicker from "vue-tailwind-datepicker";
import ServiceSelected from "@/components/ServiceSelected.vue";
import { useAppointmentsStore } from "@/stores/appointments";
import { formatCurrency } from "@/helpers";

const appointmentsStore = useAppointmentsStore();

const formatter = ref({ date: "DD/MM/YYYY", month: "MMMM" });

const disableDate = (date) => {
  const today = new Date();
  return (
    date < today ||
    date.getMonth() > today.getMonth() + 1 ||
    [0, 6].includes(date.getDay())
  );
};
</script>

<template>
  <h2 class="text-4xl font-extrabold text-white">Resumen de la cita</h2>
  <p class="text-white text-lg">Verifica la información y confirma tu cita</p>
  <h3 class="text-3xl font-extrabold text-white">Servicios</h3>
  <p v-if="appointmentsStore.noServicesSelected" class="text-white text-2xl">
    No tienes servicios seleccionados
  </p>
  <div v-else class="grid gap-5">
    <ServiceSelected
      v-for="service in appointmentsStore.services"
      :key="service._id"
      :service="service"
    />
    <p class="text-right text-white text-2xl">
      Total a pagar:
      <span class="font-black">
        {{ formatCurrency(appointmentsStore.totalAmount) }}
      </span>
    </p>
  </div>
  <div v-if="!appointmentsStore.noServicesSelected" class="space-y-8">
    <h3 class="text-3xl font-extrabold text-white">Fecha y Hora</h3>
    <div class="lg:flex gap-5 items-start">
      <div class="w-full lg:w-96 bg-white flex justify-center rounded-lg">
        <VueTailwindDatepicker
          i18n="es"
          as-single
          no-input
          :formatter="formatter"
          :disable-date="disableDate"
          v-model="appointmentsStore.date"
        />
      </div>
      <div
        v-if="appointmentsStore.isDateSelected"
        class="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-5 mt-10 lg:mt-0"
      >
        <button
          v-for="hour in appointmentsStore.hours"
          class="block rounded-lg text-xl font-black p-3 disabled:opacity-10"
          :class="
            appointmentsStore.time === hour
              ? 'bg-blue-500 text-white'
              : 'text-blue-500 bg-white'
          "
          @click="appointmentsStore.time = hour"
          :disabled="appointmentsStore.disableTime(hour) ? true : false"
        >
          {{ hour }}
        </button>
      </div>
    </div>
    <div v-if="appointmentsStore.isValidReservation" class="flex justify-end">
      <button
        class="w-full md:w-auto bg-blue-500 p-4 rounded-lg uppercase font-black text-white"
        @click="appointmentsStore.saveAppointment"
      >
        Confirmar Reservación
      </button>
    </div>
  </div>
</template>

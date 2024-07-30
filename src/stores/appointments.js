import { ref, computed, onMounted, inject, watch } from "vue";
import { defineStore } from "pinia";
import { useRouter } from "vue-router";
import AppointmentAPI from "../api/AppointmentAPI";
import { convertToISO, convertToDDMMYYYY } from "../helpers/date";
import { useUserStore } from "../stores/user";

export const useAppointmentsStore = defineStore("appointments", () => {
  const appointmentId = ref("");
  const services = ref([]);
  const date = ref("");
  const hours = ref([]);
  const time = ref("");
  const appointmentsByDate = ref([]);

  const toast = inject("toast");

  const router = useRouter();
  const userStore = useUserStore();

  onMounted(() => {
    const startHour = 10;
    const endHour = 19;
    for (let hour = startHour; hour <= endHour; hour++)
      hours.value.push(hour + ":00");
  });

  watch(date, async () => {
    time.value = "";
    if (date.value === "") return;
    const { data } = await AppointmentAPI.getByDate(date.value);
    if (appointmentId.value) {
      appointmentsByDate.value = data.filter(
        (appointment) => appointment._id !== appointmentId.value
      );
      time.value = data.filter(
        (appointment) => appointment._id === appointmentId.value
      )[0].time;
    } else appointmentsByDate.value = data;
  });

  function onServiceSelected(service) {
    if (
      services.value.some(
        (serviceSelected) => serviceSelected._id === service._id
      )
    )
      services.value = services.value.filter(
        (serviceSelected) => serviceSelected._id !== service._id
      );
    else {
      if (services.value.length === 2) {
        alert("Máximo dos servicios por cita");
        return;
      }
      services.value.push(service);
    }
  }

  async function saveAppointment() {
    const appointment = {
      services: services.value.map((service) => service._id),
      date: convertToISO(date.value),
      time: time.value,
      totalAmount: totalAmount.value,
    };
    // if appointment.value !== '' then editing appointment
    // else create appointment
    if (appointmentId.value) {
      try {
        const { data } = await AppointmentAPI.update(
          appointmentId.value,
          appointment
        );
        toast.open({
          message: data.message,
          type: "success",
        });
      } catch (error) {
        console.log(error);
        toast.open({
          message: "Ha ocurrido un error",
          type: "error",
        });
      }
    } else {
      try {
        const { data } = await AppointmentAPI.create(appointment);
        toast.open({
          message: data.message,
          type: "success",
        });
      } catch (error) {
        console.log(error);
        toast.open({
          message: "Ha ocurrido un error",
          type: "error",
        });
      }
    }
    clearAppointmentData();
    userStore.getUserAppointments();
    router.push({ name: "my-appointments" });
  }

  async function cancelAppointment(id) {
    if (confirm("¿Desea cancelar la cita? ")) {
      try {
        const { data } = await AppointmentAPI.delete(id);
        userStore.userAppointments = userStore.userAppointments.filter(
          (appointment) => appointment._id !== id
        );
        toast.open({
          message: data.message,
          type: "success",
        });
      } catch (error) {
        toast.open({
          message: error.response.data.message,
          type: "error",
        });
      }
    }
  }

  function clearAppointmentData() {
    appointmentId.value = "";
    services.value = [];
    date.value = "";
    time.value = "";
  }

  function setSelectedAppointment(appointment) {
    appointmentId.value = appointment._id;
    services.value = appointment.services;
    date.value = convertToDDMMYYYY(appointment.date);
    time.value = appointment.time;
  }

  const isServiceSelected = computed(() => {
    return (id) => services.value.some((service) => service._id === id);
  });

  const noServicesSelected = computed(() => services.value.length === 0);

  const totalAmount = computed(() =>
    services.value.reduce((total, service) => total + service.price, 0)
  );

  const isValidReservation = computed(
    () => services.value.length && date.value.length && time.value.length
  );

  const isDateSelected = computed(() => (date.value ? true : false));

  const disableTime = computed(() => {
    return (hour) =>
      appointmentsByDate.value.find((appointment) => appointment.time === hour);
  });

  return {
    appointmentId,
    services,
    date,
    hours,
    time,
    isServiceSelected,
    noServicesSelected,
    totalAmount,
    isValidReservation,
    isDateSelected,
    disableTime,
    onServiceSelected,
    saveAppointment,
    cancelAppointment,
    clearAppointmentData,
    setSelectedAppointment,
  };
});

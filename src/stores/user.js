import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { defineStore } from "pinia";
import AuthAPI from "../api/AuthAPI";
import AppointmentAPI from "../api/AppointmentAPI";

export const usUserStore = defineStore("user", () => {
  const user = ref({});
  const userAppointments = ref([]);
  const loading = ref(true);

  const router = useRouter();

  onMounted(async () => {
    try {
      const { data } = await AuthAPI.auth();
      user.value = data;
      await getUserAppointments();
    } catch (error) {
      console.log(error);
    } finally {
      loading.value = false;
    }
  });

  async function getUserAppointments() {
    const { data } = await AppointmentAPI.getUserAppointments(user.value._id);
    userAppointments.value = data;
  }

  function logout() {
    localStorage.removeItem("AUTH_TOKEN");
    user.value = {};
    router.push({ name: "login" });
  }

  const getUserName = computed(() =>
    user.value?.name ? user.value?.name : ""
  );

  const noAppointments = computed(() => userAppointments.value.length === 0);

  return {
    user,
    userAppointments,
    loading,
    getUserName,
    noAppointments,
    logout,
  };
});

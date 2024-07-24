<script setup>
import { onMounted, inject } from "vue";
import { useRoute, useRouter } from "vue-router";
import AuthAPI from "@/api/AuthAPI";

const toast = inject("toast");
const router = useRouter();
const route = useRoute();
const { token } = route.params;

onMounted(async () => {
  try {
    const { data } = await AuthAPI.verifyAccount(token);
    toast.open({
      message: data.message,
      type: "success",
    });
    setTimeout(() => {
      router.push({ name: "login" });
    }, 5000);
  } catch (error) {
    toast.open({
      message: error.response.data.message,
      type: "error",
    });
    setTimeout(() => {
      router.push({ name: "register" });
    }, 5000);
  }
});
</script>

<template>
  <h1 class="text-6xl font-extrabold text-white text-center mt-10">
    Verificación de Cuenta
  </h1>
  <p class="text-2xl text-white text-center my-5">Redireccionando...</p>
</template>

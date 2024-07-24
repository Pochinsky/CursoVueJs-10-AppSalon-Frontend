<script setup>
import { inject } from "vue";
import { useRouter } from "vue-router";
import AuthAPI from "@/api/AuthAPI";

const toast = inject("toast");
const router = useRouter();

const handleSubmit = async (formData) => {
  try {
    const {
      data: { token },
    } = await AuthAPI.login(formData);
    localStorage.setItem("AUTH_TOKEN", token);
    router.push({ name: "my-appointments" });
  } catch (error) {
    toast.open({
      message: error.response.data.message,
      type: "error",
    });
  }
};
</script>

<template>
  <h1 class="text-6xl font-extrabold text-white text-center mt-10">
    Inicio de Sesión
  </h1>
  <p class="text-2xl text-white text-center my-5">
    Ingresa los datos de tu cuenta
  </p>
  <FormKit
    id="loginForm"
    type="form"
    :actions="false"
    incomplete-message="No se pudo iniciar sesión, revisa las notificaciones"
    @submit="handleSubmit"
  >
    <FormKit
      type="email"
      label="Email"
      name="email"
      placeholder="Ej: pedro@correo.com"
      validation="required|email"
      :validation-messages="{
        required: 'El email es obligatorio',
        email: 'Email inválido',
      }"
    />
    <FormKit
      type="password"
      label="Contraseña"
      name="password"
      placeholder="********"
      validation="required"
      :validation-messages="{
        required: 'La contraseña es obligatoria',
      }"
    />
    <FormKit type="submit">Iniciar Sesión</FormKit>
  </FormKit>
</template>

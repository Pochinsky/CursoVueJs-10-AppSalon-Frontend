<script setup>
import { inject } from "vue";
import { reset } from "@formkit/core";
import AuthAPI from "@/api/AuthAPI";

const toast = inject("toast");

const handleSubmit = async ({ email }) => {
  try {
    const { data } = await AuthAPI.forgotPassword({ email });
    toast.open({ message: data.message, type: "success" });
    reset("forgotPasswordForm");
  } catch (error) {
    toast.open({ message: error.response.data.message, type: "error" });
  }
};
</script>

<template>
  <h1 class="text-6xl font-extrabold text-white text-center mt-10">
    Contraseña Olvidada
  </h1>
  <p class="text-2xl text-white text-center my-5">
    Ingresa el email de tu cuenta y recibirás las instrucciones para
    reestablecer tu contraseña
  </p>
  <FormKit
    id="forgotPasswordForm"
    type="form"
    :actions="false"
    incomplete-message="No se pudieron enviar las instrucciones, revisa las notificaciones"
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
    <FormKit type="submit">Enviar Instrucciones</FormKit>
  </FormKit>
</template>

<script setup>
import { inject } from "vue";
import { reset } from "@formkit/vue";
import AuthAPI from "@/api/AuthAPI";

const toast = inject("toast");

const handleSubmit = async ({ password_confirm, ...formData }) => {
  try {
    const { data } = await AuthAPI.register(formData);
    toast.open({
      message: data.message,
      type: "success",
    });
    reset("registerForm");
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
    Registro de Cuenta
  </h1>
  <p class="text-2xl text-white text-center my-5">Crea tu cuenta en AppSalón</p>
  <FormKit
    id="registerForm"
    type="form"
    :actions="false"
    incomplete-message="No se pude crear la cuenta, revisa las notificaciones"
    @submit="handleSubmit"
  >
    <FormKit
      type="text"
      label="Nombre"
      name="name"
      placeholder="Ej: Pedro"
      validation="required|length:3"
      :validation-messages="{
        required: 'El nombre es obligatorio',
        length: 'El nombre es muy corto',
      }"
    />
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
      placeholder="Mínimo de 8 caracteres"
      validation="required|length:8"
      :validation-messages="{
        required: 'La contraseña es obligatoria',
        length: 'La contraseña es muy corta',
      }"
    />
    <FormKit
      type="password"
      label="Repetir contraseña"
      name="password_confirm"
      placeholder="********"
      validation="required|confirm"
      :validation-messages="{
        required: 'La contraseña es obligatoria',
        confirm: 'Las contraseñas no son iguales',
      }"
    />
    <FormKit type="submit">Crear Cuenta</FormKit>
  </FormKit>
</template>

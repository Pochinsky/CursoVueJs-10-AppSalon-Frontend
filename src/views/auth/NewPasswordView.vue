<script setup>
import { onMounted, inject, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import AuthAPI from "@/api/AuthAPI";

const toast = inject("toast");

const validToken = ref(false);

const route = useRoute();
const router = useRouter();
const { token } = route.params;

onMounted(async () => {
  try {
    const { data } = await AuthAPI.verifyPasswordResetToken(token);
    validToken.value = true;
  } catch (error) {
    toast.open({ message: error.response.data.message, type: "error" });
  }
});

const handleSubmit = async ({ password }) => {
  try {
    const { data } = await AuthAPI.updatePassword(token, { password });
    toast.open({ message: data.message, type: "success" });
    setTimeout(() => {
      router.push({ name: "login" });
    }, 3000);
  } catch (error) {
    toast.open({ message: error.response.data.message, type: "error" });
  }
};
</script>

<template>
  <div v-if="validToken">
    <h1 class="text-6xl font-extrabold text-white text-center mt-10">
      Reestablecer Contraseña
    </h1>
    <p class="text-2xl text-white text-center my-5">
      Ingresa tu nueva contraseña
    </p>
    <FormKit
      id="newPasswordForm"
      type="form"
      :actions="false"
      incomplete-message="No se pudo reestablecer la contraseña, revisa las notificaciones"
      @submit="handleSubmit"
    >
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
      <FormKit type="submit">Establecer Contraseña</FormKit>
    </FormKit>
  </div>
  <p v-else class="text-center text-2xl font-black text-white">
    Token no válido
  </p>
</template>

<script setup>
import { useRoute } from "vue-router";

const authRoutes = [
  { name: "register", text: "Crear una cuenta" },
  { name: "login", text: "Iniciar sesión" },
  { name: "forgot-password", text: "Olvidé mi contraseña" },
];

const route = useRoute();
</script>

<template>
  <div class="mx-auto lg:w-3/5 mt-20">
    <RouterView />
    <nav
      class="mt-10 flex flex-col items-center space-y-5 lg:flex-row lg:justify-between lg:space-y-0"
    >
      <RouterLink
        v-for="authRoute in authRoutes"
        :to="{ name: authRoute.name }"
        class="uppercase font-bold text-white hover:text-slate-200"
        :class="route.name === authRoute.name ? 'hidden' : ''"
      >
        {{ authRoute.text }}
      </RouterLink>
    </nav>
  </div>
</template>

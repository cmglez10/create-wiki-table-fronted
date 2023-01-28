<template>
  <div class="home">
    <Card>
      <template #title> Introducir referencia </template>
      <template #content>
        <span class="p-float-label">
          <InputText id="url" type="text" v-model="url" />
          <label for="url">Url</label>
        </span>
        <Button label="Aceptar" @click="submit()" />
      </template>
    </Card>
    <Card v-if="response">
      <template #title>Resultado</template>
      <template #content>{{ response }}</template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import Card from "primevue/card";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import { Ref, ref } from "vue";
import axios from "axios";

const url: Ref<string> = ref();
let response: Ref<string> = ref();

async function submit() {
  response = await axios.get("http://localhost:3000/analyze/" + url.value);
}
</script>

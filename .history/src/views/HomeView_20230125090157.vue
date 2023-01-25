<template>
  <div class="home">
    <Card>
      <template #title> Introducir referencia </template>
      <template #content>
        <span class="p-float-label">
          <InputText id="url" type="text" v-model="url" />
          <label for="url">Url</label>
        </span>
        <Button label="Aceptar" />
      </template>
    </Card>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Card from "primevue/card";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import { Ref, ref } from "vue";

@Options({
  components: {
    Card,
    Button,
    InputText,
  },
})
export default class HomeView extends Vue {
  url: Ref<string> = ref();
}
</script>

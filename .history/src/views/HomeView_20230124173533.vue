<template>
  <div class="home">
    <Card>
      <template #title> Introducir referencia </template>
      <template #content>
        <div>
          <span class="p-float-label">
            <p-inputtext id="url" type="text" v-model="url"></p-inputtext>
            <label for="url">Url</label>
          </span>
        </div>
        <Button label="Aceptar" />
      </template>
    </Card>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Card from "primevue/card";
import Button from "primevue/button";
import { ref } from "vue";

@Options({
  components: {
    Card,
    Button,
  },
})
export default class HomeView extends Vue {
  url = ref();
}
</script>

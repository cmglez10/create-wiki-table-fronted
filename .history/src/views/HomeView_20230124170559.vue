<template>
  <div class="home">
    <Card>
      <template #title> Introducir referencia </template>
      <template #content>
        <span class="p-float-label">
          <p-inputtext id="url" type="text" v-model="url"></p-inputtext>
          <label for="url">Url</label>
        </span>
      </template>
    </Card>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src
import Card from "primevue/card";
import { ref } from "vue";

@Options({
  components: {
    HelloWorld,
    Card,
  },
})
export default class HomeView extends Vue {
  url = ref();

  url: any;
}
</script>

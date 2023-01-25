<template>
  <div class="home">
    <Card>
      <template #header>
        <img alt="user header" src="/demo/images/usercard.png" />
      </template>
      <template #title> Advanced Card </template>
      <template #content>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed
        consequuntur error repudiandae numquam deserunt quisquam repellat libero
        asperiores earum nam nobis, culpa ratione quam perferendis esse,
        cupiditate neque quas!
      </template>
      <template #footer>
        <Button icon="pi pi-check" label="Save" />
        <Button
          icon="pi pi-times"
          label="Cancel"
          class="p-button-secondary"
          style="margin-left: 0.5em"
        />
      </template>
    </Card>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src
import Card from "primevue/card";

@Options({
  components: {
    HelloWorld,
    Card,
  },
})
export default class HomeView extends Vue {}
</script>

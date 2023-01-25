<template>
  <div class="home"></div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src
import Card from "primevue/card";

@Options({
  components: {
    HelloWorld,
  },
})
export default class HomeView extends Vue {}
</script>

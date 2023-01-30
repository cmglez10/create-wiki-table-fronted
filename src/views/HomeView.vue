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
    <Card v-if="teams">
      <template #title>Clasificación</template>
      <template #content>
        <DataTable stripedRows :value="teams" responsiveLayout="scroll">
          <Column
            field="position"
            header="Pos"
            bodyClass="body-center"
            headerClass="header-center"
          >
          </Column>
          <Column>
            <template #body="row">
              <img :src="row.data.shield" />
            </template>
          </Column>
          <Column field="name" header="Equipo" headerStyle="width:20rem">
          </Column>
          <Column
            field="played"
            header="J"
            bodyClass="body-center"
            headerClass="header-center"
          >
          </Column>
          <Column
            field="won"
            header="G"
            bodyClass="body-center"
            headerClass="header-center"
          ></Column>
          <Column
            field="drawn"
            header="E"
            bodyClass="body-center"
            headerClass="header-center"
          ></Column>
          <Column
            field="lost"
            header="P"
            bodyClass="body-center"
            headerClass="header-center"
          ></Column>
          <Column
            field="gf"
            header="GF"
            bodyClass="body-center"
            headerClass="header-center"
          ></Column>
          <Column
            field="ga"
            header="GC"
            bodyClass="body-center"
            headerClass="header-center"
          ></Column>
          <Column
            field="gd"
            header="GD"
            bodyClass="body-center"
            headerClass="header-center"
          ></Column>
          <Column
            field="sanction"
            header="S"
            bodyClass="body-center"
            headerClass="header-center"
          ></Column>
          <Column
            field="points"
            header="Pts"
            bodyClass="body-center"
            headerClass="header-center"
          ></Column>
        </DataTable>
      </template>
    </Card>
    <Card v-if="teams">
      <template #title>Resultado</template>
      <template #content>
        <code>{{ teams }}</code>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import Card from "primevue/card";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import { Ref, ref } from "vue";
import axios from "axios";
import DataTable from "primevue/datatable";
import Column from "primevue/column";

export interface Team {
  position: number;
  name: string;
  points: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  gd: number;
  sanction: number;
}

const url: Ref<string> = ref("28516");
let teams: Ref<Team[]> = ref();

async function submit() {
  teams.value = (
    await axios.get<Team[]>("http://localhost:3000/analyze/" + url.value)
  )?.data;
}
</script>

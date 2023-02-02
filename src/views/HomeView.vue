<template>
  <div class="home-container">
    <Card>
      <template #title> Introducir referencia </template>
      <template #content>
        <div class="home-searchContainer">
          <span class="p-float-label home-searchFloatLabel">
            <InputText
              id="url"
              type="text"
              v-model="url"
              class="home-searchInput"
            />
            <label for="url">Url</label>
          </span>
          <Button label="Aceptar" @click="submit()" />
        </div>
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
        <Textarea class="home-codeTextarea" v-model="wikiCode" />
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import Card from "primevue/card";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import { computed, Ref, ref } from "vue";
import axios from "axios";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Textarea from "primevue/textarea";
import { split, filter, trimEnd } from "lodash-es";

export interface Team {
  position: number;
  name: string;
  completeName: string;
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
const BANNED_WORDS_FOR_INITIALS = ["Real", "Atlético", "Deportivo", "Beti"];

const url: Ref<string> = ref("28516");
let teams: Ref<Team[]> = ref();

async function submit() {
  teams.value = (
    await axios.get<Team[]>("http://localhost:3000/analyze/" + url.value)
  )?.data;
}

function getInitials(teamName: string): string {
  const mainPortions = filter(
    split(teamName, " "),
    (portion) => portion.length > 2
  );
  let initialsLeft = 3;
  let portionIndex = 0;
  let initials = "";
  while (initialsLeft > 0) {
    const portion = mainPortions[portionIndex];
    if (BANNED_WORDS_FOR_INITIALS.findIndex((el) => el === portion) === -1) {
      initials += portion.substring(0, initialsLeft);
      initialsLeft = 0;
    } else {
      initials += portion.substring(0, 1);
      initialsLeft--;
      portionIndex++;
    }
  }
  return removeAccents(initials.toUpperCase());
}

function removeAccents(str: string): string {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

const teamDefinition = computed(() => {
  let res = "";
  for (const team of teams.value) {
    res += `
|nombre_${getInitials(team.name)}=[[${team.completeName}|${team.name}]]`;
  }
  return res;
});

const teamTable = computed(() => {
  let res = "";
  for (const team of teams.value) {
    res += `
|ganados_${getInitials(team.name)}=${team.won}  |empates_${getInitials(
      team.name
    )}=${team.drawn}  |perdidos_${getInitials(team.name)}=${
      team.lost
    } |gf_${getInitials(team.name)}=${team.gf} |gc_${getInitials(team.name)}=${
      team.ga
    } <!-- ${team.name} -->`;
  }
  return res;
});

const teamOrder = computed(() => {
  let res = "|orden_equipo= ";
  for (const team of teams.value) {
    res += `${getInitials(team.name)}, `;
  }
  return trimEnd(res, ", ");
});

const wikiCode = computed(() => {
  const code = `
<!-- '''LEER ESTO ANTES DE ACTUALIZAR:''' Por favor, no olvides actualizar la fecha a través del parámetro ({{parámetro|actualizado}}). -->
{{#invoke:Football table|main|estilo=WDL
|actualizado=completo
|fuente=[https://www.futbol-regional.es/competicion.php?${url.value} Fútbol Regional]

<!--Definiciones de los equipos (wikilinks en tabla)-->
${teamDefinition.value}

<!--Actualizar los resultados de los equipos aquí, (no hace falta modificar las posiciones en está sección, el modelo lo hace automaticamente). No olvides actualizar la fecha a través del parámetro actualizado-->
${teamTable.value}

<!--Actualizar las posiciones de los equipos aquí-->
${teamOrder.value}
`;
  return code;
});
</script>

<style lang="scss" scoped>
.home {
  &-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  &-searchContainer {
    display: flex;
    gap: 1rem;
  }
  &-searchInput {
    width: 100%;
  }
  &-searchFloatLabel {
    width: 100%;
  }
  &-codeTextarea {
    width: 100%;
    height: 30rem;
  }
}
</style>

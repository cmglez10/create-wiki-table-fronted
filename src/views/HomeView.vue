<template>
  <div class="home-container">
    <Card>
      <template #title>
        Introducir referencia de liga o eliminatorias
      </template>
      <template #content>
        <div class="home-searchContainer">
          <span class="p-float-label home-searchFloatLabel">
            <InputText
              id="leagueId"
              type="text"
              v-model="leagueId"
              class="home-searchInput"
            />
            <label for="leagueId">Id de liga</label>
          </span>
          <div class="home-competitionType">
            <div class="home-competitionOption">
              <RadioButton
                v-model="competitionType"
                inputId="league"
                name="competitionType"
                value="league"
              />
              <label for="league" class="ml-2">Liga</label>
            </div>
            <div class="home-competitionOption">
              <RadioButton
                v-model="competitionType"
                inputId="playoff"
                name="competitionType"
                value="playoff"
              />
              <label for="playoff" class="ml-2">Playoffs</label>
            </div>
            <div class="home-getFlags">
              <Checkbox v-model="getFlags" :binary="true" />
              <label>Incluir banderas</label>
            </div>
          </div>
          <Button label="Aceptar" @click="submit()" />
        </div>
      </template>
    </Card>
    <Card v-if="loading">
      <template #content>
        <div class="home-spinner"><ProgressSpinner /></div>
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
      <template #title>Liga</template>
      <template #content>
        <Textarea class="home-codeTextarea" v-model="wikiCode" />
      </template>
    </Card>
    <Card v-if="playoffs">
      <template #title>Playoffs</template>
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
import RadioButton from "primevue/radiobutton";
import ProgressSpinner from "primevue/progressspinner";
import { computed, Ref, ref } from "vue";
import axios from "axios";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Textarea from "primevue/textarea";
import Checkbox from "primevue/checkbox";
import { trimEnd } from "lodash-es";
import { Utils } from "@/utils/utils";
import { PlayoffRound, PlayoffUtils } from "@/utils/playoff-utils";

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

enum CompetitionType {
  LEAGUE = "league",
  PLAYOFF = "playoff",
}

const leagueId: Ref<string> = ref();
const competitionType: Ref<CompetitionType> = ref(CompetitionType.LEAGUE);
const getFlags: Ref<boolean> = ref(true);
let teams: Ref<Team[]> = ref();
let playoffs: Ref<PlayoffRound[]> = ref();
let loading: Ref<boolean> = ref(false);

async function submit() {
  if (competitionType.value === CompetitionType.LEAGUE) {
    await getLeague();
  } else {
    await getPlayoff();
  }
}

async function getLeague(): Promise<void> {
  loading.value = true;
  playoffs.value = undefined;
  teams.value = undefined;
  teams.value = (
    await axios.get<Team[]>("http://localhost:3000/league/" + leagueId.value)
  )?.data;
  loading.value = false;
}

async function getPlayoff(): Promise<void> {
  loading.value = true;
  teams.value = undefined;
  playoffs.value = undefined;
  playoffs.value = (
    await axios.get<PlayoffRound[]>(
      "http://localhost:3000/playoff/" + leagueId.value
    )
  )?.data;
  loading.value = false;
}

const teamDefinition = computed(() => {
  let res = "";
  for (const team of teams.value) {
    res += `
|nombre_${Utils.getInitials(team.name)}=[[${team.completeName}|${team.name}]]`;
  }
  return res;
});

const teamTable = computed(() => {
  let res = "";
  for (const team of teams.value) {
    res += `
|ganados_${Utils.getInitials(team.name)}=${
      team.won
    }  |empates_${Utils.getInitials(team.name)}=${
      team.drawn
    }  |perdidos_${Utils.getInitials(team.name)}=${
      team.lost
    } |gf_${Utils.getInitials(team.name)}=${team.gf} |gc_${Utils.getInitials(
      team.name
    )}=${team.ga}`;
    if (team.sanction !== 0) {
      res += ` |ajustar_puntos_${Utils.getInitials(team.name)}=${
        team.sanction
      }`;
    }
    res += ` <!-- ${team.name} -->`;
  }
  return res;
});

const teamOrder = computed(() => {
  let res = "|orden_equipo= ";
  for (const team of teams.value) {
    res += `${Utils.getInitials(team.name)}, `;
  }
  return trimEnd(res, ", ");
});

const wikiCode = computed(() => {
  return competitionType.value === CompetitionType.LEAGUE
    ? wikiCodeLeague.value
    : wikiCodePlayoff.value;
});

const wikiCodePlayoff = computed(() => {
  const code = `
  ${PlayoffUtils.getCodePlayoffRounds(playoffs.value, {
    flags: getFlags.value,
  })}
`;
  return code;
});

const wikiCodeLeague = computed(() => {
  const code = `
<!-- '''LEER ESTO ANTES DE ACTUALIZAR:''' Por favor, no olvides actualizar la fecha a través del parámetro ({{parámetro|actualizado}}). -->
{{#invoke:Football table|main|estilo=WDL
|actualizado=completo
|fuente=[https://www.futbol-regional.es/competicion.php?${leagueId.value} Fútbol Regional]

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
    flex-direction: column;
    gap: 1rem;
  }
  &-competitionType {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    justify-content: space-around;
  }
  &-competitionOption,
  &-getFlags {
    display: flex;
    gap: 1rem;
    align-items: center;
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
  &-spinner {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>

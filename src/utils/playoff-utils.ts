import { split } from "lodash-es";
import { DateTime } from "luxon";

export interface PlayoffMatch {
  date: string;
  homeName: string;
  awayName: string;
  homeCompleteName: string;
  awayCompleteName: string;
  homeFlag: string;
  awayFlag: string;
  homeGoals: number;
  awayGoals: number;
  extraTime: boolean;
  homePenalties: number;
  awayPenalties: number;
}

export interface Playoff {
  matches: PlayoffMatch[];
}

export interface PlayoffRound {
  name: string;
  playoffs: Playoff[];
}

interface MatchResult {
  homeGoals: number;
  awayGoals: number;
}

export class PlayoffUtils {
  public static getCodePlayoffRounds(playoffs: PlayoffRound[]) {
    let res = "";
    for (const playoffRound of playoffs) {
      res += `
== ${playoffRound.name} ==
${PlayoffUtils.getCodePlayoffResume(playoffRound.playoffs)}

${PlayoffUtils.getCodePlayoffMatches(playoffRound.playoffs)}
`;
    }

    return res;
  }

  public static getCodePlayoffResume(playoffs: Playoff[]) {
    const maxNumberLegs = PlayoffUtils.getMaxNumberLegs(playoffs);
    if (maxNumberLegs <= 1) {
      return "";
    }

    let res = `=== Cuadro ===
    {{TwoLegStart|partidos=${maxNumberLegs}}}`;
    for (const playoff of playoffs) {
      const globalResult = PlayoffUtils.getGlobalResult(playoff.matches);
      res += `
      {{TwoLegResult
        | [[${playoff.matches[0].homeCompleteName}|${
        playoff.matches[0].homeName
      }]]
        | ${playoff.matches[0].homeFlag}
        | ${globalResult.homeGoals}-${globalResult.awayGoals}
        | [[${playoff.matches[0].awayCompleteName}|${
        playoff.matches[0].awayName
      }]]
        | ${playoff.matches[0].awayFlag}
        | ganador=${PlayoffUtils.getWinner(globalResult)}`;
      for (const match of playoff.matches) {
        const result = PlayoffUtils.getNormalizeResult(
          match,
          playoff.matches[0].homeName
        );
        res += `
        | ${result.homeGoals}-${result.awayGoals}`;
      }
      res += `
      }}`;
    }
    res += `
|}`;
    return res;
  }

  public static getCodePlayoffMatches(playoffs: Playoff[]) {
    let res = `=== Partidos ===
`;

    for (const playoff of playoffs) {
      for (let i = 0; i < playoff.matches.length; i++) {
        const match = playoff.matches[i];
        res += `
{{Partidos
| competición = ${PlayoffUtils.getLegName(i + 1)}
| local = [[${match.homeCompleteName}|${match.homeName}]]
| paíslocal = ${match.homeFlag}
| paísvisita = ${match.awayFlag}
| resultado = ${match.homeGoals}-${match.awayGoals}`;
        if (i === playoff.matches.length - 1) {
          const globalResult = PlayoffUtils.getGlobalResult(playoff.matches);
          if (match.homeName === playoff.matches[0].homeName) {
            res += `
| global = ${globalResult.homeGoals}-${globalResult.awayGoals}`;
          } else {
            res += `
| global = ${globalResult.awayGoals}-${globalResult.homeGoals}`;
          }
        }
        res += `
| visita = [[${match.awayCompleteName}|${match.awayName}]]
| fecha = ${PlayoffUtils.getNormalizeDate(match.date)} 
| estadio =
| ciudad =
| asistencia =
| refe =
| reporte =
}}
        `;
      }
    }

    return res;
  }

  private static getMaxNumberLegs(playoffs: Playoff[]): number {
    let max = 0;
    for (const playoff of playoffs) {
      if (playoff.matches.length > max) {
        max = playoff.matches.length;
      }
    }
    return max;
  }

  private static getGlobalResult(matches: PlayoffMatch[]): MatchResult {
    const homeName = matches[0].homeName;
    let homeGoals = 0;
    let awayGoals = 0;

    for (const match of matches) {
      const result = PlayoffUtils.getNormalizeResult(match, homeName);
      homeGoals += result.homeGoals;
      awayGoals += result.awayGoals;
    }

    return {
      homeGoals,
      awayGoals,
    };
  }

  private static getWinner(globalResult: MatchResult) {
    if (globalResult.homeGoals > globalResult.awayGoals) {
      return "1";
    } else if (globalResult.homeGoals < globalResult.awayGoals) {
      return "2";
    } else {
      return "";
    }
  }

  private static getNormalizeResult(
    match: PlayoffMatch,
    homeName: string
  ): MatchResult {
    if (match.homeName === homeName) {
      return {
        homeGoals: match.homeGoals,
        awayGoals: match.awayGoals,
      };
    } else {
      return {
        homeGoals: match.awayGoals,
        awayGoals: match.homeGoals,
      };
    }
  }

  private static getLegName(leg: number) {
    switch (leg) {
      case 1:
        return "Ida";
      case 2:
        return "Vuelta";
      case 3:
        return "Desempate";
      default:
        return "";
    }
  }

  private static getNormalizeDate(date: string) {
    try {
      const shortDate = split(date, ", ")[1];
      const d = DateTime.fromFormat(shortDate, "dd-MM-yyyy").setLocale("es-ES");
      return d.toFormat("[[dd 'de' MMMM]] 'de' [[yyyy]]");
    } catch (e) {
      return date;
    }
  }
}

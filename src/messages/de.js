
export default {
  hello: 'welt',
  survey_name: "Umfrage zu Computergenerierter Musik",
  init: {
    survey_concluded: `
      Die Umfrage ist zu Ende. Danke an alle, die teilgenommen haben.
      Du kannst die Umfrage immer noch ausfüllen, aber deine Antworten werden bei der Endauswertung nicht mehr berücksichtigt.
    `,
    lead_1: `
      Danke, dass du dir Zeit nimmst, um an unserer Umfrage zu computergenerierter Musik teilzunehmen.
      Das Ziel der Umfrage ist es, verschiedene Algorithmen (Künstliche Intelligenz) zum Erzeugen von Musik zu vergleichen.
    `,
    lead_2: `
      Die Umfrage beinhaltet 15 Fragen und dauert ca. 10 Minuten.
      Jede Frage enthält zwei Auszüge (20 Sekunden) von Musikstücken, die von einem Computer erzeugt wurden.
      Dementsprechend ist das Klangbild nicht wie gewohnt, sondern eben synthetisch klingend.
    `,
    lead_3: `
      Die Auszüge sollst du dir zuerst anhören und dann bewerten, indem du deinen Favoriten aus den beiden präsentierten Stücken auswählst.
      Dabei musst du keine Begründung schreiben, sondern nur einen Knopf drücken.
    `,
    preference_title: 'Was heisst "besser"?',
    preference_explanation: `
      Stell dir vor, du seist Teil der Jury in einem Musikwettbewerb und musst entscheiden, welche Komposition (erzeugt von verschiedenen Algorithmen) den Wettbewerb gewinnt.
    `,
    instructions_title: "Anleitung",
    instructions_explanation: `
      Bei jeder Frage werden dir zwei Stücke präsentiert: "Stück&nbsp;A" und "Stück&nbsp;B".
      Wenn du das erste Stück bevorzugst, klicke auf "A gefällt mir besser".
      Wenn du das zweite Stück bevorzugst, klicke auf "B gefällt mir besser".
    `,
    headphones: "Für ein optimales Resultat bitten wir dich, die Umfrage in einer ruhigen Umgebung und mit Kopfhörer auszufüllen.",
    back: "Sprache",
    start_survey: "Umfrage Starten"
  },
  survey: {
    title: "Wähle deinen Favoriten",
    subtitle: "Frage {count}/{max}",
    instructions: "Hör dir die Auszüge aus diesen beiden Stücken an:",
    loading: "Loading...",
    sample: "Stück {key}",
    question: "Welches Stück gefällt dir besser?",
    answer: "{key} gefällt mir besser",
    back: "Anleitung anzeigen"
  },
  done: {
    title: "Umfrage zu Computergenerierter Musik",
    thank_you: `
      Vielen Dank für deine Teilnahme!
      Falls du Fragen oder Anstösse hast, kannst du uns {mail} kontaktieren.
      Mehr computergenerierte Musik kannst du auf {soundcloud} anhören.
    `,
    here: "hier",
    share_text: `
      Um möglichst aussagekräftige Resultate zu erhalten, brauchen wir so viele Antworten wie möglich.
      Falls du diese Umfrage interessant gefunden hast, teile sie doch mit Freunden und Familie!
    `,
    share_cta: "Teilen",
    copied: "Link in die Zwischenablage kopiert",
    participate_again: "Wenn du möchtest, kannst du noch einmal teilnehmen.",
    again: "Weitere Antwort hinzufügen"
  }
}
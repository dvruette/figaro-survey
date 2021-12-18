
export default {
  hello: 'welt',
  survey_name: "Umfrage zu Computergenerierter Musik",
  init: {
    lead: `
      Danke, dass du dir Zeit nimmst, um an unserer Umfrage zu computergenerierter Musik teilzunehmen.
      Die Umfrage beinhaltet 15 Fragen und dauert ca. 10 Minuten.
      Jede Frage enthält zwei Auszüge von Musikstücken, die von einem Computer erzeugt wurden.
      Diese sollst du dir zuerst anhören und dann bewerten, indem du deinen Favoriten aus den beiden präsentierten Stücken auswählst.
    `,
    preference_title: 'Was heisst "besser"?',
    preference_explanation: `
      Bei der Wahl deiner Präferenz bitten wir dich, die Option zu bevorzugen, die angenehm und interessant zum Zuhören ist und/oder natürlich klingt.
      Stell dir vor, du seist Teil der Jury in einem Musikwettbewerb und musst entscheiden, welche Komposition den Wettbewerb gewinnt.
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
    instructions: "Bitte hör dir die Auszüge aus diesen beiden Stücken an:",
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
    copied: "Link in die Zwischenablage kopiert"
  }
}

export default {
  hello: "world",
  survey_name: "Survey on Computer-Generated Music",
  init: {
    lead: `
      Thank you for participating in our survey about computer-generated music. The survey consists of 15 questions total and takes about 10 minutes to complete. 
      Each of the questions will require you to listen to two computer-generated samples of music and
      indicate which of the two you prefer.
    `,
    preference_title: "Choosing your Preference",
    preference_explanation: `
      When choosing your preference, prefer the option that is pleasing and interesting to listen to and/or sounds the most natural.
      Think of yourself as a jury in a composition contest where you have to decide which of the two samples is going to win.
    `,
    instructions_title: "Instructions",
    instructions_explanation: `
      You are going to be presented with two samples: "Sample&nbsp;A" and "Sample&nbsp;B".
      If you prefer the first sample, click "I prefer A".
      If you prefer the second sample, click "I prefer B".
    `,
    headphones: "For best results, please do this survey in a quiet environment and using headphones.",
    back: "Language",
    start_survey: "Start the Survey"
  },
  survey: {
    title: "Tell us your preference",
    subtitle: "Question {count}/{max}",
    instructions: "Please listen to these two samples:",
    loading: "Loading...",
    sample: "Sample {key}",
    question: "Which sample do you prefer?",
    answer: "I prefer {key}",
    back: "Show instructions"
  },
  done: {
    title: "Survey on Computer-Generated Music",
    thank_you: `
      Thank you for participating!
      If you have any questions or feedback, feel free to contact us {mail}.
      You can listen to even more computer-generated music on {soundcloud}.
    `,
    here: "here",
    share_text: `
      To get representative results, we need as many participants as possible.
      If you found this survey interesting, please consider sharing it with your friends and family.
    `,
    share_cta: "Share",
    copied: "Copied link to clipboard"
  }
}

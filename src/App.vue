<script setup>
import { ref, reactive, computed, getCurrentInstance, onMounted } from 'vue'
import { getSamplesList, downloadAnswers } from './api'
import QuestionRandomizer from './components/QuestionRandomizer.vue'

const samples = reactive({
  original: [],
  baseline: [],
  autoencoder: [],
  museMorphose: [],
  desc2seqBoth: [],
  desc2seqBasic: [],
  desc2seqLatent: []
})

const numQuestions = 15

const internalInstance = getCurrentInstance()
const setLanguage = lang => {
  internalInstance.ctx.$i18n.locale = lang
  localStorage['lang'] = lang
  view.value = 'init'
}

const view = ref('init')

const sampleCategories = computed(() => {
  return [
    { name: 'original', samples: samples.original },
    { name: 'baseline', samples: samples.baseline },
    { name: 'autoencoder', samples: samples.autoencoder },
    { name: 'muse-morphose', samples: samples.museMorphose },
    { name: 'desc2seq-both', samples: samples.desc2seqBoth },
  ]
})

const setView = (v) => view.value = v

onMounted(() => {
  if (localStorage['lang']) {
    setLanguage(localStorage['lang'])
  }
  if (localStorage['currQuestion']) {
    setView('survey')
  }
})

getSamplesList('original').then(list => {
  samples.original = list
})

getSamplesList('baseline').then(list => {
  samples.baseline = list
})

getSamplesList('autoencoder').then(list => {
  samples.autoencoder = list
})

getSamplesList('muse-morphose').then(list => {
  samples.museMorphose = list
})

getSamplesList('desc2seq-both').then(list => {
  samples.desc2seqBoth = list
})

const NODE_ENV = import.meta.env.MODE

const download = async () => {
  const keys = [
    'a', 'b', 'choice', 'winner', 'loser', 'winnerSample', 'loserSample',
    'playbackTimeA', 'playbackTimeB', 'startedA', 'startedB', 'submitted',
    'uid', 'environment', 'created'
  ]
  const answers = await downloadAnswers()
  
  if (answers.length) {
    answers.forEach(obj => {
      obj.created = obj.created.toMillis()
    })
    
    const header = keys.join(',') + '\n'
    const rows = answers.map(obj => keys.map(key => obj[key]).join(',')).join('\n')
    const csv = header + rows
    const dataUrl = encodeURI("data:text/csv;charset=utf-8," + csv)
    const anchor = document.createElement('a')
    anchor.setAttribute('href', dataUrl)
    anchor.setAttribute('download', 'answers.csv')
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
  }
}

const clipboardMsg = ref(false)

const share = () => {
  if (typeof navigator.share == 'function') {
    navigator.share({
      title: "Music AI",
      url: window.location.origin,
    })
  } else {
    navigator.clipboard.writeText(window.location.origin)
    clipboardMsg.value = true
    setTimeout(() => clipboardMsg.value = false, 4000)
  }
}

</script>

<template>
  <div v-if="NODE_ENV == 'development'" class="fixed top-2 right-2">
    <button @click="download" class="bg-black text-white px-4 py-2 shadow-lg rounded font-bold">Download</button>
  </div>

  <div class="max-w-full w-full sm:max-w-2xl p-4 bg-white shadow rounded-lg">
    <div v-if="view == 'lang'">
      <h1 class="text-xl sm:text-2xl font-bold text-center mb-2">{{ $t('survey_name') }}</h1>
      
      <div class="flex flex-col sm:flex-row gap-8 p-6 justify-evenly">
        <button @click="setLanguage('en')" class="w-full sm:w-64 p-4 border border-gray-200 hover:border-black hover:bg-black hover:text-white transition font-bold rounded">English</button>
        <button @click="setLanguage('de')" class="w-full sm:w-64 p-4 border border-gray-200 hover:border-black hover:bg-black hover:text-white transition font-bold rounded">Deutsch</button>
      </div>
    </div>

    <div v-if="view == 'init'">
      <h1 class="text-xl sm:text-2xl font-bold mb-4">{{ $t('survey_name') }}</h1>
      <p class="mb-2">
        {{ $t('init.lead_1') }}
      </p>
      <p class="mb-2">
        {{ $t('init.lead_2') }}
      </p>
      <p class="mb-4">
        {{ $t('init.lead_3') }}
      </p>

      <h4 class="font-bold text-md mb-1">{{ $t('init.preference_title') }}</h4>
      <p class="mb-4">
        {{ $t('init.preference_explanation') }}
      </p>

      <h4 class="font-bold text-md mb-1">{{ $t('init.instructions_title') }}</h4>
      <p class="mb-6" v-html="$t('init.instructions_explanation')"></p>

      <div class="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 mb-6">
        <p class="font-medium text-sm">{{ $t('init.headphones') }}</p>
      </div>

      <hr class="border-gray-200 mb-4 -mx-4" />

      <div class="flex justify-between items-center gap-4">
        <button @click="setView('lang')" class="rounded px-4 py-3 hover:bg-gray-100 font-medium transition">
          {{ $t('init.back') }}
        </button>
        <button @click="setView('survey')" class="rounded p-4 w-full sm:w-64 bg-gray-800 hover:bg-black transition font-bold text-white">
          {{ $t('init.start_survey') }}
        </button>
      </div>
    </div>
    
    <div v-if="view == 'survey'">
      <h1 class="text-xl sm:text-2xl font-bold text-center mb-2">{{ $t('survey.title') }}</h1>
      <QuestionRandomizer :num-questions="numQuestions" :sample-categories="sampleCategories" @finished="setView('done')" />

      <hr class="border-gray-200 mb-4 -mx-4 mt-4" />

      <div class="flex justify-start items-center">
        <button @click="setView('init')" class="rounded px-3 py-2 hover:bg-gray-100 font-medium transition flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="24" viewBox="8 0 8 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-left"><polyline points="15 18 9 12 15 6"></polyline></svg>
          &ensp;{{ $t('survey.back') }}
        </button>
      </div>
    </div>

    <div v-if="view == 'done'" class="flex flex-col items-center text-center space-y-6 p-2">
      <h1 class="text-xl sm:text-2xl font-bold text-center">{{ $t('done.title') }}</h1>

      <i18n-t keypath="done.thank_you" tag="p">
        <template #mail>
          <a class="underline font-medium" href="mailto:dvruette@ethz.ch">{{ $t('done.here') }}</a>
        </template>
        <template #soundcloud>
          <a class="underline font-medium" target="_blank" href="https://soundcloud.com/user-751999449/sets/controllable-symbolic-music-generation-with-description-to-sequence-modelling-1">
            Soundcloud</a>
        </template>
      </i18n-t>

      <div class="w-full px-8">
        <hr class="w-full border-gray-200" />
      </div>

      <p>{{ $t('done.share_text') }}</p>

      <button @click="share" class="px-4 py-3 w-48 rounded bg-slate-100 font-bold hover:bg-slate-300 flex items-center justify-center transition">
        {{ $t('done.share_cta') }}&ensp;<img src="./assets/share.svg">
      </button>

      <div v-if="clipboardMsg" class="fixed bottom-4 inset-x-0 flex justify-center">
        <div @click="clipboardMsg = false" class="cursor-pointer rounded bg-blue-500 font-medium text-sm text-white px-4 py-1.5">
          {{ $t('done.copied') }}
        </div>
      </div>
    </div>
  </div>
</template>

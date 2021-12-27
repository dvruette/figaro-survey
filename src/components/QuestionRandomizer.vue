<script setup>
import { ref, watch } from 'vue'
import PreferenceQuestion from './PreferenceQuestion.vue'
import { uploadAnswer } from '../api'

const props = defineProps({
  sampleCategories: Array,
  numQuestions: { type: Number, default: 15 }
})

const emit = defineEmits(['finished'])

const currQuestion = ref(localStorage['currQuestion'] ? Number(localStorage['currQuestion']) : 0)

if (currQuestion.value >= props.numQuestions) emit('finished')

const randomIndex = () => Math.floor(Math.random() * props.sampleCategories.length)
const randomIndexButNot = (idx) => {
  const incr = Math.floor(Math.random()*(props.sampleCategories.length - 1) + 1)
  return (idx + incr) % props.sampleCategories.length
}
const hasSample = (idx) => idx < props.sampleCategories.length

const indexA = ref(randomIndex())
const indexB = ref(randomIndexButNot(indexA.value))

const getSamplesA = () => hasSample(indexA.value) ? props.sampleCategories[indexA.value].samples : null
const getSamplesB = () => hasSample(indexB.value) ? props.sampleCategories[indexB.value].samples : null

const samplesA = ref(getSamplesA())
const samplesB = ref(getSamplesB())


const resample = () => {
  indexA.value = randomIndex()
  indexB.value = randomIndexButNot(indexA.value)
}

watch(indexA, () => samplesA.value = getSamplesA())
watch(indexB, () => samplesB.value = getSamplesB())
watch(() => props.sampleCategories, resample)

const handleAnswer = (answer) => {
  const { choice, sampleA, sampleB } = answer
  const keyA = props.sampleCategories[indexA.value].name
  const keyB = props.sampleCategories[indexB.value].name
  const [winner, loser] = choice == 'A' ? [keyA, keyB] : [keyB, keyA]
  const [winnerSample, loserSample] = choice == 'A' ? [sampleA, sampleB] : [sampleB, sampleA]
  
  // upload answer to firebase
  uploadAnswer({ a: keyA, b: keyB, choice, winner, loser, winnerSample, loserSample })

  resample()
  currQuestion.value += 1
  localStorage['currQuestion'] = currQuestion.value

  if (currQuestion.value >= props.numQuestions) emit('finished')
}

const NODE_ENV = import.meta.env.MODE

</script>

<template>
  <div v-if="currQuestion < numQuestions">
    <p class="text-center text-sm font-medium text-gray-700 mb-2">Question {{currQuestion + 1}}/{{numQuestions}}</p>
    <hr class="border-gray-200 mt-4 mb-6" />
    <PreferenceQuestion :key="currQuestion" :samples-a="samplesA" :samples-b="samplesB" @answer="handleAnswer" />

    <div v-if="NODE_ENV == 'development'" class="fixed bottom-0 right-0">
      sample A: {{sampleCategories[indexA].name}}, sample B: {{sampleCategories[indexB].name}}
    </div>
  </div>
  <div v-else>
    <p class="text-center">{{ $t('done.thank_you') }}</p>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import Sampler from './Sampler.vue'

const props = defineProps({
  samplesA: Array,
  samplesB: Array,
})

const emit = defineEmits(['answer'])

const playedA = ref(false)
const playedB = ref(false)
const playbackTimeA = ref(0)
const playbackTimeB = ref(0)
const startedA = ref(null)
const startedB = ref(null)
const currentA = ref('')
const currentB = ref('')

const samplerA = ref(null)
const samplerB = ref(null)

const handlePlayA = (sample) => {
  if (!playedA.value) {
    const el = samplerA.value.querySelector('audio')
    el.addEventListener('timeupdate', event => {
      playbackTimeA.value = Math.max(event.target.currentTime, playbackTimeA.value)
    })
  }
  playedA.value = true
  startedA.value = Date.now()
  currentA.value = sample
}

const handlePlayB = (sample) => {
  if (!playedB.value) {
    const el = samplerB.value.querySelector('audio')
    el.addEventListener('timeupdate', event => {
      playbackTimeB.value = Math.max(event.target.currentTime, playbackTimeB.value)
    })
  }
  playedB.value = true
  startedB.value = Date.now()
  currentB.value = sample
}

const prefer = (choice) => emit('answer', {
  choice: choice,
  sampleA: currentA.value,
  sampleB: currentB.value,
  playbackTimeA: playbackTimeA.value,
  playbackTimeB: playbackTimeB.value,
  startedA: startedA.value,
  startedB: startedB.value,
})

</script>

<template>
  <div class="space-y-8">
    <div>
      <p class="mb-3">{{ $t('survey.instructions') }}</p>

      <div class="flex flex-col sm:flex-row gap-4 w-full">
        <div ref="samplerA" class="flex-grow">
          <Sampler class="w-full" @play="handlePlayA" :samples="samplesA" :title="$t('survey.sample', { key: 'A' })" />
        </div>
        <div ref="samplerB" class="flex-grow">
          <Sampler class="w-full" @play="handlePlayB" :samples="samplesB" :title="$t('survey.sample', { key: 'B' })" />
        </div>
      </div>
    </div>

    <div :class="{ 'opacity-40 pointer-events-none select-none': !(playedA && playedB) }">
      <p class="mb-3">{{ $t('survey.question') }}</p>

      <div class="flex flex-col sm:flex-row gap-4 w-full">
        <button @click="prefer('A')" :disabled="!(playedA && playedB)" class="p-4 font-bold flex-1 rounded bg-blue-500 hover:bg-blue-700 text-white transition">
          {{ $t('survey.answer', { key: 'A' }) }}
        </button>
        <button @click="prefer('B')" :disabled="!(playedA && playedB)" class="p-4 font-bold flex-1 rounded bg-red-500 hover:bg-red-700 text-white transition">
          {{ $t('survey.answer', { key: 'B' }) }}
        </button>
      </div>
    </div>
  </div>
</template>
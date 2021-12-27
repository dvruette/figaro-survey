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
const currentA = ref('')
const currentB = ref('')

const handlePlayA = (sample) => {
  playedA.value = true
  currentA.value = sample
}

const handlePlayB = (sample) => {
  playedB.value = true
  currentB.value = sample
}

const prefer = (choice) => emit('answer', {
  choice: choice,
  sampleA: currentA.value,
  sampleB: currentB.value
})

</script>

<template>
  <div class="space-y-8">
    <div>
      <p class="mb-3">{{ $t('survey.instructions') }}</p>

      <div class="flex flex-col sm:flex-row gap-4 w-full">
        <Sampler class="flex-grow" @play="handlePlayA" :samples="samplesA" :title="$t('survey.sample', { key: 'A' })" />
        <Sampler class="flex-grow" @play="handlePlayB" :samples="samplesB" :title="$t('survey.sample', { key: 'B' })" />
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
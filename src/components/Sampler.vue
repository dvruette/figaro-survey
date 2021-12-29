<script setup>
import { ref, watchEffect, computed } from 'vue'
import { getSample } from '../api'

const props = defineProps({
  title: String,
  samples: { type: Array, default: [] },
  maxDuration: { type: Number, default: 20 }
})

const emit = defineEmits(['play'])

const sample = ref(null)
const samplePath = ref('')
const audioRef = ref(null)
const playbackTime = ref(0)
const maxPlaybackTime = ref(null)
const playing = ref(false)

const formatTime = (time) => {
  const minutes = Math.floor(time / 60)
  const seconds = time % 60
  return `${minutes}:${('0' + seconds).slice(-2)}`
}
const formatPlaybackTime = computed(() => formatTime(Math.round(playbackTime.value)))
const formatMaxPlaybackTime = computed(() => formatTime(Math.round(maxPlaybackTime.value)))

watchEffect(() => {
  if (props.samples.length) {
    const sampleIdx = Math.floor(Math.random() * props.samples.length)
    samplePath.value = props.samples[sampleIdx]
    getSample(props.samples[sampleIdx]).then(url => {
      sample.value = url
    })
  }
})

const durationChange = (event) => {
  maxPlaybackTime.value = Math.min(event.target.duration, props.maxDuration)
}

const play = () => {
  document.querySelectorAll('audio').forEach(el => el.pause())
  const el = audioRef.value
  if (!el) return

  maxPlaybackTime.value = Math.min(props.maxDuration, el.duration)
  playing.value = true
  el.play()

  emit('play', samplePath.value)
}

const pause = () => {
  const el = audioRef.value
  if (!el) return

  playing.value = false
  el.pause()
}

const timeupdate = (event) => {
  playbackTime.value = event.target.currentTime
  if (playbackTime.value >= maxPlaybackTime.value) {
    pause()
    event.target.currentTime = 0
  }
}
</script>

<template>
  <p v-if="sample === null" class="rounded h-16 bg-gray-100 text-gray-400 border border-gray-200 font-medium flex justify-center items-center">
    Loading...
  </p>
  <div v-else class="relative rounded overflow-hidden h-16 hover:shadow-lg transition" :class="{ 'ring-[3px] ring-green-500 ring-opacity-40': playing }">
    <button @click="playing ? pause() : play()" class="relative rounded w-full h-full bg-white flex justify-center items-center border border-black border-opacity-10">
      <img v-if="playing" src="../assets/pause.svg">
      <img v-else src="../assets/play.svg">
    </button>
    <h3 class="text-xs font-bold absolute top-1 left-1.5">{{ title }}</h3>
    <p v-if="maxPlaybackTime" class="absolute bottom-1.5 left-1.5 text-xs text-gray-400 font-bold">{{formatPlaybackTime}}</p>
    <p v-if="maxPlaybackTime" class="absolute bottom-1.5 right-1.5 text-xs text-gray-400 font-bold">{{formatMaxPlaybackTime}}</p>
    <div class="absolute inset-x-0 bottom-0 h-1 bg-slate-300"></div>
    <div class="absolute left-0 bottom-0 h-1 bg-blue-500" :style="{ width: 100*(playbackTime/maxPlaybackTime)+'%' }"></div>

    <audio ref="audioRef" @timeupdate="timeupdate" @pause="pause" @durationchange="durationChange">
      <source :src="sample" type="audio/mpeg" />
    </audio>
  </div>
</template>


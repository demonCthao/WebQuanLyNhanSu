<template>
    <div class="w-12 h-12">
        <svg viewBox="0 0 50 50" class="w-full h-full -rotate-90">

            <path v-for="i in 6" :key="i" :d="arcPath(i)" fill="none" stroke-width="8" stroke-linecap="butt"
                :class="active === i ? 'stroke-gray-700 opacity-100' : 'stroke-gray-300 opacity-30'" />

        </svg>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const active = ref(1)

const radius = 20
const cx = 25
const cy = 25

const gap = 15

const arcPath = (index) => {
    const segmentAngle = 60
    const startAngle = (index - 1) * segmentAngle + gap / 2
    const endAngle = index * segmentAngle - gap / 2

    const toXY = (angle) => {
        const rad = (angle * Math.PI) / 180
        return {
            x: cx + radius * Math.cos(rad),
            y: cy + radius * Math.sin(rad)
        }
    }

    const start = toXY(startAngle)
    const end = toXY(endAngle)

    return `
    M ${start.x} ${start.y}
    A ${radius} ${radius} 0 0 1 ${end.x} ${end.y}
  `
}

onMounted(() => {
    setInterval(() => {
        active.value = active.value % 6 + 1
    }, 120)
})
</script>
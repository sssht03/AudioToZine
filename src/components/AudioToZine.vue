<template>
  <h1 class="text-5xl font-bold">AudioToZine</h1>
  <p>Powered by OpenAI</p>
  <AudioToText />
  <TextToSummary />
  <SummaryToTitle />
  <TitleToCoverImage />
</template>

<script setup lang="ts">
import AudioToText from './AudioToText.vue';
import TextToSummary from './TextToSummary.vue';
import SummaryToTitle from './SummaryToTitle.vue';
import TitleToCoverImage from './TitleToCoverImage.vue';
</script>

<style scoped></style>

<template>
  <v-card :elevation="5">
    <v-carousel
      light
      continuous
      cycle
      height="300"
      delimiter-icon="mdi-minus"
      interval="6000"
      show-arrows-on-hover
      hide-delimiter-background
    >
      <v-carousel-item v-for="index in 5" :key="index" eager>
        <v-sheet>
          <v-img
            contain
            src="https://picsum.photos/1280/720"
            position="center center"
            min-width="640"
            min-height="360"
          ></v-img>
        </v-sheet>
      </v-carousel-item>
    </v-carousel>
  </v-card>
</template>

<script>
export default {
  name: 'Carousel',
  props: {
    banner: {
      type: Array,
      require: true,
      default: () => {
        return [
          { url: 'https://dummyimage.com/hd720/00dc00' },
          { url: 'https://dummyimage.com/hd720/d65151' },
          { url: 'https://dummyimage.com/hd720/3e1ce8' },
          { url: 'https://dummyimage.com/hd720/1ee6be' },
          { url: 'https://dummyimage.com/hd720/e6d920' },
        ]
      },
    },
  },
  data() {
    return {}
  },
}
</script>

<style scoped></style>

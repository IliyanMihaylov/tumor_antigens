<template>
  <v-container
    id="searchResult"
    fluid
    tag="section"
  >
    <v-row
      align="center"
      justify="center"
    >
      <v-col cols="12">
        <v-card-text>
          <v-container
            class="pa-0"
            fluid
          >
            <search />
            <resultAntigens />
          </v-container>
        </v-card-text>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import search from './Search.vue'
  import resultAntigens from './ResultAntigens'

  export default {
    components: {
      search,
      resultAntigens,
    },
    data () {
      return {
        drawer: false,
        drawerRight: true,
        right: false,
        left: true,
      }
    },
  }
</script>

<template>
  <v-container class="grey lighten-5">
    <v-card-title
      class="text-h4 align-center font-weight-bold"
    >Search for Antigens in External Knowledge Sources</v-card-title>
    <v-form v-on:submit.prevent="search" ref="form" lazy-validation>
      <v-text-field
        label="Search For Antigens"
        placeholder="Entry name of antigen"
        outlined
        v-model="query"
        rounded
        shaped
      ></v-text-field>
      <v-progress-linear v-if="searching" indeterminate color="green"></v-progress-linear>
      <p />
      <v-btn color="success" class="mr-4" @click="search">Search</v-btn>
      <v-btn color="error" class="mr-4" @click="reset">Clear</v-btn>
    </v-form>
  </v-container>
</template>

<script>
import axios from "axios";
import csv from "csvtojson";
import { bus } from "../main.js";

export default {
  data: () => ({
    value: "",
    query: "",
    results: [],
    components: [],
    errors: [],
    selectedLandscapes: [],
    checkbox: false,
    searching: false
  }),
  methods: {
    reset() {
      this.$refs.form.reset();
      bus.$emit("search_reset");
    },

    search() {
      this.searching = true;
      bus.$emit("search_query", this.query);
      axios
        .get(
          `https://www.uniprot.org/uniprot/?query=${encodeURIComponent(
            this.query
          )}&sort=score&columns=id,entry%20name,reviewed,protein%20names,genes,organism,length,citation,sequence&format=tab&limit=5`
        )
        .then(response => {
          this.searching = false;
          this.results = response.data;
          csv({ delimiter: "\t" })
            .fromString(this.results)
            .then(jsonObj => {
              bus.$emit("search_result", jsonObj);
            });
        })
        .catch(e => {
          this.searching = false;
          this.errors.push(e);
          bus.$emit("search_reset");
        });
    }
  }
};
</script>
<template>
  <v-snackbar
    v-model="snackbar"
    bottom
    :color="color"
    :multi-line="mode === 'multi-line'"
    :timeout="timeout"
  >
    {{ EntryName }}
    <template v-slot:action="{ attrs }">
      <v-btn dark text v-bind="attrs" @click="snackbar = false">Close</v-btn>
    </template>
  </v-snackbar>
</template>

      <script>
export default {
  props: {
    snackbar: {
      type: Boolean,
      required: true
    },
    EntryName: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      color: "success",
      mode: "",
      timeout: 3000
    };
  }
};
</script>
<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      persistent
      max-width="290"
    >
      <v-card>
        <v-card-title class="headline">
          Are you sure you want to delete {{ entry }}?
        </v-card-title>
        <v-card-text>
          If you click agree {{ entry }} will be permanetly deleted.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="green darken-1"
            text
            @click="deleteCancel(entry)"
          >
            Disagree
          </v-btn>
          <v-btn
            color="green darken-1"
            text
            @click="deleteItem(entry)"
          >
            Agree
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
  import { bus } from '../../../main.js'
  import axios from 'axios'

  export default {
    props: {
      entry: {
        type: String,
        required: true,
      },
    },
    data () {
      return {
        dialog: true,
      }
    },
    methods: {
      deleteItem: function (item) {
        this.dialog = false
        axios
          .delete('http://62.44.127.197:4982/api/v1/antigen/', {
            data: {
              EntryName: item,
            },
          })
          .then(function (response) {
            if (response.status !== 200) {
              return
            }
            if (response.data.deletedCount > 0) {
              bus.$emit('delete_compleate', item)
            }
          })
          .catch(function (error) {
            bus.$emit('delete_cancel', item)
            console.log(error)
          })
      },
      deleteCancel: function (item) {
        this.dialog = false
        bus.$emit('delete_cancel', item)
      },
    },
  }
</script>

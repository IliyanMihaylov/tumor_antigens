<template>
  <v-container
    id="user-profile"
    fluid
    tag="section"
  >
    <v-row justify="center">
      <v-col
        cols="12"
        md="8"
      >
        <base-material-card>
          <template v-slot:heading>
            <div class="display-2 font-weight-light">
              Create Antigen
            </div>

            <div class="subtitle-1 font-weight-light">
              Complete Antigen fields
            </div>
          </template>

          <v-form
            ref="form"
            v-model="valid"
            lazy-validation
          >
            <v-container class="py-0">
              <v-row>
                <v-col
                  cols="12"
                  md="4"
                >
                  <v-text-field
                    v-model="Entry"
                    label="Entry ID"
                    required
                    :rules="entryRules"
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="4"
                >
                  <v-text-field
                    v-model="EntryName"
                    class="purple-input"
                    label="Entry Name"
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="4"
                >
                  <v-text-field
                    v-model="GeneName"
                    label="Gene Name"
                    class="purple-input"
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    v-model="Organism"
                    label="Organism"
                    class="purple-input"
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    v-model="ProteinNames"
                    label="Protein Names"
                    class="purple-input"
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    v-model="PubMedID"
                    label="References / Literature"
                    class="purple-input"
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    v-model="Status"
                    label="Status"
                    class="purple-input"
                  />
                </v-col>

                <v-col cols="12">
                  <v-textarea
                    v-model="Sequence"
                    class="purple-input"
                    label="Sequence"
                  />
                </v-col>

                <v-col
                  cols="12"
                  class="text-right"
                >
                  <v-btn
                    :disabled="!valid"
                    color="success"
                    class="mr-0"
                    @click="commit()"
                  >
                    Create

                    <base-material-snackbar
                      v-if="isImported"
                      v-model="snackbar"
                      type="success"
                      v-bind="{
                        [parsedDirection[0]]: true,
                        [parsedDirection[1]]: true
                      }"
                    >
                      Antigen {{ importedName }} is created successfuly.
                    </base-material-snackbar>
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </base-material-card>
      </v-col>

      <v-col
        cols="12"
        md="4"
      >
        <base-material-card
          class="v-card-profile"
          avatar="https://nlminfocusdotcom.files.wordpress.com/2019/04/ncbi_logo.jpg?w=460"
        >
          <v-card-text class="text-center">
            <h6 class="display-1 mb-1 grey--text">
              National Center for Biotechnology Information
            </h6>

            <p class="font-weight-light grey--text">
              Before creating new antigen be sure it's not already annotated and
              exist in National Center for Biotechnology Information
            </p>

            <v-btn
              color="success"
              rounded
              class="mr-0"
              href="https://www.ncbi.nlm.nih.gov/search/"
              target="_blank"
            >
              Open NCBI
            </v-btn>
          </v-card-text>
        </base-material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
    import axios from 'axios'

    export default {
        data: () => ({
            isImported: false,
            snackbar: false,
            direction: 'top right',
            valid: false,
            Entry: '',
            EntryName: '',
            importedName: '',
            GeneName: '',
            Length: '',
            Organism: '',
            ProteinNames: '',
            PubMedID: '',
            Sequence: '',
            Status: '',
            entryRules: [v => !!v || 'Entry ID is required'],
        }),
        computed: {
            parsedDirection () {
                return this.direction.split(' ')
            },
        },
        methods: {
            clean () {
                this.Entry = ''
                this.EntryName = ''
                this.GeneName = ''
                this.Length = ''
                this.Organism = ''
                this.ProteinNames = ''
                this.PubMedID = ''
                this.Sequence = ''
                this.Status = ''
            },
            validate () {
                this.$refs.form.validate()
            },
            commit () {
                this.$refs.form.validate()

                const bodyEntity = {
                    Entry: this.Entry,
                    EntryName: this.EntryName,
                    GeneName: this.GeneName,
                    Length: this.Length,
                    Organism: this.Organism,
                    ProteinNames: this.ProteinNames,
                    PubMedID: this.PubMedID,
                    Sequence: this.Sequence,
                    Status: this.Status,
                }
                axios
                    .post('http://62.44.127.197:4982/api/v1/antigen/', bodyEntity, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*',
                        },
                    })
                    .then(function (response) {
                        console.log(response)
                    })
                    .catch(function (error) {
                        console.log(error)
                    })
                this.importedName = this.EntryName
                this.snackbar = true
                this.isImported = true
                this.clean()
            },
        },
    }
</script>

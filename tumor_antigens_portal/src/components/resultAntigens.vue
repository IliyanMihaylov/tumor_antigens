<template>
  <v-container class="yellow lighten-5" v-if="show_results">
    <v-row class="text-h4">External Knowege Sources Result</v-row>
    <v-item-group>
      <v-container>
        <v-row>
          <v-col v-for="(item, i) in items" :key="i" cols="12" md="6">
            <v-card class="mx-auto indigo lighten-5" light>
              <v-card-title class="subheading font-weight-bold">{{ item['Entry'] }}</v-card-title>
              <v-divider></v-divider>
              <v-list dense>
                <v-list-item>
                  <v-list-item-content>Entry name:</v-list-item-content>
                  <v-list-item-content class="align-end">{{ item['Entry name'] }}</v-list-item-content>
                </v-list-item>

                <v-list-item v-if="item.Status">
                  <v-list-item-content>Status</v-list-item-content>
                  <v-list-item-content class="align-end">{{ item.Status }}</v-list-item-content>
                </v-list-item>

                <v-list-item v-if="item['Gene names']">
                  <v-list-item-content>Gene names</v-list-item-content>
                  <v-list-item-content class="align-end">{{ item['Gene names'] }}</v-list-item-content>
                </v-list-item>
              </v-list>

              <v-overlay :value="item.showSequence" opacity="0.9">
                <v-btn class="ma-2" icon @click="item.showSequence = false">
                  <v-icon>mdi-close</v-icon>
                </v-btn>

                <v-list-item
                  v-show="item.showSequence"
                  v-for="(sequence, i) in item.sequenceItem"
                  :key="i"
                >
                  <v-spacer />
                  <p class="text-left">{{ sequence.line.join(' ')}}</p>
                </v-list-item>
              </v-overlay>

              <v-card-actions>
                <v-btn class="mx-2" fab dark small color="green" @click="importAntigen(item)">
                  <v-icon dark>mdi-plus</v-icon>
                  <stackbarImport
                    v-if="item.isImported"
                    :snackbar="item.isImported"
                    :EntryName="item['Entry name']"
                  />
                </v-btn>

                <v-btn
                  @click="item.showSequence = !item.showSequence"
                  color="Grey"
                  text
                >Show Sequence</v-btn>
                <v-spacer></v-spacer>

                <v-btn icon @click="item.show = !item.show" text>
                  <v-icon>{{ item.show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                </v-btn>
              </v-card-actions>

              <v-expand-transition>
                <div v-show="item.show">
                  <v-divider></v-divider>
                  <v-list-item v-if="item.Organism">
                    <v-list-item-content>Organism:</v-list-item-content>
                    <v-list-item-content class="align-end">{{ item.Organism }}</v-list-item-content>
                  </v-list-item>

                  <v-list-item v-if="item['Protein names']">
                    <v-list-item-content>Protein names:</v-list-item-content>
                    <v-list-item-content class="align-end">{{ item['Protein names'] }}</v-list-item-content>
                  </v-list-item>

                  <v-list-item v-if="item.Length">
                    <v-list-item-content>Length</v-list-item-content>
                    <v-list-item-content class="align-end">{{ item.Length }}</v-list-item-content>
                  </v-list-item>

                  <v-list-item>
                    <v-list-item-content>External links:</v-list-item-content>
                    <v-list-item-content class="align-end">
                      <a v-bind:href="'https://www.uniprot.org/uniprot/'+item.Entry">UniProt Link</a>
                      <a v-bind:href="'https://www.ncbi.nlm.nih.gov/protein/'+item.Entry">NCBI Link</a>
                    </v-list-item-content>
                  </v-list-item>

                  <v-item-group>
                    <v-row>
                      <v-col v-for="(citation, i) in item.citationUrls" :key="i" cols="12" md="4">
                        <v-chip outlined>
                          <a v-bind:href="citation.url">PubMed</a>
                        </v-chip>
                      </v-col>
                    </v-row>
                  </v-item-group>
                </div>
              </v-expand-transition>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-item-group>
  </v-container>
</template>

<script>
import { bus } from "../main.js";
import axios from "axios";
import stackbarImport from "./stackbarImport";

export default {
  components: {
    stackbarImport
  },
  data: () => ({
    items: [],
    show_results: false
  }),
  methods: {
    importAntigen: function(antigen) {
      let currentAntigen = antigen;
      currentAntigen.isImported = true;
      let bodyEntity = {
        Entry: antigen["Entry"],
        EntryName: antigen["Entry name"],
        GeneName: antigen["Gene names"],
        Length: antigen["Length"],
        Organism: antigen["Organism"],
        ProteinNames: antigen["Protein names"],
        PubMedID: antigen["citationUrls"].map(x => x.url),
        Sequence: antigen["Sequence"],
        Status: antigen["Status"]
      };
      axios
        .post("http://62.44.127.197:4982/api/v1/antigen/", bodyEntity, {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        })
        .then(function(response) {
          console.log(response);
        })
        .catch(function(error) {
          console.log(error);
        });
      bus.$emit("import_data", bodyEntity);
    }
  },
  created() {
    bus.$on("search_reset", () => {
      this.show_results = false;
    });

    bus.$on("search_result", data => {
      for (let i = 0; i < data.length; i++) {
        let citations = data[i]["PubMed ID"].split(";");
        data[i].citationUrls = [];
        data[i].show = false;
        data[i].showSequence = false;
        data[i].isImported = false;
        let sequenceItem = [];
        let chunks = data[i].Sequence.match(/.{1,10}/g);
        let index = -1;
        for (let ch = 0; ch < chunks.length; ch++) {
          if (ch % 6 == 0) {
            index++;
            sequenceItem.push({ id: (ch / 6) * 60 + 1, line: [] });
          }
          sequenceItem[index].line.push(chunks[ch]);
        }

        data[i].sequenceItem = sequenceItem;
        for (let j = 0; j < citations.length; j++) {
          let citationId = citations[j].trim();
          data[i].citationUrls.push({
            url: `https://pubmed.ncbi.nlm.nih.gov/${citationId}/`
          });
        }
      }
      this.items = data;
      this.show_results = true;
    });
  }
};
</script>
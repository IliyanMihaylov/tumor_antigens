
<template>
  <v-container fluid>
    <v-data-iterator
      :items="items"
      :items-per-page.sync="itemsPerPage"
      :page="page"
      :search="search"
      :sort-by="sortBy.toLowerCase()"
      :sort-desc="sortDesc"
      hide-default-footer
    >
      <template v-slot:header>
        <v-container>
          <v-card-title class="text-h4 font-weight-bold">Integrated Antigens</v-card-title>
          <v-toolbar dark color="blue darken-3" class="mb-1">
            <v-text-field
              v-model="search"
              clearable
              flat
              solo-inverted
              hide-details
              :prepend-inner-icon="icons.mdiFileSearch"
              label="Search"
            ></v-text-field>
          </v-toolbar>
        </v-container>
      </template>

      <template v-slot:default="props">
        <v-container>
          <v-row>
            <v-col v-for="item in props.items" :key="item.name" cols="12" sm="6" md="2" lg="6">
              <v-card class="mx-auto indigo lighten-5" light>
                <v-card-title class="subheading font-weight-bold">{{ item['Entry'] }}</v-card-title>
                <v-divider></v-divider>
                <v-list dense>
                  <v-list-item>
                    <v-list-item-content>Entry name:</v-list-item-content>
                    <v-list-item-content class="align-end">{{ item['EntryName'] }}</v-list-item-content>
                  </v-list-item>

                  <v-list-item v-if="item.Status">
                    <v-list-item-content>Status</v-list-item-content>
                    <v-list-item-content class="align-end">{{ item.Status }}</v-list-item-content>
                  </v-list-item>

                  <v-list-item v-if="item['GeneName']">
                    <v-list-item-content>Gene names</v-list-item-content>
                    <v-list-item-content class="align-end">{{ item['GeneName'] }}</v-list-item-content>
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
                  <v-btn class="mx-2" fab dark small color="red" @click="deleteItem(item)">
                    <v-icon dark>{{ icons.mdiDelete }}</v-icon>
                    <deleteAntigens v-if="item.deleteClick" :EntryName="item.EntryName" />
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

                    <v-list-item v-if="item['ProteinNames']">
                      <v-list-item-content>Protein names:</v-list-item-content>
                      <v-list-item-content class="align-end">{{ item['ProteinNames'] }}</v-list-item-content>
                    </v-list-item>

                    <v-list-item v-if="item.Length">
                      <v-list-item-content>Length</v-list-item-content>
                      <v-list-item-content class="align-end">{{ item.Length }}</v-list-item-content>
                    </v-list-item>

                    <v-list-item>
                      <v-list-item-content>External links:</v-list-item-content>
                      <v-list-item-content class="align-end">
                        <a v-bind:href="'https://www.uniprot.org/uniprot/'+item.Entry">UniProt Link</a>
                        <a
                          v-bind:href="'https://www.ncbi.nlm.nih.gov/protein/'+item.Entry"
                        >NCBI Link</a>
                      </v-list-item-content>
                    </v-list-item>

                    <v-item-group>
                      <v-row>
                        <v-col v-for="(citation, i) in item.PubMedID" :key="i" cols="12" md="4">
                          <v-chip outlined>
                            <a v-bind:href="citation">PubMed</a>
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
      </template>

      <template v-slot:footer>
        <v-container>
          <v-row class="mt-2" align="center" justify="center">
            <span class="grey--text">Items per page</span>
            <v-menu offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn dark text color="primary" class="ml-2" v-bind="attrs" v-on="on">
                  {{ itemsPerPage }}
                  <v-icon>mdi-chevron-down</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                  v-for="(number, index) in itemsPerPageArray"
                  :key="index"
                  @click="updateItemsPerPage(number)"
                >
                  <v-list-item-title>{{ number }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>

            <v-spacer></v-spacer>

            <span class="mr-4 grey--text">Page {{ page }} of {{ numberOfPages }}</span>
            <v-btn fab dark color="blue darken-3" class="mr-1" @click="formerPage">
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
            <v-btn fab dark color="blue darken-3" class="ml-1" @click="nextPage">
              <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
          </v-row>
        </v-container>
      </template>
    </v-data-iterator>
  </v-container>
</template>


<script>
import { bus } from "../main.js";
import axios from "axios";
import { mdiDelete, mdiFileSearch } from "@mdi/js";
import deleteAntigens from "./deleteAntigens.vue";

export default {
  components: {
    deleteAntigens
  },
  data: () => ({
    items: [],
    itemsPerPageArray: [2, 4, 8, 16, 32],
    itemsPerPage: 6,
    page: 1,
    search: "",
    filter: {},
    sortDesc: false,
    sortBy: "EntryName",
    keys: [],
    show_results: false,
    icons: {
      mdiDelete,
      mdiFileSearch
    },
    query: ""
  }),
  computed: {
    numberOfPages() {
      return Math.ceil(this.items.length / this.itemsPerPage);
    },
    filteredKeys() {
      return this.keys.filter(key => key !== `Name`);
    }
  },
  methods: {
    nextPage() {
      if (this.page + 1 <= this.numberOfPages) this.page += 1;
    },
    formerPage() {
      if (this.page - 1 >= 1) this.page -= 1;
    },
    updateItemsPerPage(number) {
      this.itemsPerPage = number;
    },
    deleteItem: function(item) {
      return (item.deleteClick = !item.deleteClick);
    },
    getItems: function() {
      if (!this.query) {
        return this.items;
      }
      return this.items.filter(item => item.EntryName.includes(this.query));
    },
    calculateSequence: function(seuqnce) {
      let sequenceItem = [];
      let chunks = seuqnce.match(/.{1,10}/g);
      let index = -1;
      for (let ch = 0; ch < chunks.length; ch++) {
        if (ch % 6 == 0) {
          index++;
          sequenceItem.push({ id: (ch / 6) * 60 + 1, line: [] });
        }
        sequenceItem[index].line.push(chunks[ch]);
      }
      return sequenceItem;
    },
    fetchData: function() {
      let that = this;
      axios
        .get("http://62.44.127.197:4982/api/v1/antigen/")
        .then(function(response) {
          for (let i = 0; i < response.data.length; i++) {
            let currentData = response.data[i];
            currentData.showSequence = false;
            currentData.deleteClick = false;
            currentData.show = false;
            let sequenceItem = [];
            let chunks = currentData.Sequence.match(/.{1,10}/g);
            let index = -1;
            for (let ch = 0; ch < chunks.length; ch++) {
              if (ch % 6 == 0) {
                index++;
                sequenceItem.push({ id: (ch / 6) * 60 + 1, line: [] });
              }
              sequenceItem[index].line.push(chunks[ch]);
            }
            currentData.sequenceItem = that.calculateSequence(
              currentData.Sequence
            );
            that.items.push(currentData);
            that.keys.push(currentData.EntryName);
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  },
  created() {
    bus.$on("search_query", data => {
      this.query = data;
    });

    bus.$on("import_data", data => {
      this.query = "";
      data.showSequence = false;
      data.deleteClick = false;
      data.show = false;
      data.sequenceItem = this.calculateSequence(data["Sequence"]);
      this.items.unshift(data);
    });

    bus.$on("delete_cancel", data => {
      this.items.filter(item => item.EntryName == data)[0].deleteClick = false;
    });

    bus.$on("delete_compleate", data => {
      this.items.splice(
        this.items.findIndex(item => item.EntryName === data),
        1
      );
    });
    this.fetchData();
  }
};
</script>
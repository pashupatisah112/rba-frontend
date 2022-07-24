<template>
<div>
    <v-container>
        <v-data-table :headers="headers" :loading="dataLoading" :items="projects" sort-by="calories" class="elevation-1">
            <template v-slot:top>
                <v-toolbar flat>
                    <v-toolbar-title>My Data</v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                    <v-dialog v-model="dialog" max-width="400px">
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                                <v-icon>mdi-plus</v-icon>
                                New Record
                            </v-btn>
                        </template>
                        <v-card>
                            <v-card-title>
                                <span class="text-h5">{{ formTitle }}</span>
                            </v-card-title>

                            <v-card-text>
                                <v-container>
                                    <v-col>
                                        <v-form v-model="valid" ref="form">
                                            <v-text-field v-model="editedItem.title" small solo :rules="[validRules.required]" label="Title of project"></v-text-field>
                                            <v-text-field v-model="editedItem.budget" :rules="[validRules.required]" type="number" small solo label="Total budget"></v-text-field>
                                            <v-select v-model="editedItem.type" :rules="[validRules.required]" :items="types" item-text="title" item-value="title" small solo label="Select Project Type"></v-select>
                                            <v-select v-model="editedItem.leader" :rules="[validRules.required]" :items="leaders" item-text="name" item-value="name" small solo label="Select Leader""></v-select>
                                    </v-form>
                                    </v-col>
                                </v-container>
                            </v-card-text>

                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color=" #3399D1" small @click="close" dark>
                                                Cancel
                                                </v-btn>
                                                <v-btn color="#3399D1" small @click="save" dark :loading="loading">
                                                    Save
                                                </v-btn>
                                                </v-card-actions>
                        </v-card>
                    </v-dialog>
                    <v-dialog v-model="dialogDelete" max-width="500px">
                        <v-card>
                            <v-card-title>Are you sure you want to delete this project?</v-card-title>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="#3399D1" small dark @click="closeDelete">Cancel</v-btn>
                                <v-btn color="#3399D1" small dark @click="deleteItemConfirm" :loading="deleting">Ok</v-btn>
                                <v-spacer></v-spacer>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-toolbar>
            </template>
            <template v-slot:item.actions="{ item }">
                <v-icon small class="mr-2" @click="editItem(item)">
                    mdi-pencil
                </v-icon>
                <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
            </template>
            <template v-slot:no-data>
                <v-btn color="primary" @click="initialize"> Reset </v-btn>
            </template>
        </v-data-table>
    </v-container>
</div>
</template>

<script>
export default {
  data: () => ({
    dialog: false,
    valid: true,
    dialogDelete: false,
    deleting:false,
    dataLoading:true,
    headers: [
      {
        text: "Title",
        align: "start",
        sortable: false,
        value: "title",
      },
      {
        text: "Budget",
        value: "budget",
      },
      {
        text: "Type",
        value: "type",
      },
      {
        text: "Leader",
        value: "leader",
      },
      {
        text: "Added By",
        value: "user.name",
      },
      {
        text: "Actions",
        value: "actions",
        sortable: false,
      },
    ],
    loading: false,
    projects: [],
    editedIndex: -1,
    editedItem: {
      title: "",
      budget: "",
      type: "",
      leader: "",
    },
    defaultItem: {
      title: "",
      budget: "",
      type: "",
      leader: "",
    },
    leaders: [
      {
        name: "Sam Wilson",
      },
      {
        name: "Rober Downy",
      },
      {
        name: "Steve Rogers",
      },
    ],
    validRules: {
      required: (value) => !!value || "Required",
      validEmail: (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    },
    types: [
      {
        title: "Type A",
      },
      {
        title: "Type B",
      },
      {
        title: "Type C",
      },
    ],
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Project" : "Edit Project";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    this.initialize();
  },

  methods: {
    initialize() {
      this.$axios
        .get("/projects")
        .then((res) => {
          this.dataLoading=false
          this.projects=res.data
          })
        .catch((err) => console.log(err.response));
    },

    editItem(item) {
      this.editedIndex = this.projects.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.projects.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.deleting=true
      this.$axios.delete('/projects/'+this.editedItem.id)
      .then(res=>{
        this.deleting=false
          this.projects.splice(this.editedIndex,1)
      })
      .catch(err=>console.log(err.response))
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$refs.form.reset()
      this.loading=false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.$refs.form.validate()) {
        this.loading = true;
        if (this.editedIndex > -1) {
          this.$axios
            .put("/projects/"+this.editedItem.id, {
              title: this.editedItem.title,
              budget: this.editedItem.budget,
              type: this.editedItem.type,
              leader: this.editedItem.leader,
            })
            .then((res) => {
              this.projects.splice(
                this.editedIndex,
                1,
                res.data
              );
              this.close();
              this.loading = false;
            })
            .catch((err) => console.log(err.response));
        } else {
          this.$axios
            .post("/projects", {
              title: this.editedItem.title,
              budget: this.editedItem.budget,
              type: this.editedItem.type,
              leader: this.editedItem.leader,
            })
            .then((res) => {
              this.projects.push(res.data);
              this.close();
              this.loading = false;
            })
            .catch((err) => console.log(err.response));
        }
      }
    },
  },
};
</script>

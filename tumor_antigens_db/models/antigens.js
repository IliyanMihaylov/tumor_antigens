const mongoose = require('mongoose');

const { Schema } = mongoose;

const antigenShema = new Schema(
    {
        Entry: {
            type: String,
            required: 'this is entry id which are direct related to UniProt and NCI'
        },
        EntryName: {
            type: String,
        },
        GeneName: {
            type: String,
        },
        Length: {
            type: Number,
        },
        Organism: {
            type: String,
        },
        ProteinNames: {
            type: String,
        },
        PubMedID: {
            type: [String],
        },
        Sequence: {
            type: String,
        },
        Status: {
            type: String,
        }

    },
    { collection: 'antigen' }
);

module.exports = mongoose.model('antigen', antigenShema);
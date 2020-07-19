const mongoose = require('mongoose');
const antigen = mongoose.model('antigen');

exports.list_all_antigen = (req, res) => {
    antigen.find({}, (err, gen) => {
        if (err) res.send(err);
        res.json(gen);
    });
};

exports.create_a_antigen = (req, res) => {
    const newAntigen = new antigen(req.body);
    console.log({ EntryName: newAntigen.EntryName })
    console.log(newAntigen)
    antigen.update({ EntryName: newAntigen.EntryName }, newAntigen, { upsert: true },
        (err, gen) => {
            if (err) res.send(err);
            res.json(gen);
        });
};

exports.delete_a_antigen = (req, res) => {
    req.body.EntryName;
    antigen.deleteOne({ EntryName: req.body.EntryName }, (err, gen) => {
        if (err) res.send(err);
        res.json(gen);
    });
};
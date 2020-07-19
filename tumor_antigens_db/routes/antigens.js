const antigenBuilder = require('../controllers/antigenController');

module.exports = app => {
    app
        .route('/api/v1/antigen')
        .get(antigenBuilder.list_all_antigen)
        .post(antigenBuilder.create_a_antigen)
        .delete(antigenBuilder.delete_a_antigen)
};

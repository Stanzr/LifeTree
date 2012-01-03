var options = {};

function setOptions(opts) {
    options = opts;
    return api;

}
exports.configure = setOptions;
var api = {};
api.index = function (req, res) {
    options.dbModels.Survey.find({}, function (err, survey) {
        res.render('survey', {'surveys':survey});
    });
};
api.new = function (req, res) {
    res.send('new survey');
};
api.create = function (req, res) {
    res.send('create survey');
};
api.show = function (req, res) {
    options.dbModels.Survey.findOne({'slug':req.params.survey}, {'include':{'survey_questions':{'include':{'answers':{}}}}}, function (err, survey) {
        if (err) {

        } else {
            if (!survey) {

            }
        }
        var range = ['Extremely important', 'Important', 'Somewhat Important'];
        res.render('survey', {'survey':survey, 'default_range':range});
    });
};
api.edit = function (req, res) {
    res.send('edit survey ' + req.params.survey);

};
api.update = function (req, res) {
    res.send('update survey ' + req.params.survey);
};
api.destroy = function (req, res) {
    res.send('destroy survey ' + req.params.survey);
};

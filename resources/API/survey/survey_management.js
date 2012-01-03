var options = {};

function setOptions(opts) {
    options = opts;
    return api;

}
exports.configure = setOptions;
var api = {};
api.index = function (req, res) {
    res.send('survey index ' + options.name);
};
api.new = function (req, res) {
    res.send('new survey');
};
api.create = function (req, res) {
    res.send('create survey');
};
api.show = function (req, res) {
    res.send('show survey ' + req.params.survey);
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

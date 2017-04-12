export default function routes404(app) {
    app.use(function (req, res) {
        res.status(404);

        if (req.accepts('html')) {
            render404(res);
        } else if (req.accepts('json')) {
            res.json({error: 'Not found'});
        } else {
            render404(res);
        }

        function render404(res) {
            res.render('404', {title: 'Page Not Found'});
        }
    });
}

const { nanoid } = require('nanoid');
const db = require('../../db');

exports.createShortUrl = (req, res) => {
    const { url: org_url, validity } = req.body;
    const shortc = nanoid(8);
    const createt = new Date();
    const validityMins = validity || 30;
    const expiret = new Date(createt.getTime() + validityMins * 60 * 1000);
    const sql = `INSERT INTO urls (shortc, org_url, createt, expiret) VALUES (?, ?, ?, ?)`;
    const params = [shortc, org_url, createt.toISOString(), expiret.toISOString()];

    db.run(sql, params, function(err) {
        if (err) return res.sendStatus(500);
        const shortLink = `${req.protocol}://${req.get('host')}/${shortc}`;
        res.status(201).json({ shortLink: shortLink, expiry: expiret.toISOString() });
    });
};

exports.redirectUrl = (req, res) => {
    const { shortc } = req.params;
    const selectSql = `SELECT org_url, expiret FROM urls WHERE shortc = ?`;

    db.get(selectSql, [shortc], (err, row) => {
        if (err) return res.sendStatus(500);
        if (!row) return res.sendStatus(404);

        if (new Date() > new Date(row.expiret)) {
            return res.status(410).send('Link has expired');
        }
        
        const insertSql = `INSERT INTO analytics (url_shortc, clickt, author, loc) VALUES (?, ?, ?, ?)`;
        db.run(insertSql, [shortc, new Date().toISOString(), req.get('Referrer') || 'Direct', 'Unknown']);
        
        res.redirect(302, row.org_url);
    });
};

exports.getStats = (req, res) => {
    const { shortc } = req.params;
    const urlSql = `SELECT org_url, createt, expiret FROM urls WHERE shortc = ?`;
    const analyticsSql = `SELECT * FROM analytics WHERE url_shortc = ?`;

    db.get(urlSql, [shortc], (err, urlRow) => {
        if (err) return res.sendStatus(500);
        if (!urlRow) return res.sendStatus(404);

        db.all(analyticsSql, [shortc], (err, analyticsRows) => {
            if (err) return res.sendStatus(500);
            res.status(200).json({
                total_clicks: analyticsRows.length,
                original_url: urlRow.org_url,
                creation_date: urlRow.createt,
                expiry_date: urlRow.expiret,
                click_data: analyticsRows.map(r => ({ timestamp: r.clickt, source: r.author, location: r.loc }))
            });
        });
    });
};
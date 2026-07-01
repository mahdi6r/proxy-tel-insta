import express from "express";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        status: "ok",
        service: "Telegram / Instagram Proxy"
    });
});

// =========================
// Telegram
// =========================

app.all("/telegram/*", async (req, res) => {

    try {

        const path = req.params[0];

        const response = await fetch(
            "https://api.telegram.org/" + path,
            {
                method: req.method,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body:
                    req.method === "GET"
                        ? undefined
                        : new URLSearchParams(req.body)
            }
        );

        const text = await response.text();

        res.status(response.status).send(text);

    } catch (e) {

        console.error(e);

        res.status(500).json({
            success: false,
            error: e.message
        });

    }

});

// =========================
// Instagram / Facebook Graph
// =========================

app.all("/graph/*", async (req, res) => {

    try {

        const path = req.params[0];

        const response = await fetch(
            "https://graph.facebook.com/" + path,
            {
                method: req.method,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body:
                    req.method === "GET"
                        ? undefined
                        : new URLSearchParams(req.body)
            }
        );

        const text = await response.text();

        res.status(response.status).send(text);

    } catch (e) {

        console.error(e);

        res.status(500).json({
            success: false,
            error: e.message
        });

    }

});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log("Proxy started on port", port);
});

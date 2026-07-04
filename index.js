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
// =========================
// Bale Test
// =========================

app.post("/bale-test", async (req, res) => {

    try {

        console.log("===== WEBHOOK RECEIVED =====");
        console.log(JSON.stringify(req.body, null, 2));

        const photo = req.body?.message?.photo?.[0];

        if (!photo) {
            return res.json({
                success: false,
                message: "No photo found"
            });
        }

        const fileId = photo.file_id;

        console.log("FILE ID:", fileId);

        const response = await fetch(
            `https://tapi.bale.ai/bot${process.env.BALE_TOKEN}/getFile`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    file_id: fileId
                })
            }
        );

        const data = await response.json();

        console.log("GETFILE RESPONSE:");
        console.log(JSON.stringify(data, null, 2));

        res.json(data);

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

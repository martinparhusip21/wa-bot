const path = require("path");
const fastify = require("fastify")({ logger: false });
const waState = require("./waState");
require("./index.js"); // Mulai WhatsApp bot

// Setup static files
fastify.register(require("@fastify/static"), {
  root: path.join(__dirname, "public"),
  prefix: "/",
});

// Templating engine untuk halaman
fastify.register(require("@fastify/view"), {
  engine: { handlebars: require("handlebars") },
});

// Route utama untuk menampilkan status WhatsApp bot
fastify.get("/", function (request, reply) {
  let params = {
    status: waState.status,
    qr: waState.qr,
  };
  return reply.view("/src/pages/index.hbs", params);
});

// Jalankan server
fastify.listen({ port: process.env.PORT, host: "0.0.0.0" }, function (err, address) {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Your app is listening on ${address}`);
});

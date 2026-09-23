import arcjet, { detectBot, shield, tokenBucket, slidingWindow } from "@arcjet/node";


const aj = arcjet({
  key: process.env.ARCJET_KEY, // Get your site key from https://console.arcjet.com
  rules: [
    shield({ mode: "LIVE" }),
    detectBot({
      mode: "LIVE", // Blocks requests. Use "DRY_RUN" to log only
      allow: [
        "CATEGORY:SEARCH_ENGINE", // Google, Bing, etc
        "CATEGORY:PREVIEW", // Link previews such as Slack, Discord
      ],
    }),
    slidingWindow({
        mode:"LIVE",
        interval:"2s",
        max:5
    })
  ],
});


export default aj
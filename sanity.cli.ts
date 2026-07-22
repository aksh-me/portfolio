import { defineCliConfig } from "sanity/cli";

// Used by the Sanity CLI (`npx sanity deploy`) to host the editor at
// <hostname>.sanity.studio. axsh.me/admin redirects there.
export default defineCliConfig({
  api: {
    projectId: "480o7clx",
    dataset: "production",
  },
  studioHost: "axsh-portfolio", // → axsh-portfolio.sanity.studio
  deployment: { autoUpdates: true },
});

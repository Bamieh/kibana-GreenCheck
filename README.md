# Kibana GreenCheck
Logo here


Kibana Greencheck is a developer-focused tool designed to improve the quality of pull requests and ease the review burden.

It acts as an intelligent assistant that guides developers when making changes, ensuring alignment with Kibana's internal rules and documentation. The goal is not to block developers, but to provide advisory feedback that leads to cleaner pull requests, better migrations, and faster approvals.

At its core, Greencheck analyzes code changes, asks developers clarifying questions about their intent, cross-references Kibana documentation, and provides clear recommendations. When developers are ready to open a pull request, it generates a concise summary for reviewers, helping them skim changes more effectively.


## Flowcharts


## Links
- [Presentation doc](https://docs.google.com/document/d/1hNdbs2xfctvHiOMXrESWYh0zyUVxeuuODPTYP0pgkps/edit?tab=t.0)
- [Slides]()TBD

### Resources
- [Github Models in Actions](https://github.blog/ai-and-ml/generative-ai/automate-your-project-with-github-models-in-actions/)



## NOTES DELETE
```
  "exports": {
    ".": {
      "import": "./src/index.ts",
      "types": "./src/index.ts",
      "default": "./src/index.ts"
    },
    "./*": "./src/*"
  },
  "publishConfig": {
    "exports": {
      ".": {
        "import": "./dist/index.mjs",
        "types": "./dist/index.d.ts",
        "default": "./dist/index.mjs"
      },
      "./*": "./dist/*"
    }
  },
  "sideEffects": false,
  "files": [
    "dist/**"
  ],
```
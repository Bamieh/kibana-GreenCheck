# Kibana GreenCheck
Logo here


Kibana Greencheck is a developer-focused tool designed to improve the quality of pull requests and ease the review burden.

It acts as an intelligent assistant that guides developers when making changes, ensuring alignment with Kibana's internal rules and documentation. The goal is not to block developers, but to provide advisory feedback that leads to cleaner pull requests, better migrations, and faster approvals.

At its core, Greencheck analyzes code changes, asks developers clarifying questions about their intent, cross-references Kibana documentation, and provides clear recommendations. When developers are ready to open a pull request, it generates a concise summary for reviewers, helping them skim changes more effectively.


## Flowcharts

Flow overview
1. check the code changes
2. conditional: does it have SO changes?
2a. if no: point to the relevant documentation
2b. if yes: continue below
3. Understand the intent of the changes by using HIL (human in the loop) and asks the developer about the changes for more context.
3a. uses elasticsearch vector database (embeddables) to grab relevant part of the docs in the SO migrations doc
3b. creates a json diff of the SO attributes changes and verifies them with the developer
4. feeds both 3.a and 3.b to an AI agent that will generate a migrations function and compares it to the one the developer has written already.
4a. suggest updating the function they have if needed and give feedback
5. comment on the PR with a summary of the findings for the code reviewer to see to make their code review easier



## Links
- [Presentation doc](https://docs.google.com/document/d/1hNdbs2xfctvHiOMXrESWYh0zyUVxeuuODPTYP0pgkps/edit?tab=t.0)
- [Slides]()TBD

### Resources
- [Github Models in Actions](https://github.blog/ai-and-ml/generative-ai/automate-your-project-with-github-models-in-actions/)




## NOTES DELETE
```

```